import { auth, db } from './firebase-config.js';
import {
  createUserWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/12.10.0/firebase-auth.js';
import {
  doc,
  setDoc,
  serverTimestamp
} from 'https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js';

import { qs, setText, setDisabled, getValue } from './utils/dom.js';
import { escapeHtml, sanitizeRedirectPath } from './utils/security.js';
import { validateRegisterForm } from './utils/validators.js';
import {
  setSessionItem,
  getSessionItem,
  removeSessionItem
} from './utils/storage.js';

const REDIRECT_SESSION_KEY = 'postRegisterRedirect';
const FLASH_MESSAGE_SESSION_KEY = 'authFlashMessage';
const DEFAULT_REDIRECT = 'dashboard.html';

function getRegisterElements() {
  return {
    form: qs('#register-form') || qs('[data-register-form]'),
    nameInput: qs('#register-name') || qs('[data-register-name]'),
    emailInput: qs('#register-email') || qs('[data-register-email]'),
    passwordInput: qs('#register-password') || qs('[data-register-password]'),
    confirmPasswordInput:
      qs('#register-confirm-password') || qs('[data-register-confirm-password]'),
    submitButton: qs('#register-submit') || qs('[data-register-submit]'),
    feedbackBox: qs('#register-feedback') || qs('[data-register-feedback]')
  };
}

function getRedirectParam() {
  const params = new URLSearchParams(window.location.search);
  return params.get('redirect');
}

function getSafeRedirectPath() {
  const redirectFromQuery = getRedirectParam();
  const storedRedirect = getSessionItem(REDIRECT_SESSION_KEY, '');

  return sanitizeRedirectPath(
    redirectFromQuery || storedRedirect,
    DEFAULT_REDIRECT
  );
}

function persistRedirectFromQueryIfNeeded() {
  const redirectFromQuery = getRedirectParam();
  if (!redirectFromQuery) return;

  const safeRedirect = sanitizeRedirectPath(redirectFromQuery, DEFAULT_REDIRECT);
  setSessionItem(REDIRECT_SESSION_KEY, safeRedirect);
}

function setFeedback(message = '', type = 'default') {
  const { feedbackBox } = getRegisterElements();
  if (!feedbackBox) return;

  if (!message) {
    feedbackBox.innerHTML = '';
    return;
  }

  feedbackBox.innerHTML = `
    <div class="feedback-box feedback-box--${escapeHtml(type)}">
      <h3 class="feedback-box-title">${
        type === 'error' ? 'Falha no cadastro' : type === 'success' ? 'Tudo certo' : 'Status'
      }</h3>
      <p class="feedback-box-description">${escapeHtml(message)}</p>
    </div>
  `;
}

function setFormLoading(isLoading) {
  const {
    nameInput,
    emailInput,
    passwordInput,
    confirmPasswordInput,
    submitButton
  } = getRegisterElements();

  setDisabled(nameInput, isLoading);
  setDisabled(emailInput, isLoading);
  setDisabled(passwordInput, isLoading);
  setDisabled(confirmPasswordInput, isLoading);
  setDisabled(submitButton, isLoading);

  if (submitButton) {
    setText(submitButton, isLoading ? 'Criando conta...' : 'Criar conta');
    submitButton.dataset.loading = String(Boolean(isLoading));
  }
}

function mapFirebaseRegisterError(error) {
  const code = String(error?.code || '');

  const errorMap = {
    'auth/email-already-in-use': 'Já existe uma conta cadastrada com este e-mail.',
    'auth/invalid-email': 'O e-mail informado é inválido.',
    'auth/weak-password': 'A senha é muito fraca. Use pelo menos 6 caracteres.',
    'auth/missing-password': 'Informe uma senha para continuar.',
    'auth/network-request-failed':
      'Falha de conexão. Verifique sua internet e tente novamente.',
    'auth/too-many-requests':
      'Muitas tentativas em pouco tempo. Aguarde um pouco e tente novamente.',
    'auth/internal-error': 'Ocorreu um erro interno no cadastro. Tente novamente.'
  };

  return errorMap[code] || 'Não foi possível concluir o cadastro agora.';
}

function buildPayload() {
  const {
    nameInput,
    emailInput,
    passwordInput,
    confirmPasswordInput
  } = getRegisterElements();

  return {
    name: getValue(nameInput).trim(),
    email: getValue(emailInput).trim(),
    password: getValue(passwordInput),
    confirmPassword: getValue(confirmPasswordInput)
  };
}

async function createUserProfileDocument(user, payload) {
  const userRef = doc(db, 'usuarios', user.uid);

  const cleanEmail = String(payload.email || '').trim().toLowerCase();

  const profileData = {
    uid: user.uid,
    nome: payload.name,
    email: payload.email,
    normalizedEmail: cleanEmail,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    preferences: {
      favoriteFocus: '',
      preferredBudgetRange: '',
      favoriteBrands: []
    },
    metadata: {
      onboardingCompleted: false,
      role: 'user',
      status: 'active'
    }
  };

  await setDoc(userRef, profileData, { merge: true });
}

async function handleRegisterSubmit(event) {
  event.preventDefault();

  const payload = buildPayload();
  const validation = validateRegisterForm(payload);

  if (!validation.valid) {
    setFeedback(validation.message, 'error');
    return;
  }

  try {
    setFeedback('', 'default');
    setFormLoading(true);

    const credential = await createUserWithEmailAndPassword(
      auth,
      payload.email,
      payload.password
    );

    await updateProfile(credential.user, {
      displayName: payload.name
    });

    await createUserProfileDocument(credential.user, payload);

    setSessionItem(FLASH_MESSAGE_SESSION_KEY, {
      type: 'success',
      message: 'Conta criada com sucesso.'
    });

    const redirectPath = getSafeRedirectPath();
    removeSessionItem(REDIRECT_SESSION_KEY);

    window.location.replace(redirectPath);
  } catch (error) {
    console.error('[Registro] Erro ao criar conta:', error);
    setFeedback(mapFirebaseRegisterError(error), 'error');
  } finally {
    setFormLoading(false);
  }
}

function attachSubmitHandler() {
  const { form } = getRegisterElements();
  if (!form) return;

  form.addEventListener('submit', handleRegisterSubmit);
}

function redirectIfAlreadyAuthenticated() {
  onAuthStateChanged(auth, (user) => {
    if (!user) return;

    const redirectPath = getSafeRedirectPath();
    removeSessionItem(REDIRECT_SESSION_KEY);

    window.location.replace(redirectPath);
  });
}

function bootstrapRegister() {
  const { form } = getRegisterElements();
  if (!form) return;

  persistRedirectFromQueryIfNeeded();
  redirectIfAlreadyAuthenticated();
  attachSubmitHandler();
}

document.addEventListener('DOMContentLoaded', bootstrapRegister);