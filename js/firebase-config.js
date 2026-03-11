/* ==========================================================================
   ARQUITETURA PREMIUM v4.0 - DATABASE & AUTH CONFIG
   Projeto: Descomplica Celular
   Camada: Conexão com Firebase (SDK 12.10.0)
   ========================================================================== */

// Importação das bibliotecas vitais do Firebase da versão exata do seu projeto
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-auth.js";

// As suas chaves de segurança reais
const firebaseConfig = {
    apiKey: "AIzaSyAZeOCLEPWiKwc7AnsnFGFIkK3cjhg48XE",
    authDomain: "descomplica-celular.firebaseapp.com",
    projectId: "descomplica-celular",
    storageBucket: "descomplica-celular.firebasestorage.app",
    messagingSenderId: "1016566752922",
    appId: "1:1016566752922:web:8e07b5f4184720705e6123"
};

// Inicializa a conexão com o Banco de Dados
const app = initializeApp(firebaseConfig);

// Exporta o motor de autenticação para ser usado no nosso formulário de registro
export const auth = getAuth(app);

console.log('%c[Firebase] Servidor na nuvem conectado com sucesso!', 'color: #FFCA28; font-weight: bold;');