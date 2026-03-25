/**
 * Funções de segurança reutilizáveis
 * Centraliza escaping, sanitização e validação
 */

/**
 * Escapa caracteres HTML para prevenir XSS
 */
export function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

/**
 * Normaliza texto: remove acentos, espaços e converte para minúsculas
 */
export function normalizeText(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();
}

/**
 * Sanitiza path para redirect evitando open redirects
 */
export function sanitizeRedirectPath(path, fallback = 'dashboard.html') {
  if (!path || typeof path !== 'string') {
    return fallback;
  }

  const normalized = path.trim();

  if (!normalized) {
    return fallback;
  }

  const blockedPrefixes = ['http:', 'https:', 'javascript:', '//'];
  const isBlocked = blockedPrefixes.some((prefix) =>
    normalized.toLowerCase().startsWith(prefix)
  );

  if (isBlocked) {
    return fallback;
  }

  return normalized;
}

/**
 * Valida email básico
 */
export function isValidEmail(email) {
  const normalized = String(email ?? '').trim().toLowerCase();

  if (!normalized) return false;

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized);
}

/**
 * Cria markup para feedback boxes com escape
 */
export function createFeedbackMarkup({
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

/**
 * Resolve elemento do DOM por seletor ou retorna direto
 */
export function resolveElement(targetOrSelector) {
  if (!targetOrSelector) return null;
  if (typeof targetOrSelector === 'string') {
    return document.querySelector(targetOrSelector);
  }
  return targetOrSelector;
}
