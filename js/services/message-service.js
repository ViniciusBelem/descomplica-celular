import { auth, db } from '../firebase-config.js';
import { 
  collection, query, where, getDocs, addDoc, updateDoc, doc, serverTimestamp 
} from 'https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js';

export async function sendAdminMessage(toEmail, subject, htmlBody) {
  if (!auth.currentUser) throw new Error("Não autenticado");
  const normalizedEmail = String(toEmail).trim().toLowerCase();
  
  await addDoc(collection(db, 'admin_messages'), {
    from: auth.currentUser.email,
    to: normalizedEmail,
    subject: subject.trim(),
    text: htmlBody,
    read: false,
    timestamp: serverTimestamp(),
    trashed: false // New field for user to hide
  });
}

export async function saveAdminNote(subject, htmlBody, refLogId = null) {
  if (!auth.currentUser) throw new Error("Não autenticado");
  
  await addDoc(collection(db, 'admin_notes'), {
    author: auth.currentUser.email,
    subject: subject.trim(),
    body: htmlBody,
    logRef: refLogId,
    timestamp: serverTimestamp()
  });
}

// ==== QUERY FILTERS ====

export async function getInboxMessages() {
  if (!auth.currentUser) return [];
  const myEmail = auth.currentUser.email.toLowerCase();
  
  const q = query(collection(db, 'admin_messages'), where('to', '==', myEmail), where('trashed', '!=', true));
  const snap = await getDocs(q);
  return parseAndSortSnap(snap);
}

export async function getOutboxMessages() {
  if (!auth.currentUser) return [];
  const myEmail = auth.currentUser.email.toLowerCase();
  
  const q = query(collection(db, 'admin_messages'), where('from', '==', myEmail), where('trashed', '!=', true));
  const snap = await getDocs(q);
  return parseAndSortSnap(snap);
}

export async function getMyNotes() {
  if (!auth.currentUser) return [];
  const myEmail = auth.currentUser.email.toLowerCase();
  
  const q = query(collection(db, 'admin_notes'), where('author', '==', myEmail));
  const snap = await getDocs(q);
  return parseAndSortSnap(snap);
}

export async function getTrashMessages() {
  if (!auth.currentUser) return [];
  const myEmail = auth.currentUser.email.toLowerCase();
  
  // Como firebase no-sql requer indices compostos para multiplas clauses complexas com arrays, faremos memory-filter
  const q1 = query(collection(db, 'admin_messages'), where('trashed', '==', true));
  const snap = await getDocs(q1);
  const allTrashed = parseAndSortSnap(snap);
  
  return allTrashed.filter(m => m.from === myEmail || m.to === myEmail);
}

// ==== CRUD UTILS ====

export async function deleteAdminNote(noteId) {
  const { deleteDoc } = await import('https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js');
  await deleteDoc(doc(db, 'admin_notes', noteId));
}

export async function trashAdminMessage(msgId) {
  await updateDoc(doc(db, 'admin_messages', msgId), { trashed: true });
}

function parseAndSortSnap(snap) {
  const arr = [];
  snap.forEach(d => arr.push({ id: d.id, ...d.data() }));
  
  // Manual sort na memória evita a necessidade de um index composto complexo para os administradores configurarem
  return msgs.sort((a, b) => {
     const tA = a.timestamp?.toMillis ? a.timestamp.toMillis() : Date.now();
     const tB = b.timestamp?.toMillis ? b.timestamp.toMillis() : Date.now();
     return tB - tA;
  });
}

export async function markMessageAsRead(msgId) {
  try {
    await updateDoc(doc(db, 'admin_messages', msgId), { read: true });
  } catch(e) { console.error('Erro ao marcar msg:', e); }
}
