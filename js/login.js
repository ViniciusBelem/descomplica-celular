import { auth } from './firebase-config.js';
import {
  signInWithEmailAndPassword,
  onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/12.10.0/firebase-auth.js';

import { qs, setText, setDisabled, getValue } from './utils/dom.js';
import { validateLoginForm } from './utils/validators.js';
import { setSessionItem, getSessionItem, removeSessionItem } from './utils/storage.js';

const REDIRECT_SESSION_KEY = 'postLoginRedirect';
const FLASH_MESSAGE_SESSION_KEY = 'authFlashMessage';

function getLoginElements() {
  return {
    form: qs('#login-form') || qs('[data-login-form]'),
    emailInput: qs('#login-email') || qs('[data-login-email]'),
    passwordInput: qs('#login-password') || qs('[data-login-password]'),
    submitButton: qs('#login-submit') || qs('[data-login-submit]'),
    feedbackBox: qs('#login-feedback') || qs('[data-login-feedback]')
  };
}

function getSafeRedirectPath() {
  const storedRedirect = getSessionItem(REDIRECT_SESSION_KEY, '');
  const fallbackPath = 'dashboard.html';

  if (!storedRedirect || typeof storedRedirect !== 'string') {
    return fallbackPath;
  }

  const normalized = storedRedirect.trim();

  const blockedProtocols = ['http:', 'https:', 'javascript:', '//'];
  const isBlocked = blockedProtocols.some((prefix) =>
    normalized.toLowerCase().startsWith(prefix)
  );

  if (isBlocked) {
    return fallbackPath;
  }

  return normalized || fallbackPath;
}

function setFeedback(message = '', type = 'default') {
  const { feedbackBox } = getLoginElements();
  if (!feedbackBox) return;

  if (!message) {
    feedbackBox.innerHTML = '';
    return;
  }

  feedbackBox.innerHTML = `
    <div class="feedback-box feedback-box--${type}">
      <h3 class="feedback-box-title">${
        type === 'error' ? 'Falha no login' : type === 'success' ? 'Tudo certo' : 'Status'
      }</h3>
      <p class="feedback-box-description">${message}</p>
    </div>
  `;
}

function setFormLoading(isLoading) {
  const { emailInput, passwordInput, submitButton } = getLoginElements();

  setDisabled(emailInput, isLoading);
  setDisabled(passwordInput, isLoading);
  setDisabled(submitButton, isLoading);

  if (submitButton) {
    setText(submitButton, isLoading ? 'Entrando...' : 'Entrar');
    submitButton.dataset.loading = String(Boolean(isLoading));
  }
}

function mapFirebaseAuthError(error) {
  const code = String(error?.code || '');

  const errorMap = {
    'auth/invalid-email': 'O e-mail informado é inválido.',
    'auth/missing-password': 'Informe sua senha para continuar.',
    'auth/invalid-credential':
      'E-mail ou senha incorretos. Revise os dados e tente novamente.',
    'auth/user-not-found':
      'Não encontramos uma conta com esse e-mail.',
    'auth/wrong-password':
      'Senha incorreta. Tente novamente.',
    'auth/too-many-requests':
      'Muitas tentativas de login em pouco tempo. Aguarde um pouco e tente novamente.',
    'auth/network-request-failed':
      'Falha de conexão. Verifique sua internet e tente novamente.',
    'auth/user-disabled':
      'Esta conta foi desativada.',
    'auth/internal-error':
      'Ocorreu um erro interno de autenticação. Tente novamente.'
  };

  return errorMap[code] || 'Não foi possível realizar o login agora.';
}

function buildPayload() {
  const { emailInput, passwordInput } = getLoginElements();

  return {
    email: getValue(emailInput).trim(),
    password: getValue(passwordInput)
  };
}

async function handleLoginSubmit(event) {
  event.preventDefault();

  const payload = buildPayload();
  const validation = validateLoginForm(payload);

  if (!validation.valid) {
    setFeedback(validation.message, 'error');
    return;
  }

  try {
    setFeedback('', 'default');
    setFormLoading(true);

    await signInWithEmailAndPassword(auth, payload.email, payload.password);

    setSessionItem(FLASH_MESSAGE_SESSION_KEY, {
      type: 'success',
      message: 'Login realizado com sucesso.'
    });

    const redirectPath = getSafeRedirectPath();
    removeSessionItem(REDIRECT_SESSION_KEY);

    window.location.replace(redirectPath);
  } catch (error) {
    console.error('[Login] Erro ao autenticar:', error);
    setFeedback(mapFirebaseAuthError(error), 'error');
  } finally {
    setFormLoading(false);
  }
}

function attachSubmitHandler() {
  const { form } = getLoginElements();
  if (!form) return;

  form.addEventListener('submit', handleLoginSubmit);
}

function redirectIfAlreadyAuthenticated() {
  onAuthStateChanged(auth, (user) => {
    if (!user) return;

    const redirectPath = getSafeRedirectPath();
    removeSessionItem(REDIRECT_SESSION_KEY);

    window.location.replace(redirectPath);
  });
}

function bootstrapLogin() {
  const { form } = getLoginElements();
  if (!form) return;

  redirectIfAlreadyAuthenticated();
  attachSubmitHandler();
}

document.addEventListener('DOMContentLoaded', bootstrapLogin);