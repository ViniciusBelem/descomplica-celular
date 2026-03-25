/**
 * Camada centralizada de operações Firebase
 * Isolação de lógica Firestore e Auth
 */
import { auth, db } from '../firebase-config.js';
import {
  collection,
  query,
  where,
  orderBy,
  limit as firestoreLimit,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  addDoc,
  setDoc as fireSetDoc,
  serverTimestamp
} from 'https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js';
// Correção do import de firestore no seu código real:
import { getDoc as fireGetDoc, doc as fireDoc, updateDoc as fireUpdate, addDoc as fireAddDoc, setDoc as fireSetDocBackup } from 'https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js';

// ===== ANÁLISES / RECOMENDAÇÕES =====

export async function saveRecommendationAnalysis({
  userId,
  profileId,
  focusTag,
  budget,
  bestMatchId,
  bestMatchData,
  alternatives = [],
  explanation = ''
} = {}) {
  if (!userId) {
    console.warn('[Firebase] User ID obrigatório para salvar análise');
    return null;
  }

  try {
    const docRef = await addDoc(collection(db, 'recommendations'), {
      userId,
      profileId: String(profileId || ''),
      focusTag: String(focusTag || ''),
      budget: Number(budget || 0),
      bestMatch: bestMatchData ? { ...bestMatchData } : null,
      bestMatchId: String(bestMatchId || ''),
      alternatives: Array.isArray(alternatives) ? alternatives : [],
      explanation: String(explanation || ''),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    console.log('[Firebase] Análise salva:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('[Firebase] Erro ao salvar análise:', error);
    throw error;
  }
}

export async function getUserRecommendations(
  userId,
  options = { limit: 50, orderBy: 'createdAt' }
) {
  if (!userId) {
    console.warn('[Firebase] User ID obrigatório para buscar análises');
    return [];
  }

  try {
    const q = query(
      collection(db, 'recommendations'),
      where('userId', '==', userId),
      orderBy(options.orderBy || 'createdAt', 'desc'),
      firestoreLimit(Math.min(Number(options.limit) || 50, 100))
    );

    const querySnapshot = await getDocs(q);
    const recommendations = [];

    querySnapshot.forEach((doc) => {
      recommendations.push({
        id: doc.id,
        ...doc.data()
      });
    });

    console.log('[Firebase] Análises carregadas:', recommendations.length);
    return recommendations;
  } catch (error) {
    console.error('[Firebase] Erro Crítico ao buscar análises:', error);
    // Paramos de engolir o erro. Se for falta de índice, o frontend PRECISA saber.
    if (error.message && error.message.includes('index')) {
      throw new Error('FALTA_INDICE_FIRESTORE');
    }
    throw error;
  }
}

export async function getRecentRecommendations(
  userId,
  limitValue = 3
) {
  return getUserRecommendations(userId, {
    limit: limitValue,
    orderBy: 'createdAt'
  });
}

// ===== PERFIL DO USUÁRIO =====

export async function getUserProfile(userId) {
  if (!userId || !auth.currentUser) {
    return null;
  }

  try {
    const user = auth.currentUser;
    // Busca o role seguro no Firestore
    const profileDoc = await fireGetDoc(fireDoc(db, 'usuarios', userId));
    const role = profileDoc.exists() ? profileDoc.data().metadata?.role : 'user';
    
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || null,
      role: role || 'user'
    };
  } catch (error) {
    console.error('[Firebase] Erro ao buscar perfil:', error);
    return null;
  }
}

export async function ensureUserProfile(user) {
  if (!user || !user.uid) return;
  try {
    const userRef = fireDoc(db, 'usuarios', user.uid);
    const docSnap = await fireGetDoc(userRef);

    const existingData = docSnap.exists() ? docSnap.data() : {};
    const existingMetadata = existingData.metadata || {};
    
    // Chave de busca 100% segura para o painel admin
    const cleanEmail = String(user.email || '').trim().toLowerCase();

    // Validação inteligente: Aborta a gravação se o documento já existe e está perfeito, economizando o Firestore
    if (
      docSnap.exists() &&
      existingData.uid === user.uid &&
      existingData.nome &&
      existingData.normalizedEmail === cleanEmail
    ) {
      return;
    }

    const payload = {
      uid: user.uid,
      nome: existingData.nome || user.displayName || 'Usuário',
      email: existingData.email || user.email,
      normalizedEmail: cleanEmail,
      updatedAt: serverTimestamp(),
      metadata: { 
        role: existingMetadata.role || 'user', 
        status: existingMetadata.status || 'active' 
      }
    };

    if (!docSnap.exists() && !existingData.createdAt) {
      payload.createdAt = serverTimestamp();
    }

    const setDocFunc = fireSetDoc || fireSetDocBackup;
    await setDocFunc(userRef, payload, { merge: true });
  } catch (error) {
    console.error('[Auth] Erro ao sincronizar usuário:', error);
  }
}

// ===== ESTATÍSTICAS =====

export async function getUserRecommendationStats(userId) {
  if (!userId) {
    return {
      totalAnalyses: 0,
      averageBudget: 0,
      focusDistribution: {},
      profilesUsed: []
    };
  }

  try {
    const recommendations = await getUserRecommendations(userId, { limit: 100 });

    if (!recommendations.length) {
      return {
        totalAnalyses: 0,
        averageBudget: 0,
        focusDistribution: {},
        profilesUsed: []
      };
    }

    const budgets = recommendations
      .map((r) => Number(r.budget || 0))
      .filter((b) => b > 0);
    const averageBudget = budgets.length > 0
      ? Math.round(budgets.reduce((a, b) => a + b, 0) / budgets.length)
      : 0;

    const focusDistribution = {};
    const profilesUsed = new Set();

    recommendations.forEach((r) => {
      const focus = String(r.focusTag || 'indefinido').toLowerCase();
      focusDistribution[focus] = (focusDistribution[focus] || 0) + 1;

      if (r.profileId) {
        profilesUsed.add(r.profileId);
      }
    });

    return {
      totalAnalyses: recommendations.length,
      averageBudget,
      focusDistribution,
      profilesUsed: Array.from(profilesUsed)
    };
  } catch (error) {
    console.error('[Firebase] Erro ao calcular estatísticas:', error);
    return {
      totalAnalyses: 0,
      averageBudget: 0,
      focusDistribution: {},
      profilesUsed: []
    };
  }
}

export async function getTrendingFocuses(userId, limit = 5) {
  const stats = await getUserRecommendationStats(userId);
  
  return Object.entries(stats.focusDistribution)
    .map(([focus, count]) => ({
      label: focus,
      value: Math.round((count / stats.totalAnalyses) * 100) || 0,
      count
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

// ===== ADMIN E GOVERNANÇA (RBAC) =====

export async function logAdminAction(action, targetId, details = {}) {
  if (!auth.currentUser) return;
  try {
    let targetType = 'unknown';
    if (action.includes('DEVICE')) targetType = 'device';
    if (action.includes('ADMIN')) targetType = 'user';
    
    // Auto-categorização Híbrida
    const categoryMap = {
      'CREATE_DEVICE': 'Catálogo',
      'UPDATE_DEVICE': 'Catálogo',
      'DELETE_DEVICE': 'Exclusões',
      'GRANT_ADMIN': 'Segurança',
      'REVOKE_ADMIN': 'Segurança'
    };
    const categoryName = details.customCategory || categoryMap[action] || 'Geral';

    await fireAddDoc(collection(db, 'audit_logs'), {
      action,
      category: categoryName,
      archived: false,
      comments: [],
      actor: {
        uid: auth.currentUser.uid,
        email: auth.currentUser.email,
        role: "admin_ou_superadmin"
      },
      target: {
        type: targetType,
        id: targetId,
        email: details.targetEmail || null,
        desc: details.model || null
      },
      before: details.before || {},
      after: details.after || details || {},
      meta: {
        userAgent: navigator.userAgent,
        page: window.location.pathname
      },
      createdAt: serverTimestamp()
    });
  } catch (err) {
    console.error('[Auditoria] Falha ao gravar log:', err);
  }
}

export async function getAuditLogs(limitCount = 50) {
  try {
    const q = query(
      collection(db, 'audit_logs'),
      orderBy('createdAt', 'desc'),
      firestoreLimit(limitCount)
    );
    const snap = await getDocs(q);
    const logs = [];
    snap.forEach(d => logs.push({ id: d.id, ...d.data() }));
    return logs;
  } catch(e) {
    console.warn('[Auditoria] Erro ao buscar logs', e);
    return [];
  }
}

export async function getUserByEmailForAdmin(email) {
  const cleanEmail = String(email).trim().toLowerCase();
  
  // ESTRATÉGIA DE FALLBACK: Tenta buscar pelo campo normalizado primeiro
  let q = query(collection(db, 'usuarios'), where('normalizedEmail', '==', cleanEmail), firestoreLimit(1));
  let snapshot = await getDocs(q);
  
  // Se não achar, tenta buscar pelo campo de email legado (contas antigas não hidratadas)
  if (snapshot.empty) {
    q = query(collection(db, 'usuarios'), where('email', '==', cleanEmail), firestoreLimit(1));
    snapshot = await getDocs(q);
  }

  if (snapshot.empty) return null;
  return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
}

export async function changeUserRole(userId, targetEmail, newRole) {
  try {
    const userRef = fireDoc(db, 'usuarios', userId);
    await fireUpdate(userRef, {
      'metadata.role': newRole,
      updatedAt: serverTimestamp()
    });
    await logAdminAction(newRole === 'admin' ? 'GRANT_ADMIN' : 'REVOKE_ADMIN', userId, { targetEmail, newRole });
    return true;
  } catch (error) {
    console.error('[RBAC] Erro ao alterar permissões:', error);
    throw new Error('Acesso negado ou falha na operação.');
  }
}

export async function getAllAdmins() {
  try {
    const adminsQuery = query(collection(db, 'usuarios'), where('metadata.role', 'in', ['admin', 'superadmin']));
    const snapshot = await getDocs(adminsQuery);
    const admins = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      admins.push({
        id: doc.id,
        nome: data.nome || 'Sem nome (Perfil incompleto)',
        email: data.email || data.normalizedEmail || 'E-mail não registrado',
        role: data.metadata?.role || 'admin'
      });
    });
    return admins;
  } catch (error) {
    console.error('[RBAC] Falha ao carregar admins', error);
    return [];
  }
}

// ===== AÇÕES AVANÇADAS DE AUDITORIA =====

export async function updateLogArchiveStatus(logId, status) {
  try {
    await fireUpdate(fireDoc(db, 'audit_logs', logId), { archived: status });
  } catch(e) {
    console.error('[Auditoria] Erro ao arquivar', e);
    throw e;
  }
}

export async function addLogComment(logId, text) {
  try {
    const docRef = fireDoc(db, 'audit_logs', logId);
    const snap = await getDoc(docRef);
    if (!snap.exists()) return;
    const comments = snap.data().comments || [];
    comments.push({ text, date: new Date().toISOString(), author: auth.currentUser?.email || 'Admin' });
    await fireUpdate(docRef, { comments });
  } catch(e) {
    console.error('[Auditoria] Erro ao comentar', e);
    throw e;
  }
}

export async function revertAdminAction(log) {
  if (!auth.currentUser) throw new Error("Sessão admin inválida.");
  const { CatalogRepository } = await import('./catalog-repository.js');
  
  if (log.action === 'UPDATE_DEVICE' || log.action === 'DELETE_DEVICE') {
    const payload = log.before;
    if (!payload || Object.keys(payload).length === 0) throw new Error("Sem dados anteriores guardados na nuvem para restaurar.");
    
    // Força a restauração sem ativar Anti-Colisão passando isNew=false
    await CatalogRepository.save(payload, false);
    
    await logAdminAction('UNDO_ACTION', log.target.id, {
      customCategory: 'Segurança',
      info: `Estado original restaurado a partir do Snapshot do Log ID: ${log.id}`
    });
  } else if (log.action === 'CREATE_DEVICE') {
    await CatalogRepository.delete(log.target.id);
    await logAdminAction('UNDO_ACTION', log.target.id, {
      customCategory: 'Segurança',
      info: `Criação vazia revertida (Dispositivo Excluído) a partir do Log ID: ${log.id}`
    });
  } else {
    throw new Error("O tipo de evento não suporta mecanismo de Rollback automático.");
  }
}
