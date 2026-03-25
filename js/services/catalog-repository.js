/**
 * Repositório Central do Catálogo
 * Conectado GLOBALMENTE via Firebase Firestore.
 */

import { db } from '../firebase-config.js';
import { collection, getDocs, doc, setDoc, deleteDoc, getDoc } from 'https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js';
import { logAdminAction } from './firebase-service.js';

const DEVICES_DATA_PATH = './data/devices.json';
const COLLECTION_NAME = 'devices';

export const CatalogRepository = {
  // Hidrata o banco na nuvem UMA ÚNICA VEZ caso esteja vazio
  async init() {
    const snapshot = await getDocs(collection(db, COLLECTION_NAME));
    if (snapshot.empty) {
      console.log('[Catálogo] Iniciando hidratação global no Firestore...');
      try {
        const response = await fetch(DEVICES_DATA_PATH);
        let devices = await response.json();
        
        // Adiciona flags administrativas padrão aos dados originais
        devices = devices.map(device => ({
          ...device,
          active: true,
          featured: device.badge === 'Recomendado' || !!device.badge,
          createdAt: new Date().toISOString()
        }));
        
        // Grava lote inicial
        const promises = devices.map(d => setDoc(doc(db, COLLECTION_NAME, d.id), d));
        await Promise.all(promises);
        console.log('[Catálogo] Hidratação global concluída!');
      } catch (error) {
        console.error('Erro ao inicializar o repositório do catálogo:', error);
      }
    }
    
    // Omit logs since it's a silent background sweep
    try { await this.cleanupExpiredTrash(); } catch(e){}
  },

  async getAll() {
    const snapshot = await getDocs(collection(db, COLLECTION_NAME));
    const devices = [];
    snapshot.forEach(doc => {
       const data = doc.data();
       if (!data.trashed) devices.push({ id: doc.id, ...data });
    });
    return devices;
  },

  async getActive() {
    const all = await this.getAll();
    return all.filter(device => device.active);
  },

  async getById(id) {
    const docSnap = await getDoc(doc(db, COLLECTION_NAME, id));
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
  },

  async save(deviceData, isNew = false) {
    let finalId = deviceData.id;
    let docRef = doc(db, COLLECTION_NAME, finalId);
    let existing = await getDoc(docRef);
    
    // Fallback Anti-Colisão para "Criação" com Slug duplicado
    if (isNew && existing.exists() && !existing.data().trashed) {
       const suffix = Math.floor(1000 + Math.random() * 9000);
       finalId = `${finalId}-${suffix}`;
       deviceData.id = finalId;
       deviceData.slug = finalId;
       docRef = doc(db, COLLECTION_NAME, finalId);
       existing = await getDoc(docRef);
       if (existing.exists()) throw new Error("Falha rara de colisão dupla no slug. Tente salvar novamente.");
    }

    const payload = { ...deviceData, updatedAt: new Date().toISOString() };
    if (!existing.exists() || existing.data().trashed) payload.createdAt = new Date().toISOString();
    
    // Se o doc existia como trashed, a gravação de cima limpa a flag se passarmos trashed: null (Firebase ignora undefined no update, usamos false)
    payload.trashed = false;

    await setDoc(docRef, payload, { merge: true });
    
    const beforeData = existing.exists() && !existing.data().trashed ? existing.data() : null;
    await logAdminAction(beforeData ? 'UPDATE_DEVICE' : 'CREATE_DEVICE', finalId, { 
      before: beforeData, 
      after: payload,
      model: payload.model
    });
    
    return payload;
  },

  async delete(id) {
    const docRef = doc(db, COLLECTION_NAME, id);
    const existing = await getDoc(docRef);
    const beforeData = existing.exists() ? existing.data() : null;
    
    // Lixeira de 15 Dias (Soft Delete)
    await setDoc(docRef, { trashed: true, trashedAt: new Date().toISOString() }, { merge: true });
    
    await logAdminAction('DELETE_DEVICE', id, { 
      before: beforeData, 
      after: null, 
      model: beforeData?.model || id 
    });
  },

  async cleanupExpiredTrash() {
      const snapshot = await getDocs(collection(db, COLLECTION_NAME));
      const now = Date.now();
      const DAYS_15 = 15 * 24 * 60 * 60 * 1000;
      let count = 0;
      
      snapshot.forEach(docSnap => {
         const data = docSnap.data();
         if (data.trashed && data.trashedAt) {
            const trashedTime = new Date(data.trashedAt).getTime();
            if (now - trashedTime > DAYS_15) {
               deleteDoc(doc(db, COLLECTION_NAME, docSnap.id));
               count++;
            }
         }
      });
      if (count > 0) console.log(`[Lixeira] ${count} produtos com Hard Delete efetuado.`);
  },

  // Gera um ID/Slug a partir do modelo e marca
  generateSlug(brand, model) {
    return `${brand}-${model}`
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove acentos
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
};