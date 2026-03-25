import { formatBRL } from '../utils/currency.js';
import { qs, qsa, setHTML, setText } from '../utils/dom.js';

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function resolveElement(targetOrSelector) {
  if (!targetOrSelector) return null;
  if (typeof targetOrSelector === 'string') {
    return qs(targetOrSelector);
  }
  return targetOrSelector;
}

function createMetricMarkup(value, subtitle) {
  return `
    <div class="metric-value">${escapeHtml(value)}</div>
    <div class="metric-subtitle">${escapeHtml(subtitle)}</div>
  `;
}

function createSkeletonMetricMarkup() {
  return `
    <div class="skeleton skeleton-title" style="max-width: 140px;"></div>
    <div class="skeleton skeleton-line skeleton-line--lg"></div>
  `;
}

function createChartSkeletonMarkup() {
  return `
    <div class="skeleton skeleton-block chart-skeleton" style="height: 280px; border-radius: var(--radius-sm);"></div>
  `;
}

function createMatchesSkeletonMarkup() {
  return `
    <div class="skeleton skeleton-text" style="height: 3rem; margin-bottom: 1rem;"></div>
    <div class="skeleton skeleton-text" style="height: 3rem; margin-bottom: 1rem;"></div>
    <div class="skeleton skeleton-text" style="height: 3rem; margin-bottom: 1rem;"></div>
    <div class="skeleton skeleton-text" style="height: 3rem;"></div>
  `;
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

function createChartMarkup(items = []) {
  if (!Array.isArray(items) || !items.length) {
    return createFeedbackMarkup({
      title: 'Sem tendência suficiente',
      description: 'Ainda não há dados suficientes para montar o gráfico.',
      variant: 'empty'
    });
  }

  return `
    <div class="dashboard-chart-wrapper">
      ${items
        .map((item) => {
          const value = Math.max(0, Math.min(100, Number(item.value || 0)));

          return `
            <div class="dashboard-chart-column">
              <span class="dashboard-chart-value">
                ${escapeHtml(`${value}%`)}
              </span>

              <div class="dashboard-chart-track">
                <div
                  class="dashboard-chart-bar"
                  data-final-height="${value}"
                  style="height: 0%;"
                ></div>
              </div>

              <span class="dashboard-chart-label">
                ${escapeHtml(item.label)}
              </span>
            </div>
          `;
        })
        .join('')}
    </div>
  `;
}

function createMatchItemMarkup(match) {
  return `
    <div class="match-item">
      <div class="match-info">
        <h4>${escapeHtml(match.model)}</h4>
        <p>${escapeHtml(match.profileLabel)}</p>
      </div>
      <div class="match-price">${escapeHtml(formatBRL(match.price))}</div>
    </div>
  `;
}

function createEmptyMatchesMarkup() {
  return `
    <div class="dashboard-empty-state">
      <h3 class="dashboard-empty-state__title">Nenhuma análise encontrada</h3>
      <p class="dashboard-empty-state__description">
        Assim que houver registros, este painel começará a mostrar histórico e sinais de tendência.
      </p>
      <a href="./index.html#consultor" class="btn btn-secondary">Fazer primeira análise</a>
    </div>
  `;
}

export function renderDashboardUser(user = null) {
  const nameElements = qsa('#user-name-display');
  const emailElements = qsa('#user-email-display');
  const avatarElements = [
    ...qsa('#user-avatar-initial'),
    ...qsa('#user-avatar-topbar'),
    ...qsa('#user-avatar-sidebar')
  ];

  if (!user) {
    nameElements.forEach((element) => setText(element, 'Visitante'));
    emailElements.forEach((element) => setText(element, 'Sessão indisponível'));
    avatarElements.forEach((element) => setText(element, '?'));
    return;
  }

  const displayName =
    user.displayName ||
    String(user.email || '').split('@')[0] ||
    'Usuário';

  nameElements.forEach((element) => setText(element, displayName));
  emailElements.forEach((element) =>
    setText(element, user.email || 'E-mail não disponível')
  );
  avatarElements.forEach((element) =>
    setText(element, displayName.charAt(0).toUpperCase())
  );
}

export function renderDashboardStatus({
  label = 'Conectando...',
  tone = 'default'
} = {}) {
  const badge = qs('#api-status-badge');
  if (!badge) return;

  badge.textContent = label;
  badge.className = 'badge';
  badge.dataset.state = tone;
}

export function renderDashboardLoading() {
  setHTML(resolveElement('#api-latency-container'), createSkeletonMetricMarkup());
  setHTML(resolveElement('#devices-analyzed-container'), createSkeletonMetricMarkup());
  setHTML(resolveElement('#avg-budget-container'), createSkeletonMetricMarkup());
  setHTML(resolveElement('#chart-container'), createChartSkeletonMarkup());
  setHTML(resolveElement('#recent-matches-container'), createMatchesSkeletonMarkup());

  renderDashboardStatus({
    label: 'Sincronizando...',
    tone: 'loading'
  });
}

export function renderDashboardMetrics(metrics = {}) {
  const latency = metrics.latencyLabel || '—';
  const totalMatches = Number(metrics.totalMatches || 0);
  const averageBudget = Number(metrics.averageBudget || 0);

  setHTML(
    resolveElement('#api-latency-container'),
    createMetricMarkup(latency, 'Latência estimada da sincronização')
  );

  setHTML(
    resolveElement('#devices-analyzed-container'),
    createMetricMarkup(String(totalMatches), 'Análises registradas')
  );

  setHTML(
    resolveElement('#avg-budget-container'),
    createMetricMarkup(formatBRL(averageBudget), 'Investimento médio analisado')
  );
}

export function renderDashboardChart(items = []) {
  const container = resolveElement('#chart-container');
  if (!container) return;

  setHTML(container, createChartMarkup(items));

  requestAnimationFrame(() => {
    const bars = container.querySelectorAll('.dashboard-chart-bar');
    bars.forEach((bar) => {
      const finalHeight = bar.dataset.finalHeight || '0';
      requestAnimationFrame(() => {
        bar.style.height = `${finalHeight}%`;
      });
    });
  });
}

export function renderDashboardMatches(matches = []) {
  const container = resolveElement('#recent-matches-container');
  if (!container) return;

  if (!Array.isArray(matches) || !matches.length) {
    setHTML(container, createEmptyMatchesMarkup());
    return;
  }

  setHTML(container, matches.map(createMatchItemMarkup).join(''));
}

export function renderDashboardError(
  message = 'Não foi possível carregar o painel agora.'
) {
  setHTML(
    resolveElement('#chart-container'),
    createFeedbackMarkup({
      title: 'Falha no carregamento',
      description: message,
      variant: 'error'
    })
  );

  setHTML(
    resolveElement('#recent-matches-container'),
    createFeedbackMarkup({
      title: 'Histórico indisponível',
      description: message,
      variant: 'error'
    })
  );

  setHTML(
    resolveElement('#api-latency-container'),
    createMetricMarkup('—', 'Dados indisponíveis')
  );

  setHTML(
    resolveElement('#devices-analyzed-container'),
    createMetricMarkup('0', 'Sem leitura disponível')
  );

  setHTML(
    resolveElement('#avg-budget-container'),
    createMetricMarkup(formatBRL(0), 'Sem leitura disponível')
  );

  renderDashboardStatus({
    label: 'Erro de sincronização',
    tone: 'error'
  });
}