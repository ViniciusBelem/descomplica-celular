/**
 * HOME CONTROLLER - v2 CORRIGIDO
 * Gerencia a página inicial com integração completa
 * para persistência de análises em Firestore
 */

import { auth } from './firebase-config.js';

import { getFeaturedDevices } from './catalog-service.js';
import {
  explainRecommendation,
  getRecommendationProfiles
} from './recommendation-engine.js';

import {
  renderCatalogDevices,
  renderCatalogLoading,
  renderCatalogError,
  renderFaqItems,
  renderSectionMessage,
  clearSection
} from './ui/home-render.js';

import {
  renderRecommendationState,
  renderRecommendationLoadingState,
  renderRecommendationErrorState,
  clearRecommendationState
} from './ui/result-render.js';

import {
  qs,
  setText,
  setDisabled,
  getValue,
  setValue
} from './utils/dom.js';

import {
  formatBudgetInputValue,
  normalizeBudgetInputValue,
  parseBRL
} from './utils/currency.js';

import { validateRecommendationForm } from './utils/validators.js';

import {
  getStorageItem,
  setStorageItem,
  removeStorageItem
} from './utils/storage.js';

import {
  normalizeText,
  escapeHtml
} from './utils/security.js';

import { initEnhancedSelects } from './ui/enhanced-select.js';

import { saveRecommendationAnalysis } from './services/firebase-service.js';

const FAQ_DATA_PATH = './data/faq.json';
const STORAGE_KEY = 'homeRecommendationDraft';

// ===== SELETORES E ELEMENTOS =====

function getHomeElements() {
  return {
    form: qs('[data-recommendation-form]'),
    budgetInput: qs('[data-field-budget]'),
    profileSelect: qs('[data-field-profile]'),
    focusSelect: qs('[data-field-focus]'),
    submitButton: qs('[data-submit-recommendation]'),
    resetButton: qs('[data-reset-recommendation]'),
    profileHint: qs('[data-profile-hint]'),
    statusBox: qs('[data-form-status]')
  };
}

// ===== OPÇÕES DO FORMULÁRIO =====

function buildFocusOptions() {
  return [
    { value: '', label: 'Selecione sua prioridade' },
    { value: 'equilibrio', label: 'Equilíbrio geral' },
    { value: 'camera', label: 'Câmera' },
    { value: 'bateria', label: 'Bateria' },
    { value: 'performance', label: 'Desempenho' },
    { value: 'jogos', label: 'Jogos' },
    { value: 'custo-beneficio', label: 'Custo-benefício' },
    { value: 'premium', label: 'Experiência premium' },
    { value: 'longevidade', label: 'Longevidade' }
  ];
}

// ===== FETCH E CARREGAMENTO =====

async function fetchFaqItems() {
  const response = await fetch(FAQ_DATA_PATH, {
    headers: { Accept: 'application/json' }
  });

  if (!response.ok) {
    throw new Error('Não foi possível carregar o FAQ.');
  }

  const data = await response.json();

  if (!Array.isArray(data)) {
    throw new Error('O FAQ está em formato inválido.');
  }

  return data
    .filter((item) => item && typeof item.question === 'string' && typeof item.answer === 'string')
    .map((item, index) => ({
      id: String(item.id || `faq-${index + 1}`),
      question: String(item.question),
      answer: String(item.answer)
    }));
}

// ===== FEEDBACK E STATUS =====

function setStatusMessage(message = '', variant = 'default') {
  const { statusBox } = getHomeElements();
  if (!statusBox) return;

  if (!message) {
    clearSection(statusBox);
    return;
  }

  renderSectionMessage({
    title: variant === 'error' ? 'Atenção' : variant === 'success' ? 'Tudo certo' : 'Status',
    description: message,
    variant,
    target: statusBox
  });
}

function setFormLoading(isLoading) {
  const { submitButton, resetButton } = getHomeElements();

  setDisabled(submitButton, isLoading);
  setDisabled(resetButton, isLoading);

  if (submitButton) {
    setText(
      submitButton,
      isLoading ? 'Analisando...' : 'Encontrar meu celular ideal'
    );
    submitButton.dataset.loading = String(Boolean(isLoading));
  }
}

// ===== DRAFT E PERSISTÊNCIA LOCAL =====

function extractRobustBudget(rawValue) {
  if (!rawValue) return 0;
  
  const cleaned = String(rawValue).replace(/[^\d.,]/g, '');
  if (!cleaned) return 0;

  if (cleaned.includes(',')) {
    const parts = cleaned.split(',');
    const intPart = parts[0].replace(/\./g, ''); 
    const decPart = parts[1].substring(0, 2); 
    return Number(`${intPart}.${decPart}`);
  }
  
  if (cleaned.includes('.')) {
    const parts = cleaned.split('.');
    const lastPart = parts[parts.length - 1];
    
    if (lastPart.length === 3) {
      return Number(cleaned.replace(/\./g, ''));
    }

    const intPart = parts.slice(0, -1).join('').replace(/\./g, '');
    return Number(`${intPart}.${lastPart}`);
  }

  return Number(cleaned);
}

function getDraftPayload() {
  const { budgetInput, profileSelect, focusSelect } = getHomeElements();

  return {
    budget: extractRobustBudget(getValue(budgetInput)) || 0,
    profileId: normalizeText(getValue(profileSelect)),
    focusTag: normalizeText(getValue(focusSelect))
  };
}

function saveDraft() {
  setStorageItem(STORAGE_KEY, getDraftPayload());
}

function clearDraft() {
  removeStorageItem(STORAGE_KEY);
}

function restoreDraft() {
  const draft = getStorageItem(STORAGE_KEY, null);
  if (!draft) return;

  const { budgetInput, profileSelect, focusSelect } = getHomeElements();

  if (budgetInput && draft.budget) {
    setValue(budgetInput, formatBudgetInputValue(draft.budget));
  }

  if (profileSelect && draft.profileId) {
    setValue(profileSelect, draft.profileId);
  }

  if (focusSelect && draft.focusTag) {
    setValue(focusSelect, draft.focusTag);
  }
}

// ===== POPULAÇÃO DO FORMULÁRIO =====

function populateFocusSelect() {
  const { focusSelect } = getHomeElements();
  if (!focusSelect) return;

  focusSelect.innerHTML = buildFocusOptions()
    .map((item) => `<option value="${item.value}">${escapeHtml(item.label)}</option>`)
    .join('');
}

async function populateProfileSelect() {
  const { profileSelect } = getHomeElements();
  if (!profileSelect) return;

  try {
    const profiles = await getRecommendationProfiles();

    profileSelect.innerHTML = [
      '<option value="">Selecione seu perfil</option>',
      ...profiles.map(
        (profile) => `<option value="${profile.id}">${escapeHtml(profile.label)}</option>`
      )
    ].join('');
  } catch (error) {
    console.error('[Home] Erro ao carregar perfis:', error);
    profileSelect.innerHTML = '<option value="">Erro ao carregar perfis</option>';
  }
}

async function updateProfileHint(profileId) {
  const { profileHint } = getHomeElements();
  if (!profileHint) return;

  try {
    const profiles = await getRecommendationProfiles();

    const selectedProfile =
      profiles.find((profile) => normalizeText(profile.id) === normalizeText(profileId)) || null;

    setText(
      profileHint,
      selectedProfile
        ? selectedProfile.description
        : 'Escolha um perfil para o consultor entender melhor o seu tipo de uso.'
    );
  } catch (error) {
    console.error('[Home] Erro ao atualizar hint:', error);
  }
}

// ===== LISTENERS DO FORMULÁRIO =====

function attachBudgetFormattingListener() {
  const { budgetInput } = getHomeElements();
  if (!budgetInput) return;

  budgetInput.addEventListener('focus', () => {
    setValue(budgetInput, normalizeBudgetInputValue(getValue(budgetInput)));
  });

  budgetInput.addEventListener('blur', () => {
    const amount = extractRobustBudget(getValue(budgetInput));
    const currentValue = getValue(budgetInput);
    setValue(budgetInput, amount ? formatBudgetInputValue(amount) : currentValue);
    saveDraft();
  });
}

function attachProfileHintListener() {
  const { profileSelect } = getHomeElements();
  if (!profileSelect) return;

  profileSelect.addEventListener('change', async (event) => {
    await updateProfileHint(event.target.value);
    saveDraft();
  });
}

function attachDraftListeners() {
  const { budgetInput, focusSelect } = getHomeElements();

  if (budgetInput) {
    budgetInput.addEventListener('input', saveDraft);
  }

  if (focusSelect) {
    focusSelect.addEventListener('change', saveDraft);
  }
}

// ===== CARREGAMENTO DE SEÇÕES =====

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

async function runPipelineAnimation(target) {
  if (!target) return;

  const steps = [
    'Mapeando dispositivos compatíveis...',
    'Ajustando filtros de orçamento...',
    'Aplicando pesos do perfil escolhido...',
    'Cruzando dados com prioridade...',
    'Gerando raciocínio explicável...'
  ];

  target.innerHTML = `
    <div class="pipeline-loader">
      <div class="pipeline-spinner"></div>
      <div class="pipeline-text" id="pipeline-text">${steps[0]}</div>
    </div>
  `;

  const textEl = target.querySelector('#pipeline-text');
  if (!textEl) return;

  for (let i = 1; i < steps.length; i++) {
    await delay(600);
    textEl.style.opacity = '0';
    await delay(200);
    textEl.textContent = steps[i];
    textEl.style.opacity = '1';
  }
  await delay(400);
}

async function loadFeaturedCatalog() {
  try {
    renderCatalogLoading({
      target: '[data-catalog-grid]',
      quantity: 6
    });

    const devices = await getFeaturedDevices(6);

    renderCatalogDevices({
      devices,
      target: '[data-catalog-grid]'
    });
  } catch (error) {
    console.error('[Home] Erro ao carregar catálogo:', error);

    renderCatalogError({
      message: 'Não conseguimos carregar o catálogo agora. Tente novamente em instantes.',
      target: '[data-catalog-grid]'
    });
  }
}

async function loadFaq() {
  try {
    const faqItems = await fetchFaqItems();

    renderFaqItems({
      items: faqItems,
      target: '[data-faq-list]'
    });
  } catch (error) {
    console.error('[Home] Erro ao carregar FAQ:', error);

    renderSectionMessage({
      title: 'FAQ indisponível',
      description: 'Não foi possível carregar as perguntas frequentes agora.',
      variant: 'error',
      target: '[data-faq-list]'
    });
  }
}

// ===== SUBMISSÃO DO FORMULÁRIO =====

async function handleRecommendationSubmit(event) {
  event.preventDefault();

  const payload = getDraftPayload();
  const validation = validateRecommendationForm(payload);

  if (!validation.valid) {
    setStatusMessage(validation.message, 'error');

    clearRecommendationState({
      resultsTarget: '[data-recommendation-results]',
      explanationTarget: '[data-recommendation-explanation]'
    });

    return;
  }

  try {
    setStatusMessage('', 'default');
    setFormLoading(true);
    saveDraft();

    renderRecommendationLoadingState({
      resultsTarget: '[data-recommendation-results]',
      explanationTarget: '[data-recommendation-explanation]',
      quantity: 3
    });

    // Pipeline animation roda em paralelo com a busca real,
    // dando feedback visual de "processamento inteligente" ao usuário
    const { statusBox } = getHomeElements();
    const [, result] = await Promise.all([
      runPipelineAnimation(statusBox),
      explainRecommendation({
        budget: payload.budget,
        profileId: payload.profileId,
        focusTag: payload.focusTag,
        limit: 3
      })
    ]);

    renderRecommendationState({
      result,
      resultsTarget: '[data-recommendation-results]',
      explanationTarget: '[data-recommendation-explanation]'
    });

    // Persistir análise se usuário autenticado
    if (auth.currentUser && result.success && result.bestMatch) {
      try {
        await saveRecommendationAnalysis({
          userId: auth.currentUser.uid,
          profileId: payload.profileId,
          focusTag: payload.focusTag,
          budget: payload.budget,
          bestMatchId: result.bestMatch.id,
          bestMatchData: {
            brand: result.bestMatch.brand,
            model: result.bestMatch.model,
            price: result.bestMatch.price
          },
          alternatives: (result.alternatives || []).map((alt) => ({
            id: alt.id,
            brand: alt.brand,
            model: alt.model
          })),
          explanation: result.explanation || ''
        });
        console.log('[Home] Análise salva com sucesso');
      } catch (error) {
        console.warn('[Home] Não foi possível salvar análise:', error);
        // Não quebra a experiência do usuário se o Firestore falhar
      }
    }

    if (result.success) {
      setStatusMessage('Análise concluída com sucesso.', 'success');
    } else {
      setStatusMessage(
        result.message || 'Nenhuma opção compatível foi encontrada.',
        'error'
      );
    }
  } catch (error) {
    console.error('[Home] Erro na recomendação:', error);

    renderRecommendationErrorState({
      message: 'Ocorreu um erro ao analisar seu perfil agora. Tente novamente.',
      resultsTarget: '[data-recommendation-results]',
      explanationTarget: '[data-recommendation-explanation]'
    });

    setStatusMessage('Não foi possível concluir a análise agora.', 'error');
  } finally {
    setFormLoading(false);
  }
}

async function handleRecommendationReset() {
  const { form, budgetInput, profileSelect, focusSelect } = getHomeElements();

  if (form) {
    form.reset();
  }

  if (budgetInput) setValue(budgetInput, '');
  if (profileSelect) setValue(profileSelect, '');
  if (focusSelect) setValue(focusSelect, '');

  clearDraft();
  await updateProfileHint('');
  setStatusMessage('', 'default');

  clearRecommendationState({
    resultsTarget: '[data-recommendation-results]',
    explanationTarget: '[data-recommendation-explanation]'
  });
}

// ===== INICIALIZAÇÃO =====

function attachFormListeners() {
  const { form, resetButton } = getHomeElements();

  if (form) {
    form.addEventListener('submit', handleRecommendationSubmit);
  }

  if (resetButton) {
    resetButton.addEventListener('click', handleRecommendationReset);
  }
}

async function bootstrapHome() {
  // Carregar dados iniciais em paralelo
  await Promise.all([
    populateProfileSelect(),
    loadFeaturedCatalog(),
    loadFaq()
  ]);

  // Restaurar draft anterior
  restoreDraft();

  // Attach listeners
  populateFocusSelect();
  attachBudgetFormattingListener();
  attachProfileHintListener();
  attachDraftListeners();
  attachFormListeners();
  
  // Inicializa os selects customizados (Vital para o layout funcionar)
  initEnhancedSelects();



  console.log('[Home] Inicialização concluída');
}

document.addEventListener('DOMContentLoaded', bootstrapHome);
