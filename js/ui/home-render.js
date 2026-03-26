import { formatBRL } from '../utils/currency.js';
import { qs, setHTML } from '../utils/dom.js';
import { escapeHtml, resolveElement } from '../utils/security.js';

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

function createLoadingCards(quantity = 3, variant = 'catalog') {
  return Array.from({ length: quantity }, (_, index) => {
    return `
      <div class="aspect-[3/4] bg-surface-container-high rounded-2xl overflow-hidden relative" aria-hidden="true" data-skeleton-index="${index + 1}">
        <div class="absolute inset-0 bg-surface-container-highest animate-pulse"></div>
        <div class="absolute bottom-0 p-8 w-full z-10 bg-gradient-to-t from-background to-transparent">
          <div class="h-3 w-1/3 bg-surface-variant rounded mb-4 animate-pulse"></div>
          <div class="h-6 w-2/3 bg-surface-variant rounded mb-6 animate-pulse"></div>
          <div class="h-4 w-1/4 bg-surface-variant rounded animate-pulse"></div>
        </div>
      </div>
    `;
  }).join('');
}

function createDeviceCard(device) {
  // Mapping the design from Stitch Cinematic Showcase
  return `
    <article class="group relative aspect-[3/4] bg-surface-container-high rounded-2xl overflow-hidden transition-all duration-[800ms] hover:-translate-y-4 hover:shadow-[0_40px_80px_rgba(0,0,0,0.6)]" data-device-id="${escapeHtml(device.id)}">
      <img class="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-[1200ms]" src="${escapeHtml(device.image)}" alt="${escapeHtml(`${device.brand} ${device.model}`)}" loading="lazy"/>
      <div class="absolute inset-0 bg-gradient-to-t from-background via-surface-container-lowest/50 to-transparent"></div>
      
      <div class="absolute top-4 right-4 z-20">
        <span class="px-3 py-1 bg-black/40 backdrop-blur-md rounded-full border border-white/10 text-[10px] font-bold text-white uppercase tracking-widest">${escapeHtml(device.badge || 'Destaque')}</span>
      </div>

      <div class="absolute bottom-0 p-8 w-full transform transition-transform duration-700 group-hover:translate-y-[-0.5rem] z-20">
        <span class="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-2 block">${escapeHtml(device.brand)}</span>
        <h3 class="text-3xl font-bold mb-4 tracking-tighter text-white">${escapeHtml(device.model)}</h3>
        
        <div class="flex flex-wrap items-center gap-2 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity delay-200 mb-4">
          ${device.specs?.screen ? `<span class="px-2 py-1 bg-white/10 text-white rounded border border-white/10">${escapeHtml(device.specs.screen)}</span>` : ''}
          ${device.specs?.storage ? `<span class="px-2 py-1 bg-white/10 text-white rounded border border-white/10">${escapeHtml(device.specs.storage)}</span>` : ''}
        </div>
        
        <strong class="text-xl text-secondary">${escapeHtml(formatBRL(device.price))}</strong>
      </div>
    </article>
  `;
}

function createFaqItem(item, index) {
  return `
    <details class="group border-b border-outline-variant/10 pb-4 cursor-pointer" ${index === 0 ? 'open' : ''}>
      <summary class="w-full flex justify-between items-center py-6 text-left focus:outline-none list-none [&::-webkit-details-marker]:hidden">
        <span class="text-xl font-medium group-hover:text-primary transition-colors">${escapeHtml(item.question)}</span>
        <span class="material-symbols-outlined transition-transform duration-400 group-open:rotate-180 text-on-surface-variant">keyboard_arrow_down</span>
      </summary>
      <div class="text-on-surface-variant leading-relaxed pb-6 pr-8">
        ${escapeHtml(item.answer)}
      </div>
    </details>
  `;
}

export function renderCatalogDevices({
  devices = [],
  target = '[data-catalog-grid]'
} = {}) {
  const container = resolveElement(target);
  if (!container) return;

  if (!Array.isArray(devices) || !devices.length) {
    setHTML(
      container,
      createFeedbackMarkup({
        title: 'Nenhum aparelho encontrado',
        description: 'Não encontramos aparelhos para exibir no catálogo neste momento.',
        variant: 'empty'
      })
    );
    return;
  }

  setHTML(container, devices.map(createDeviceCard).join(''));
}

export function renderCatalogLoading({
  target = '[data-catalog-grid]',
  quantity = 6
} = {}) {
  const container = resolveElement(target);
  if (!container) return;

  setHTML(container, createLoadingCards(quantity, 'catalog'));
}

export function renderCatalogError({
  message = 'Não foi possível carregar o catálogo agora.',
  target = '[data-catalog-grid]'
} = {}) {
  const container = resolveElement(target);
  if (!container) return;

  setHTML(
    container,
    createFeedbackMarkup({
      title: 'Erro ao carregar catálogo',
      description: message,
      variant: 'error'
    })
  );
}

export function renderFaqItems({
  items = [],
  target = '[data-faq-list]'
} = {}) {
  const container = resolveElement(target);
  if (!container) return;

  if (!Array.isArray(items) || !items.length) {
    setHTML(
      container,
      createFeedbackMarkup({
        title: 'FAQ indisponível',
        description: 'As perguntas frequentes não puderam ser carregadas.',
        variant: 'empty'
      })
    );
    return;
  }

  setHTML(container, items.map(createFaqItem).join(''));
}

export function renderSectionMessage({
  title = '',
  description = '',
  variant = 'default',
  target
} = {}) {
  const container = resolveElement(target);
  if (!container) return;

  setHTML(
    container,
    createFeedbackMarkup({
      title,
      description,
      variant
    })
  );
}

export function clearSection(target) {
  const container = resolveElement(target);
  if (!container) return;

  setHTML(container, '');
}