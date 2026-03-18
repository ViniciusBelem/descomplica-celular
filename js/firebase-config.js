/* ==========================================================================
   ARQUITETURA PREMIUM v4.0 - DATABASE & AUTH CONFIG
   Projeto: Descomplica Celular
   Camada: Conexão com Firebase (Auth e Firestore)
   ========================================================================== */

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js"; // <-- FERRAMENTA NOVA

const firebaseConfig = {
    apiKey: "AIzaSyAZeOCLEPWiKwc7AnsnFGFIkK3cjhg48XE",
  authDomain: "descomplica-celular.firebaseapp.com",
  projectId: "descomplica-celular",
  storageBucket: "descomplica-celular.firebasestorage.app",
  messagingSenderId: "1016566752922",
  appId: "1:1016566752922:web:8e07b5f4184720705e6123"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app); // <-- O SEGREDO ESTÁ AQUI (A exportação que faltava)

console.log('%c[Firebase] Servidor e Base de Dados conectados!', 'color: #FFCA28; font-weight: bold;');