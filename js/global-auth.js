/* ==========================================================================
   ARQUITETURA PREMIUM v4.0 - GLOBAL AUTH STATE
   Projeto: Descomplica Celular
   Camada: Sincronização de Cabeçalho (Visitante vs Usuário Logado)
   ========================================================================== */

import { auth } from './firebase-config.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-auth.js";

document.addEventListener('DOMContentLoaded', () => {
    // Referências do DOM
    const guestControls = document.getElementById('auth-guest-controls');
    const userControls = document.getElementById('auth-user-controls');
    
    const userNameDisplay = document.getElementById('user-name-display-global');
    const userEmailDisplay = document.getElementById('user-email-display-global');
    const userAvatarInitial = document.getElementById('user-avatar-initial-global');
    
    const profileTrigger = document.getElementById('profile-menu-trigger-global');
    const profileDropdown = document.getElementById('profile-dropdown-global');
    const btnLogout = document.getElementById('btn-logout-global');

    // Se os controlos não existirem nesta página, o script para aqui silenciosamente
    if (!guestControls || !userControls) return;

    // 1. OUVINTE DE ESTADO DO FIREBASE
    onAuthStateChanged(auth, (user) => {
        if (user) {
            // Oculta "Criar Conta" e mostra o Menu de Perfil
            guestControls.style.display = 'none';
            userControls.style.display = 'flex';

            const nomeExibicao = user.displayName || user.email.split('@')[0];
            userNameDisplay.textContent = nomeExibicao;
            userEmailDisplay.textContent = user.email;
            userEmailDisplay.title = user.email; // Tooltip para emails longos
            userAvatarInitial.textContent = nomeExibicao.charAt(0).toUpperCase();
        } else {
            // Oculta Perfil e mostra "Criar Conta"
            guestControls.style.display = 'flex';
            userControls.style.display = 'none';
        }
    });

    // 2. TOGGLE DO MENU DROPDOWN
    if (profileTrigger && profileDropdown) {
        profileTrigger.addEventListener('click', (e) => {
            e.stopPropagation();
            const isExpanded = profileDropdown.classList.toggle('active');
            profileTrigger.setAttribute('aria-expanded', isExpanded);
        });

        document.addEventListener('click', (e) => {
            if (!profileDropdown.contains(e.target) && !profileTrigger.contains(e.target)) {
                profileDropdown.classList.remove('active');
                profileTrigger.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // 3. LOGOUT GLOBAL
    if (btnLogout) {
        btnLogout.addEventListener('click', async (e) => {
            e.preventDefault();
            try {
                await signOut(auth);
                sessionStorage.removeItem('descomplica_user');
                window.location.reload(); // Atualiza a página atual para voltar a ser Visitante
            } catch (error) {
                console.error("Erro ao deslogar:", error);
            }
        });
    }
});