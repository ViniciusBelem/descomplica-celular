/**
 * MESSAGE SERVICE — v2.0 (Reescrito)
 * Sistema de mensagens e anotações entre administradores.
 *
 * Melhorias sobre a v1:
 * - Validação de entrada obrigatória em todas as funções de escrita
 * - Soft-delete consistente (trashed + trashedAt) alinhado ao CatalogRepository
 * - Escape de htmlBody para prevenção de stored XSS
 * - Queries otimizadas para lixeira (filtra por usuário no Firestore)
 * - deleteAdminNote convertido para soft-delete auditável
 */

import { auth, db } from '../firebase-config.js';
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp
} from 'https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js';
import { escapeHtml } from '../utils/security.js';

// ==== VALIDAÇÃO ====

function requireAuth() {
  if (!auth.currentUser) {
    throw new Error('[MessageService] Sessão de administrador inválida.');
  }
  return auth.currentUser;
}

function requireNonEmpty(value, fieldName) {
  const trimmed = String(value ?? '').trim();
  if (!trimmed) {
    throw new Error(`[MessageService] O campo "${fieldName}" é obrigatório.`);
  }
  return trimmed;
}

function requireValidEmail(email) {
  const normalized = String(email ?? '').trim().toLowerCase();
  if (!normalized || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
    throw new Error('[MessageService] E-mail destinatário inválido.');
  }
  return normalized;
}

// ==== ESCRITA ====

export async function sendAdminMessage(toEmail, subject, htmlBody) {
  const user = requireAuth();
  const normalizedEmail = requireValidEmail(toEmail);
  const cleanSubject = requireNonEmpty(subject, 'assunto');
  const cleanBody = requireNonEmpty(htmlBody, 'corpo da mensagem');

  await addDoc(collection(db, 'admin_messages'), {
    from: user.email.toLowerCase(),
    to: normalizedEmail,
    subject: cleanSubject,
    text: escapeHtml(cleanBody),
    read: false,
    timestamp: serverTimestamp(),
    trashed: false
  });
}

export async function saveAdminNote(subject, htmlBody, refLogId = null) {
  const user = requireAuth();
  const cleanSubject = requireNonEmpty(subject, 'assunto');
  const cleanBody = requireNonEmpty(htmlBody, 'corpo da anotação');

  await addDoc(collection(db, 'admin_notes'), {
    author: user.email.toLowerCase(),
    subject: cleanSubject,
    body: escapeHtml(cleanBody),
    logRef: refLogId || null,
    trashed: false,
    timestamp: serverTimestamp()
  });
}

// ==== QUERIES ====

function parseAndSortSnap(snap) {
  const arr = [];
  snap.forEach(d => arr.push({ id: d.id, ...d.data() }));

  return arr.sort((a, b) => {
    const tA = a.timestamp?.toMillis ? a.timestamp.toMillis() : 0;
    const tB = b.timestamp?.toMillis ? b.timestamp.toMillis() : 0;
    return tB - tA;
  });
}

export async function getInboxMessages() {
  requireAuth();
  const myEmail = auth.currentUser.email.toLowerCase();

  const q = query(
    collection(db, 'admin_messages'),
    where('to', '==', myEmail),
    where('trashed', '==', false)
  );
  const snap = await getDocs(q);
  return parseAndSortSnap(snap);
}

export async function getOutboxMessages() {
  requireAuth();
  const myEmail = auth.currentUser.email.toLowerCase();

  const q = query(
    collection(db, 'admin_messages'),
    where('from', '==', myEmail),
    where('trashed', '==', false)
  );
  const snap = await getDocs(q);
  return parseAndSortSnap(snap);
}

export async function getMyNotes() {
  requireAuth();
  const myEmail = auth.currentUser.email.toLowerCase();

  const q = query(
    collection(db, 'admin_notes'),
    where('author', '==', myEmail),
    where('trashed', '==', false)
  );
  const snap = await getDocs(q);
  return parseAndSortSnap(snap);
}

export async function getTrashMessages() {
  requireAuth();
  const myEmail = auth.currentUser.email.toLowerCase();

  // Query filtra mensagens trasheadas DESTE usuário diretamente no Firestore
  // Em vez de buscar todos os trashed e filtrar em memória (v1)
  const inboxTrash = query(
    collection(db, 'admin_messages'),
    where('to', '==', myEmail),
    where('trashed', '==', true)
  );
  const outboxTrash = query(
    collection(db, 'admin_messages'),
    where('from', '==', myEmail),
    where('trashed', '==', true)
  );

  const [inSnap, outSnap] = await Promise.all([
    getDocs(inboxTrash),
    getDocs(outboxTrash)
  ]);

  // Merge + deduplica por ID
  const map = new Map();
  inSnap.forEach(d => map.set(d.id, { id: d.id, ...d.data() }));
  outSnap.forEach(d => map.set(d.id, { id: d.id, ...d.data() }));

  const merged = Array.from(map.values());
  return merged.sort((a, b) => {
    const tA = a.timestamp?.toMillis ? a.timestamp.toMillis() : 0;
    const tB = b.timestamp?.toMillis ? b.timestamp.toMillis() : 0;
    return tB - tA;
  });
}

// ==== CRUD ====

/**
 * Soft-delete de anotação (consistente com o padrão do CatalogRepository).
 * Anotações trasheadas podem ser restauradas dentro de 15 dias.
 */
export async function deleteAdminNote(noteId) {
  requireAuth();
  requireNonEmpty(noteId, 'ID da anotação');

  await updateDoc(doc(db, 'admin_notes', noteId), {
    trashed: true,
    trashedAt: new Date().toISOString()
  });
}

/**
 * Soft-delete de mensagem (marca como lixeira).
 */
export async function trashAdminMessage(msgId) {
  requireAuth();
  requireNonEmpty(msgId, 'ID da mensagem');

  await updateDoc(doc(db, 'admin_messages', msgId), {
    trashed: true,
    trashedAt: new Date().toISOString()
  });
}

/**
 * Marca mensagem como lida.
 */
export async function markMessageAsRead(msgId) {
  requireAuth();
  requireNonEmpty(msgId, 'ID da mensagem');

  try {
    await updateDoc(doc(db, 'admin_messages', msgId), { read: true });
  } catch (error) {
    console.error('[MessageService] Erro ao marcar mensagem como lida:', error);
  }
}

/**
 * Conta mensagens não lidas na inbox do usuário atual.
 * Usado para atualizar o badge de notificação.
 */
export async function getUnreadCount() {
  requireAuth();
  const myEmail = auth.currentUser.email.toLowerCase();

  const q = query(
    collection(db, 'admin_messages'),
    where('to', '==', myEmail),
    where('read', '==', false),
    where('trashed', '==', false)
  );

  const snap = await getDocs(q);
  return snap.size;
}