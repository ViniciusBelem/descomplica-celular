import { formatBRL } from '../utils/currency.js';
import { qs, setHTML } from '../utils/dom.js';

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
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

function createLoadingCards(quantity = 3, variant = 'catalog') {
  return Array.from({ length: quantity }, (_, index) => {
    return `
      <div
        class="skeleton-card skeleton-card--${escapeHtml(variant)}"
        aria-hidden="true"
        data-skeleton-index="${index + 1}"
      >
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

function createDeviceCard(device) {
  return `
    <article class="catalog-card" data-device-id="${escapeHtml(device.id)}">
      <div class="catalog-card-media">
        <img
          class="catalog-card-image"
          src="${escapeHtml(device.image)}"
          alt="${escapeHtml(`${device.brand} ${device.model}`)}"
          loading="lazy"
        />
      </div>

      <div class="catalog-card-body">
        <div class="catalog-card-top">
          <span class="catalog-card-badge">${escapeHtml(device.badge || 'Recomendado')}</span>
          <span class="catalog-card-brand">${escapeHtml(device.brand)}</span>
        </div>

        <h3 class="catalog-card-title">${escapeHtml(device.model)}</h3>
        <p class="catalog-card-summary">${escapeHtml(device.summary)}</p>

        <ul class="device-spec-list">
          ${buildSpecsList(device)}
        </ul>

        <div class="catalog-card-footer">
          <strong class="catalog-card-price">${escapeHtml(formatBRL(device.price))}</strong>
        </div>
      </div>
    </article>
  `;
}

function createFaqItem(item, index) {
  return `
    <details class="faq-item" ${index === 0 ? 'open' : ''}>
      <summary class="faq-question">${escapeHtml(item.question)}</summary>
      <div class="faq-answer-wrapper">
        <p class="faq-answer">${escapeHtml(item.answer)}</p>
      </div>
    </details>
  `;
}

function resolveElement(targetOrSelector) {
  if (!targetOrSelector) return null;
  if (typeof targetOrSelector === 'string') {
    return qs(targetOrSelector);
  }
  return targetOrSelector;
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