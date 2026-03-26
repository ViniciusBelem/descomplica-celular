import { formatBRL } from '../utils/currency.js';
import { qs, setHTML } from '../utils/dom.js';
import { escapeHtml, resolveElement } from '../utils/security.js';

function translateCriterion(criterion) {
  const labels = {
    camera: 'Câmera',
    performance: 'Desempenho',
    battery: 'Bateria',
    display: 'Tela',
    durability: 'Durabilidade',
    longevity: 'Longevidade',
    costBenefit: 'Custo-benefício'
  };

  return labels[criterion] || criterion;
}

function getRecommendationBadge(position) {
  if (position === 1) return 'Melhor escolha';
  if (position === 2) return 'Alternativa forte';
  if (position === 3) return 'Boa comparação';
  return 'Opção recomendada';
}

function createFeedbackMarkup({
  title = '',
  description = '',
  variant = 'default'
} = {}) {
  return `
    <div class="feedback-box feedback-box--${escapeHtml(variant)}">
      ${title ? `<h3 class="feedback-box-title">${escapeHtml(title)}</h3>` : ''}
      ${
        description
          ? `<p class="feedback-box-description">${escapeHtml(description)}</p>`
          : ''
      }
    </div>
  `;
}

function createLoadingMarkup(quantity = 3) {
  return Array.from({ length: quantity }, (_, index) => {
    return `
      <div class="skeleton-card skeleton-card--recommendation" aria-hidden="true" data-skeleton-index="${
        index + 1
      }">
        <div class="skeleton skeleton-image"></div>
        <div class="skeleton skeleton-line skeleton-line--lg"></div>
        <div class="skeleton skeleton-line"></div>
        <div class="skeleton skeleton-line skeleton-line--sm"></div>
      </div>
    `;
  }).join('');
}

function buildSpecsList(device) {
  const specs = [
    { label: 'Tela', value: device.specs?.screen },
    { label: 'Chip', value: device.specs?.chipset },
    { label: 'Bateria', value: device.specs?.battery },
    { label: 'Memória', value: device.specs?.memory },
    { label: 'Armazenamento', value: device.specs?.storage },
    { label: 'Câmera', value: device.specs?.cameraMain }
  ];

  return specs
    .filter((item) => item.value)
    .map(
      (item) => `
        <li class="device-spec-item">
          <span class="device-spec-label">${escapeHtml(item.label)}:</span>
          <span class="device-spec-value">${escapeHtml(item.value)}</span>
        </li>
      `
    )
    .join('');
}

function buildHighlightsList(highlights = []) {
  if (!Array.isArray(highlights) || !highlights.length) {
    return `
      <li class="highlight-item">
        <span class="highlight-name">Sem destaques disponíveis</span>
      </li>
    `;
  }

  return highlights
    .map(
      (item) => `
        <li class="highlight-item">
          <span class="highlight-name">${escapeHtml(translateCriterion(item.criterion))}</span>
          <span class="highlight-score">${Number(item.deviceScore || 0)}/100</span>
        </li>
      `
    )
    .join('');
}

function createExplanationMarkup(result) {
  if (!result?.explanation) return '';

  const profileLabel = result.profile?.label
    ? `<span class="recommendation-profile-chip">${escapeHtml(result.profile.label)}</span>`
    : '';

  const budgetLabel = result.budget
    ? `<span class="recommendation-budget-chip">Orçamento analisado: ${escapeHtml(
        formatBRL(result.budget)
      )}</span>`
    : '';

  const focusLabel = result.focusTag
    ? `<span class="recommendation-budget-chip">Foco: ${escapeHtml(result.focusTag)}</span>`
    : '';

  return `
    <div class="recommendation-explanation-box">
      <div class="recommendation-explanation-meta">
        ${profileLabel}
        ${budgetLabel}
        ${focusLabel}
      </div>
      <h3 class="recommendation-explanation-title">Resumo da análise</h3>
      <p class="recommendation-explanation-text">${escapeHtml(result.explanation)}</p>
    </div>
  `;
}

function createRecommendationCard(device) {
  const recommendation = device.recommendation || {};
  const position = Number(recommendation.position || 0);

  return `
    <article class="recommendation-card ${
      position === 1 ? 'recommendation-card--best' : ''
    }" data-device-id="${escapeHtml(device.id)}">
      <div class="recommendation-card-header">
        <span class="recommendation-rank">${escapeHtml(getRecommendationBadge(position))}</span>
        <span class="recommendation-score">${Number(
          recommendation.finalScore || 0
        ).toFixed(2)}/100</span>
      </div>

      <div class="recommendation-card-main">
        <div class="recommendation-card-media">
          <img
            class="recommendation-card-image"
            src="${escapeHtml(device.image)}"
            alt="${escapeHtml(`${device.brand} ${device.model}`)}"
            loading="lazy"
          />
        </div>

        <div class="recommendation-card-content">
          <p class="recommendation-card-brand">${escapeHtml(device.brand)}</p>
          <h3 class="recommendation-card-title">${escapeHtml(device.model)}</h3>
          <p class="recommendation-card-price">${escapeHtml(formatBRL(device.price))}</p>
          <p class="recommendation-card-summary">${escapeHtml(device.summary)}</p>
          <p class="recommendation-card-reason">${escapeHtml(recommendation.reason || '')}</p>
          ${
            recommendation.alternativeNote
              ? `<p class="recommendation-card-note">${escapeHtml(
                  recommendation.alternativeNote
                )}</p>`
              : ''
          }
        </div>
      </div>

      <div class="recommendation-card-details">
        <div class="recommendation-card-column">
          <h4 class="recommendation-card-subtitle">Pontos fortes</h4>
          <ul class="recommendation-highlight-list">
            ${buildHighlightsList(recommendation.highlights)}
          </ul>
        </div>

        <div class="recommendation-card-column">
          <h4 class="recommendation-card-subtitle">Ficha rápida</h4>
          <ul class="device-spec-list">
            ${buildSpecsList(device)}
          </ul>
        </div>
      </div>
    </article>
  `;
}

export function renderRecommendationState({
  result = null,
  resultsTarget = '[data-recommendation-results]',
  explanationTarget = '[data-recommendation-explanation]'
} = {}) {
  const resultsElement = resolveElement(resultsTarget);
  const explanationElement = resolveElement(explanationTarget);

  if (!resultsElement) return;

  if (!result?.success || !Array.isArray(result.ranking) || !result.ranking.length) {
    setHTML(
      resultsElement,
      createFeedbackMarkup({
        title: 'Nenhuma recomendação encontrada',
        description:
          result?.message ||
          'Tente ajustar orçamento, perfil ou prioridade para uma nova análise.',
        variant: 'empty'
      })
    );

    if (explanationElement) {
      setHTML(explanationElement, '');
    }

    return;
  }

  setHTML(resultsElement, result.ranking.map(createRecommendationCard).join(''));

  if (explanationElement) {
    setHTML(explanationElement, createExplanationMarkup(result));
  }
}

export function renderRecommendationLoadingState({
  resultsTarget = '[data-recommendation-results]',
  explanationTarget = '[data-recommendation-explanation]',
  quantity = 3
} = {}) {
  const resultsElement = resolveElement(resultsTarget);
  const explanationElement = resolveElement(explanationTarget);

  if (!resultsElement) return;

  setHTML(resultsElement, createLoadingMarkup(quantity));

  if (explanationElement) {
    setHTML(explanationElement, '');
  }
}

export function renderRecommendationErrorState({
  message = 'Não foi possível gerar a recomendação agora.',
  resultsTarget = '[data-recommendation-results]',
  explanationTarget = '[data-recommendation-explanation]'
} = {}) {
  const resultsElement = resolveElement(resultsTarget);
  const explanationElement = resolveElement(explanationTarget);

  if (!resultsElement) return;

  setHTML(
    resultsElement,
    createFeedbackMarkup({
      title: 'Erro ao gerar recomendação',
      description: message,
      variant: 'error'
    })
  );

  if (explanationElement) {
    setHTML(explanationElement, '');
  }
}

export function clearRecommendationState({
  resultsTarget = '[data-recommendation-results]',
  explanationTarget = '[data-recommendation-explanation]'
} = {}) {
  const resultsElement = resolveElement(resultsTarget);
  const explanationElement = resolveElement(explanationTarget);

  if (resultsElement) {
    setHTML(resultsElement, '');
  }

  if (explanationElement) {
    setHTML(explanationElement, '');
  }
}