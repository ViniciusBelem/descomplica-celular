import { auth } from './firebase-config.js';
import {
  onAuthStateChanged,
  signOut
} from 'https://www.gstatic.com/firebasejs/12.10.0/firebase-auth.js';

import {
  qs,
  qsa,
  setText,
  hideElement,
  showElement
} from './utils/dom.js';

import { escapeHtml, sanitizeRedirectPath } from './utils/security.js';

import {
  getSessionItem,
  setSessionItem,
  removeSessionItem
} from './utils/storage.js';
import { getUserProfile, ensureUserProfile } from './services/firebase-service.js';
import { initTheme } from './ui/theme-manager.js';

const REDIRECT_LOGIN_KEY = 'postLoginRedirect';
const REDIRECT_REGISTER_KEY = 'postRegisterRedirect';
const FLASH_MESSAGE_SESSION_KEY = 'authFlashMessage';

function getDisplayName(user) {
  if (!user) return 'Visitante';

  if (user.displayName && String(user.displayName).trim()) {
    return String(user.displayName).trim();
  }

  if (user.email) {
    return String(user.email).split('@')[0];
  }

  return 'Usuário';
}

function getCurrentRelativePath() {
  const { pathname, search, hash } = window.location;
  const fileName = pathname.split('/').pop() || 'index.html';
  return `${fileName}${search || ''}${hash || ''}`;
}

function getRedirectParam() {
  const params = new URLSearchParams(window.location.search);
  return params.get('redirect');
}

function persistRedirectTargets(path = null) {
  const redirectPath = sanitizeRedirectPath(path || getCurrentRelativePath(), 'dashboard.html');
  setSessionItem(REDIRECT_LOGIN_KEY, redirectPath);
  setSessionItem(REDIRECT_REGISTER_KEY, redirectPath);
}

function clearRedirectTargets() {
  removeSessionItem(REDIRECT_LOGIN_KEY);
  removeSessionItem(REDIRECT_REGISTER_KEY);
}

function buildFlashMarkup(message, type = 'success') {
  return `
    <div class="feedback-box feedback-box--${escapeHtml(type)}">
      <h3 class="feedback-box-title">${
        type === 'error' ? 'Atenção' : 'Tudo certo'
      }</h3>
      <p class="feedback-box-description">${escapeHtml(message)}</p>
    </div>
  `;
}

function getAuthElements() {
  return {
    authGuestOnly: qsa('[data-auth="guest"]'),
    authUserOnly: qsa('[data-auth="user"]'),
    authDisplayName: qsa('[data-auth-display="name"]'),
    authDisplayEmail: qsa('[data-auth-display="email"]'),
    authLogoutButtons: qsa('[data-auth-action="logout"]'),
    authDashboardLinks: qsa('[data-auth-link="dashboard"]'),
    authLoginLinks: qsa('[data-auth-link="login"]'),
    authRegisterLinks: qsa('[data-auth-link="register"]'),
    authFlashContainer: qs('[data-auth-flash]')
  };
}

function renderFlashMessage() {
  const { authFlashContainer } = getAuthElements();
  if (!authFlashContainer) return;

  const flashSection = authFlashContainer.closest("[data-auth-flash-section]");
  const flash = getSessionItem(FLASH_MESSAGE_SESSION_KEY, null);

  if (!flash?.message) {
    authFlashContainer.innerHTML = '';
    if (flashSection) flashSection.style.display = 'none';
    return;
  }

  if (flashSection) flashSection.style.display = '';

  authFlashContainer.innerHTML = buildFlashMarkup(
    flash.message,
    flash.type || 'success'
  );

  removeSessionItem(FLASH_MESSAGE_SESSION_KEY);
}

function updateVisibilityByAuthState(user) {
  const {
    authGuestOnly,
    authUserOnly,
    authDisplayName,
    authDisplayEmail
  } = getAuthElements();

  const isAuthenticated = Boolean(user);
  const displayName = getDisplayName(user);
  const displayEmail = user?.email || 'E-mail indisponível';

  authGuestOnly.forEach((element) => {
    if (isAuthenticated) {
      hideElement(element);
    } else {
      showElement(element);
    }
  });

  authUserOnly.forEach((element) => {
    if (isAuthenticated) {
      showElement(element);
    } else {
      hideElement(element);
    }
  });

  authDisplayName.forEach((element) => setText(element, displayName));
  authDisplayEmail.forEach((element) => setText(element, displayEmail));
}

function updateNavigationLinks(user) {
  const {
    authDashboardLinks,
    authLoginLinks,
    authRegisterLinks
  } = getAuthElements();

  authDashboardLinks.forEach((element) => {
    element.setAttribute('href', user ? 'dashboard.html' : 'login.html?redirect=dashboard.html');
  });

  authLoginLinks.forEach((element) => {
    element.setAttribute('href', 'login.html');
  });

  authRegisterLinks.forEach((element) => {
    element.setAttribute('href', 'registro.html');
  });
}

function bindProtectedLinks() {
  const protectedLinks = qsa('[data-requires-auth="true"]');

  protectedLinks.forEach((element) => {
    if (element.dataset.authBound === 'true') return;
    element.dataset.authBound = 'true';

    element.addEventListener('click', (event) => {
      const user = auth.currentUser;
      if (user) return;

      event.preventDefault();

      const explicitTarget =
        element.getAttribute('href') ||
        element.dataset.redirectTarget ||
        'dashboard.html';

      const safeTarget = sanitizeRedirectPath(explicitTarget, 'dashboard.html');
      persistRedirectTargets(safeTarget);

      window.location.href = `login.html?redirect=${encodeURIComponent(safeTarget)}`;
    });
  });
}

function bindAuthNavigationMemory() {
  const loginLinks = qsa('a[href="login.html"], [data-auth-link="login"]');
  const registerLinks = qsa('a[href="registro.html"], [data-auth-link="register"]');

  loginLinks.forEach((element) => {
    if (element.dataset.redirectBound === 'login') return;
    element.dataset.redirectBound = 'login';

    element.addEventListener('click', () => {
      const redirectFromQuery = getRedirectParam();
      persistRedirectTargets(redirectFromQuery || getCurrentRelativePath());
    });
  });

  registerLinks.forEach((element) => {
    if (element.dataset.redirectBound === 'register') return;
    element.dataset.redirectBound = 'register';

    element.addEventListener('click', () => {
      const redirectFromQuery = getRedirectParam();
      persistRedirectTargets(redirectFromQuery || getCurrentRelativePath());
    });
  });
}

function bindLogoutButtons() {
  const { authLogoutButtons } = getAuthElements();

  authLogoutButtons.forEach((button) => {
    if (button.dataset.logoutBound === 'true') return;
    button.dataset.logoutBound = 'true';

    button.addEventListener('click', async (event) => {
      event.preventDefault();

      try {
        await signOut(auth);
        clearRedirectTargets();

        setSessionItem(FLASH_MESSAGE_SESSION_KEY, {
          type: 'success',
          message: 'Você saiu da sua conta com sucesso.'
        });

        window.location.href = 'index.html';
      } catch (error) {
        console.error('[GlobalAuth] Erro ao sair:', error);
      }
    });
  });
}

function captureRedirectFromQueryIfNeeded() {
  const redirectFromQuery = getRedirectParam();
  if (!redirectFromQuery) return;

  const safeRedirect = sanitizeRedirectPath(redirectFromQuery, 'dashboard.html');
  setSessionItem(REDIRECT_LOGIN_KEY, safeRedirect);
  setSessionItem(REDIRECT_REGISTER_KEY, safeRedirect);
}

async function injectAdminMenu(user) {
  const adminLinkTarget = qs('.site-nav__actions');
  if (!adminLinkTarget || !user) return;
  
  const profile = await getUserProfile(user.uid);
  const existingLink = qs('#nav-admin-link');
  
  if (profile && (profile.role === 'admin' || profile.role === 'superadmin')) {
    if (!existingLink) {
      const link = document.createElement('a');
      link.href = './admin.html';
      link.className = 'btn btn-ghost';
      link.id = 'nav-admin-link';
      link.innerHTML = '<span style="color: var(--amber-500);">Painel Admin</span>';
      adminLinkTarget.insertBefore(link, adminLinkTarget.querySelector('[data-auth-action="logout"]'));
    }
  } else if (existingLink) {
    existingLink.remove();
  }
}

function applyAuthenticatedState(user) {
  updateVisibilityByAuthState(user);
  updateNavigationLinks(user);
  bindProtectedLinks();
  bindAuthNavigationMemory();
  bindLogoutButtons();
  renderFlashMessage();
  injectAdminMenu(user);
}

function bootstrapGlobalAuth() {
  // Aplica o tema globalmente em todas as páginas
  initTheme();

  captureRedirectFromQueryIfNeeded();

  onAuthStateChanged(auth, async (user) => {
    // Atualiza a UI imediatamente e revela os botões sem piscar
    applyAuthenticatedState(user);
    document.documentElement.setAttribute('data-auth-resolved', 'true');

    if (user) {
      // Garante hidratação contínua e silenciosa em background sem travar a interface
      await ensureUserProfile(user);
    }
  });
}

document.addEventListener('DOMContentLoaded', bootstrapGlobalAuth);