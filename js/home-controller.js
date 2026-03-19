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

const FAQ_DATA_PATH = './data/faq.json';
const STORAGE_KEY = 'homeRecommendationDraft';

function normalizeText(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();
}

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

function setStatusMessage(message = '', variant = 'default') {
  const { statusBox } = getHomeElements();
  if (!statusBox) return;

  if (!message) {
    clearSection(statusBox);
    return;
  }

  renderSectionMessage({
    title: variant === 'error' ? 'Atenção' : 'Status',
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

function getDraftPayload() {
  const { budgetInput, profileSelect, focusSelect } = getHomeElements();

  return {
    budget: parseBRL(getValue(budgetInput)),
    profileId: normalizeText(getValue(profileSelect)),
    focusTag: normalizeText(getValue(focusSelect))
  };
}

function saveDraft() {
  const draft = getDraftPayload();
  setStorageItem(STORAGE_KEY, draft);
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

function populateFocusSelect() {
  const { focusSelect } = getHomeElements();
  if (!focusSelect) return;

  focusSelect.innerHTML = buildFocusOptions()
    .map((item) => `<option value="${item.value}">${item.label}</option>`)
    .join('');
}

async function populateProfileSelect() {
  const { profileSelect } = getHomeElements();
  if (!profileSelect) return;

  const profiles = await getRecommendationProfiles();

  profileSelect.innerHTML = [
    '<option value="">Selecione seu perfil</option>',
    ...profiles.map(
      (profile) => `<option value="${profile.id}">${profile.label}</option>`
    )
  ].join('');
}

async function updateProfileHint(profileId) {
  const { profileHint } = getHomeElements();
  if (!profileHint) return;

  const profiles = await getRecommendationProfiles();

  const selectedProfile =
    profiles.find((profile) => normalizeText(profile.id) === normalizeText(profileId)) || null;

  setText(
    profileHint,
    selectedProfile
      ? selectedProfile.description
      : 'Escolha um perfil para o consultor entender melhor o seu tipo de uso.'
  );
}

function attachBudgetFormattingListener() {
  const { budgetInput } = getHomeElements();
  if (!budgetInput) return;

  budgetInput.addEventListener('focus', () => {
    setValue(budgetInput, normalizeBudgetInputValue(getValue(budgetInput)));
  });

  budgetInput.addEventListener('blur', () => {
    const amount = parseBRL(getValue(budgetInput));
    setValue(budgetInput, amount ? formatBudgetInputValue(amount) : '');
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

function attachFocusDraftListener() {
  const { focusSelect } = getHomeElements();
  if (!focusSelect) return;

  focusSelect.addEventListener('change', () => {
    saveDraft();
  });
}

function attachBudgetDraftListener() {
  const { budgetInput } = getHomeElements();
  if (!budgetInput) return;

  budgetInput.addEventListener('input', () => {
    saveDraft();
  });
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
    console.error(error);

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
    console.error(error);

    renderSectionMessage({
      title: 'FAQ indisponível',
      description: 'Não foi possível carregar as perguntas frequentes agora.',
      variant: 'error',
      target: '[data-faq-list]'
    });
  }
}

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

    const result = await explainRecommendation({
      budget: payload.budget,
      profileId: payload.profileId,
      focusTag: payload.focusTag,
      limit: 3
    });

    renderRecommendationState({
      result,
      resultsTarget: '[data-recommendation-results]',
      explanationTarget: '[data-recommendation-explanation]'
    });

    if (result.success) {
      setStatusMessage('Análise concluída com sucesso.', 'success');
    } else {
      setStatusMessage(
        result.message || 'Nenhuma opção compatível foi encontrada.',
        'error'
      );
    }
  } catch (error) {
    console.error(error);

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
  const { form } = getHomeElements();

  if (form) {
    form.reset();
  }

  clearDraft();
  await updateProfileHint('');
  setStatusMessage('', 'default');

  clearRecommendationState({
    resultsTarget: '[data-recommendation-results]',
    explanationTarget: '[data-recommendation-explanation]'
  });
}

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
  populateFocusSelect();
  attachBudgetFormattingListener();
  attachProfileHintListener();
  attachFocusDraftListener();
  attachBudgetDraftListener();
  attachFormListeners();

  try {
    await populateProfileSelect();
    restoreDraft();
    await updateProfileHint(getHomeElements().profileSelect?.value || '');
  } catch (error) {
    console.error(error);
    setStatusMessage('Não foi possível carregar os perfis do consultor.', 'error');
  }

  await Promise.allSettled([loadFeaturedCatalog(), loadFaq()]);
}

document.addEventListener('DOMContentLoaded', bootstrapHome);