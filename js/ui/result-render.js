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

function createFeedbackMarkup({ title = '', description = '', variant = 'default' } = {}) {
  const colors = {
    error: 'border-error/50 bg-error/10 text-error',
    success: 'border-secondary/50 bg-secondary/10 text-secondary',
    empty: 'border-outline-variant/20 bg-surface-container-high text-on-surface-variant',
    default: 'border-primary/50 bg-primary/10 text-primary'
  };
  const colorClass = colors[variant] || colors.default;

  return `
    <div class="p-6 rounded-xl border ${colorClass} mb-6">
      ${title ? `<h3 class="font-bold mb-2">${escapeHtml(title)}</h3>` : ''}
      ${description ? `<p class="text-sm opacity-80">${escapeHtml(description)}</p>` : ''}
    </div>
  `;
}

function createLoadingMarkup(quantity = 3) {
  return Array.from({ length: quantity }, (_, index) => {
    return `
      <div class="flex flex-col md:flex-row gap-6 p-6 mb-6 bg-surface-container-high rounded-2xl border border-outline-variant/5" aria-hidden="true" data-skeleton-index="${index + 1}">
        <div class="w-full md:w-48 h-48 bg-surface-container-highest rounded-xl animate-pulse shrink-0"></div>
        <div class="flex-1 py-2">
          <div class="h-6 w-1/3 bg-surface-variant rounded mb-3 animate-pulse"></div>
          <div class="h-8 w-2/3 bg-surface-variant rounded mb-6 animate-pulse"></div>
          <div class="h-4 w-1/4 bg-surface-variant rounded mb-3 animate-pulse"></div>
          <div class="h-20 w-full bg-surface-variant rounded animate-pulse"></div>
        </div>
      </div>
    `;
  }).join('');
}

function buildHighlightsList(highlights = []) {
  if (!Array.isArray(highlights) || !highlights.length) {
    return `<span class="px-3 py-1 bg-surface-container-highest text-on-surface-variant rounded-full text-xs font-medium">Sem destaques</span>`;
  }

  return highlights
    .map(
      (item) => `
        <span class="px-3 py-1 bg-secondary/10 border border-secondary/20 text-secondary rounded-full text-xs font-bold">
          ${escapeHtml(translateCriterion(item.criterion))} • ${Number(item.deviceScore || 0)}/100
        </span>
      `
    )
    .join('');
}

function createExplanationMarkup(result) {
  if (!result?.explanation) return '';

  const profileLabel = result.profile?.label
    ? `<span class="px-3 py-1 bg-primary/20 text-primary rounded border border-primary/20 text-[10px] font-bold uppercase tracking-widest">${escapeHtml(result.profile.label)}</span>`
    : '';

  const budgetLabel = result.budget
    ? `<span class="px-3 py-1 bg-surface-container-highest text-on-surface rounded border border-outline-variant/20 text-[10px] font-bold uppercase tracking-widest">Teto: ${escapeHtml(formatBRL(result.budget))}</span>`
    : '';

  const focusLabel = result.focusTag
    ? `<span class="px-3 py-1 bg-tertiary/20 text-tertiary rounded border border-tertiary/20 text-[10px] font-bold uppercase tracking-widest">Vetor: ${escapeHtml(result.focusTag)}</span>`
    : '';

  return `
    <div class="bg-surface-container-lowest border border-outline-variant/10 rounded-2xl p-6 md:p-8 mb-8 shadow-inner">
      <div class="flex flex-wrap gap-2 mb-6">
        ${profileLabel}
        ${budgetLabel}
        ${focusLabel}
      </div>
      <div class="flex items-start gap-4">
        <span class="material-symbols-outlined text-3xl text-primary" style="font-variation-settings: 'FILL' 1;">psychology</span>
        <div>
          <h3 class="text-xl font-bold text-on-surface mb-2">Parecer Neural</h3>
          <p class="text-on-surface-variant leading-relaxed text-sm md:text-base">${escapeHtml(result.explanation)}</p>
        </div>
      </div>
    </div>
  `;
}

function createRecommendationCard(device) {
  const recommendation = device.recommendation || {};
  const position = Number(recommendation.position || 0);
  const isBest = position === 1;

  return `
    <article class="relative flex flex-col md:flex-row gap-6 bg-surface-container-high rounded-2xl overflow-hidden border border-outline-variant/5 shadow-xl p-6 hover:-translate-y-1 transition-transform mb-6 ${isBest ? 'border-primary/50 shadow-[0_10px_40px_rgba(192,193,255,0.1)]' : ''}" data-device-id="${escapeHtml(device.id)}">
      
      <div class="relative w-full md:w-48 h-48 shrink-0 bg-[#353437]/50 rounded-xl p-4 flex items-center justify-center">
        <img src="${escapeHtml(device.image)}" alt="${escapeHtml(`${device.brand} ${device.model}`)}" class="max-w-full max-h-full object-contain" loading="lazy" />
        <span class="absolute top-2 left-2 px-3 py-1 text-[10px] uppercase tracking-widest font-black ${isBest ? 'bg-primary text-[#1000a9]' : 'bg-surface-variant text-on-surface'} rounded-full shadow-lg">
          ${escapeHtml(getRecommendationBadge(position))}
        </span>
      </div>

      <div class="flex-1 flex flex-col justify-between pt-2">
        <div>
          <div class="flex justify-between items-start mb-2">
            <div>
              <span class="text-[10px] font-bold uppercase tracking-widest text-primary mb-1 block">${escapeHtml(device.brand)}</span>
              <h3 class="text-2xl font-black text-on-surface tracking-tight leading-none mb-2">${escapeHtml(device.model)}</h3>
            </div>
            <div class="text-right">
              <p class="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold mb-1">Match Score</p>
              <p class="text-2xl font-black text-secondary leading-none">${Number(recommendation.finalScore || 0).toFixed(0)}<span class="text-sm text-on-surface-variant/50">/100</span></p>
            </div>
          </div>
          
          <p class="text-xl font-bold text-on-surface mb-4">${escapeHtml(formatBRL(device.price))}</p>
          
          <div class="flex flex-wrap gap-2 mb-4">
            ${buildHighlightsList(recommendation.highlights)}
          </div>

          <div class="p-4 bg-surface-container-lowest border border-outline-variant/10 rounded-xl mb-4">
            <p class="text-[13px] text-on-surface-variant leading-relaxed"><strong>Painel Técnico:</strong> ${escapeHtml(recommendation.reason || device.summary)}</p>
            ${recommendation.alternativeNote ? `<p class="text-[11px] text-primary/70 mt-2 font-medium">Nota do Sistema: ${escapeHtml(recommendation.alternativeNote)}</p>` : ''}
          </div>
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
        title: 'Nenhuma recomendação',
        description: result?.message || 'Tente ajustar o orçamento, perfil ou prioridade para o algoritmo calcular novamente.',
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
  message = 'O algoritmo falhou ao processar sua requisição.',
  resultsTarget = '[data-recommendation-results]',
  explanationTarget = '[data-recommendation-explanation]'
} = {}) {
  const resultsElement = resolveElement(resultsTarget);
  const explanationElement = resolveElement(explanationTarget);

  if (!resultsElement) return;

  setHTML(
    resultsElement,
    createFeedbackMarkup({
      title: 'Erro Crítico no Motor',
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