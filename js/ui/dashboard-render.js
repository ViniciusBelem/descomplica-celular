import { formatBRL } from '../utils/currency.js';
import { qs, setHTML, setText } from '../utils/dom.js';

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
    <div class="skeleton skeleton-title" style="width: 50%;"></div>
    <div class="skeleton skeleton-text" style="width: 80%;"></div>
  `;
}

function createChartSkeletonMarkup() {
  return `
    <div class="skeleton skeleton-block chart-skeleton" style="height: 300px; border-radius: var(--radius-sm);"></div>
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
    <div style="display: flex; height: 100%; align-items: flex-end; justify-content: space-around; gap: 1rem; padding-top: 2rem;">
      ${items
        .map((item) => {
          const value = Math.max(0, Math.min(100, Number(item.value || 0)));

          return `
            <div style="flex: 1; display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
              <span style="font-size: var(--fs-xs); color: var(--brand-cyan); font-weight: 700;">
                ${escapeHtml(`${value}%`)}
              </span>

              <div style="width: 100%; max-width: 60px; background: rgba(0, 229, 255, 0.1); border-radius: var(--radius-sm) var(--radius-sm) 0 0; position: relative; height: 200px; overflow: hidden;">
                <div
                  class="dashboard-chart-bar"
                  data-final-height="${value}"
                  style="position: absolute; bottom: 0; left: 0; width: 100%; height: 0%; background: linear-gradient(0deg, var(--brand-cyan), #00b3cc); transition: height 900ms var(--ease-bounce);"
                ></div>
              </div>

              <span style="font-size: var(--fs-xs); color: var(--text-secondary); text-align: center;">
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
    <div style="text-align: center; padding: 2rem; color: var(--text-muted);">
      <p>Nenhuma análise encontrada no histórico.</p>
      <a href="index.html#assistente" style="color: var(--brand-cyan); font-size: var(--fs-xs); display: block; margin-top: 0.5rem;">
        Fazer primeira análise
      </a>
    </div>
  `;
}

export function renderDashboardUser(user = null) {
  const nameElement = qs('#user-name-display');
  const emailElement = qs('#user-email-display');
  const avatarElement = qs('#user-avatar-initial');

  if (!user) {
    setText(nameElement, 'Visitante');
    setText(emailElement, 'Sessão indisponível');
    setText(avatarElement, '?');
    return;
  }

  const displayName =
    user.displayName ||
    String(user.email || '').split('@')[0] ||
    'Usuário';

  setText(nameElement, displayName);
  setText(emailElement, user.email || 'E-mail não disponível');
  setText(avatarElement, displayName.charAt(0).toUpperCase());
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