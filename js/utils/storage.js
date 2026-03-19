const DEFAULT_NAMESPACE = 'descomplicaCelular';

function buildKey(key, namespace = DEFAULT_NAMESPACE) {
  return `${namespace}:${String(key ?? '').trim()}`;
}

function isStorageAvailable() {
  try {
    const testKey = '__descomplica_test__';
    window.localStorage.setItem(testKey, 'ok');
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

function safeParse(value, fallback = null) {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

export function setStorageItem(key, value, namespace = DEFAULT_NAMESPACE) {
  if (!isStorageAvailable()) return false;

  try {
    const finalKey = buildKey(key, namespace);
    const serializedValue = JSON.stringify(value);
    window.localStorage.setItem(finalKey, serializedValue);
    return true;
  } catch {
    return false;
  }
}

export function getStorageItem(key, fallback = null, namespace = DEFAULT_NAMESPACE) {
  if (!isStorageAvailable()) return fallback;

  try {
    const finalKey = buildKey(key, namespace);
    const value = window.localStorage.getItem(finalKey);

    if (value === null) {
      return fallback;
    }

    return safeParse(value, fallback);
  } catch {
    return fallback;
  }
}

export function removeStorageItem(key, namespace = DEFAULT_NAMESPACE) {
  if (!isStorageAvailable()) return false;

  try {
    const finalKey = buildKey(key, namespace);
    window.localStorage.removeItem(finalKey);
    return true;
  } catch {
    return false;
  }
}

export function hasStorageItem(key, namespace = DEFAULT_NAMESPACE) {
  if (!isStorageAvailable()) return false;

  try {
    const finalKey = buildKey(key, namespace);
    return window.localStorage.getItem(finalKey) !== null;
  } catch {
    return false;
  }
}

export function clearStorageNamespace(namespace = DEFAULT_NAMESPACE) {
  if (!isStorageAvailable()) return false;

  try {
    const prefix = `${namespace}:`;
    const keysToRemove = [];

    for (let index = 0; index < window.localStorage.length; index += 1) {
      const key = window.localStorage.key(index);

      if (key && key.startsWith(prefix)) {
        keysToRemove.push(key);
      }
    }

    keysToRemove.forEach((key) => {
      window.localStorage.removeItem(key);
    });

    return true;
  } catch {
    return false;
  }
}

export function getStorageKeys(namespace = DEFAULT_NAMESPACE) {
  if (!isStorageAvailable()) return [];

  try {
    const prefix = `${namespace}:`;
    const keys = [];

    for (let index = 0; index < window.localStorage.length; index += 1) {
      const key = window.localStorage.key(index);

      if (key && key.startsWith(prefix)) {
        keys.push(key.replace(prefix, ''));
      }
    }

    return keys;
  } catch {
    return [];
  }
}

export function setSessionItem(key, value, namespace = DEFAULT_NAMESPACE) {
  try {
    const finalKey = buildKey(key, namespace);
    const serializedValue = JSON.stringify(value);
    window.sessionStorage.setItem(finalKey, serializedValue);
    return true;
  } catch {
    return false;
  }
}

export function getSessionItem(key, fallback = null, namespace = DEFAULT_NAMESPACE) {
  try {
    const finalKey = buildKey(key, namespace);
    const value = window.sessionStorage.getItem(finalKey);

    if (value === null) {
      return fallback;
    }

    return safeParse(value, fallback);
  } catch {
    return fallback;
  }
}

export function removeSessionItem(key, namespace = DEFAULT_NAMESPACE) {
  try {
    const finalKey = buildKey(key, namespace);
    window.sessionStorage.removeItem(finalKey);
    return true;
  } catch {
    return false;
  }
}