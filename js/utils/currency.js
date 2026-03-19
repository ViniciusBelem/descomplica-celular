const DEFAULT_LOCALE = 'pt-BR';
const DEFAULT_CURRENCY = 'BRL';

export function formatBRL(value) {
  const amount = Number(value || 0);

  return new Intl.NumberFormat(DEFAULT_LOCALE, {
    style: 'currency',
    currency: DEFAULT_CURRENCY
  }).format(amount);
}

export function parseBRL(value) {
  const normalized = String(value ?? '')
    .replace(/[^\d,.-]/g, '')
    .replace(',', '.');

  const parsed = Number(normalized);

  return Number.isFinite(parsed) ? parsed : 0;
}

export function isPositiveCurrencyValue(value) {
  const amount = typeof value === 'number' ? value : parseBRL(value);
  return Number.isFinite(amount) && amount > 0;
}

export function formatBudgetInputValue(value) {
  const amount = Number(value || 0);
  if (!amount) return '';
  return formatBRL(amount);
}

export function normalizeBudgetInputValue(value) {
  const amount = parseBRL(value);
  if (!amount) return '';
  return String(amount);
}

export function clampCurrencyValue(value, min = 0, max = Number.MAX_SAFE_INTEGER) {
  const amount = typeof value === 'number' ? value : parseBRL(value);

  if (!Number.isFinite(amount)) {
    return Number(min || 0);
  }

  return Math.min(Math.max(amount, Number(min || 0)), Number(max || Number.MAX_SAFE_INTEGER));
}