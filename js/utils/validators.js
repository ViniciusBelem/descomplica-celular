function normalizeText(value) {
  return String(value ?? '').trim();
}

export function isEmpty(value) {
  return normalizeText(value).length === 0;
}

export function hasMinLength(value, min = 1) {
  return normalizeText(value).length >= Number(min || 1);
}

export function hasMaxLength(value, max = Infinity) {
  return normalizeText(value).length <= Number(max || Infinity);
}

export function isValidEmail(email) {
  const normalized = normalizeText(email).toLowerCase();

  if (!normalized) return false;

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized);
}

export function isStrongPassword(password) {
  const normalized = String(password ?? '');

  return normalized.length >= 6;
}

export function parseBudget(value) {
  const normalized = String(value ?? '')
    .replace(/[^\d,.-]/g, '')
    .replace(',', '.');

  const parsed = Number(normalized);

  return Number.isFinite(parsed) ? parsed : 0;
}

export function isValidBudget(value) {
  const amount = typeof value === 'number' ? value : parseBudget(value);
  return Number.isFinite(amount) && amount > 0;
}

export function isValidSelectValue(value) {
  return !isEmpty(value);
}

export function validateRecommendationForm({
  budget = 0,
  profileId = '',
  focusTag = ''
} = {}) {
  if (!isValidBudget(budget)) {
    return {
      valid: false,
      field: 'budget',
      message: 'Informe um orçamento válido para continuar.'
    };
  }

  if (!isValidSelectValue(profileId)) {
    return {
      valid: false,
      field: 'profileId',
      message: 'Selecione um perfil de uso.'
    };
  }

  if (!isValidSelectValue(focusTag)) {
    return {
      valid: false,
      field: 'focusTag',
      message: 'Selecione a prioridade principal do aparelho.'
    };
  }

  return {
    valid: true,
    field: null,
    message: ''
  };
}

export function validateLoginForm({
  email = '',
  password = ''
} = {}) {
  if (!isValidEmail(email)) {
    return {
      valid: false,
      field: 'email',
      message: 'Informe um e-mail válido.'
    };
  }

  if (!hasMinLength(password, 6)) {
    return {
      valid: false,
      field: 'password',
      message: 'A senha deve ter pelo menos 6 caracteres.'
    };
  }

  return {
    valid: true,
    field: null,
    message: ''
  };
}

export function validateRegisterForm({
  name = '',
  email = '',
  password = '',
  confirmPassword = ''
} = {}) {
  if (!hasMinLength(name, 2)) {
    return {
      valid: false,
      field: 'name',
      message: 'Informe um nome válido.'
    };
  }

  if (!isValidEmail(email)) {
    return {
      valid: false,
      field: 'email',
      message: 'Informe um e-mail válido.'
    };
  }

  if (!isStrongPassword(password)) {
    return {
      valid: false,
      field: 'password',
      message: 'A senha deve ter pelo menos 6 caracteres.'
    };
  }

  if (String(password) !== String(confirmPassword)) {
    return {
      valid: false,
      field: 'confirmPassword',
      message: 'As senhas não coincidem.'
    };
  }

  return {
    valid: true,
    field: null,
    message: ''
  };
}

export function validateRequiredFields(fields = {}) {
  const entries = Object.entries(fields);

  for (const [field, value] of entries) {
    if (isEmpty(value)) {
      return {
        valid: false,
        field,
        message: `O campo "${field}" é obrigatório.`
      };
    }
  }

  return {
    valid: true,
    field: null,
    message: ''
  };
}