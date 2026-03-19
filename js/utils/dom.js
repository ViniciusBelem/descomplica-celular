export function qs(selector, scope = document) {
  return scope.querySelector(selector);
}

export function qsa(selector, scope = document) {
  return Array.from(scope.querySelectorAll(selector));
}

export function setText(element, value = '') {
  if (!element) return;
  element.textContent = String(value ?? '');
}

export function setHTML(element, html = '') {
  if (!element) return;
  element.innerHTML = String(html ?? '');
}

export function clearElement(element) {
  if (!element) return;
  element.innerHTML = '';
}

export function showElement(element, display = '') {
  if (!element) return;
  element.hidden = false;
  element.style.display = display;
}

export function hideElement(element) {
  if (!element) return;
  element.hidden = true;
  element.style.display = 'none';
}

export function toggleElement(element, shouldShow, display = '') {
  if (shouldShow) {
    showElement(element, display);
    return;
  }

  hideElement(element);
}

export function setDisabled(element, isDisabled = true) {
  if (!element) return;
  element.disabled = Boolean(isDisabled);
}

export function setValue(element, value = '') {
  if (!element) return;
  element.value = value ?? '';
}

export function getValue(element) {
  if (!element) return '';
  return element.value ?? '';
}

export function setDataset(element, key, value) {
  if (!element || !key) return;
  element.dataset[key] = String(value ?? '');
}

export function createElement(tagName, options = {}) {
  const element = document.createElement(tagName);

  const {
    className = '',
    text = '',
    html = '',
    attributes = {},
    dataset = {}
  } = options;

  if (className) {
    element.className = className;
  }

  if (text) {
    element.textContent = text;
  }

  if (html) {
    element.innerHTML = html;
  }

  Object.entries(attributes).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      element.setAttribute(key, String(value));
    }
  });

  Object.entries(dataset).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      element.dataset[key] = String(value);
    }
  });

  return element;
}

export function appendChildren(parent, children = []) {
  if (!parent || !Array.isArray(children)) return;

  children.forEach((child) => {
    if (child instanceof Node) {
      parent.appendChild(child);
    }
  });
}

export function on(element, eventName, handler, options) {
  if (!element || !eventName || typeof handler !== 'function') return () => {};
  element.addEventListener(eventName, handler, options);

  return () => {
    element.removeEventListener(eventName, handler, options);
  };
}