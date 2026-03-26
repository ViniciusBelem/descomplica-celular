/**
 * Enhanced Select — v2.0 (Reescrito)
 * Transforma <select> nativos em caixas de seleção acessíveis e bonitas.
 *
 * Melhorias sobre a v1:
 * - Listener global registrado uma ÚNICA vez (via flag no document)
 * - Suporte a selects dinâmicos (re-init seguro sem acúmulo)
 * - Acessibilidade: role="listbox", aria-expanded, navegação por teclado
 * - Método destroy() para cleanup de instâncias
 */

const ENHANCED_ATTR = 'data-enhanced-select';
const WRAPPER_CLASS = 'custom-select-wrapper';
const SELECT_CLASS = 'custom-select';
const TRIGGER_CLASS = 'custom-select-trigger';
const OPTIONS_CLASS = 'custom-options';
const OPTION_CLASS = 'custom-option';
const OPEN_CLASS = 'open';
const SELECTED_CLASS = 'selected';

// Flag global para garantir que o listener de click/keyboard
// seja registrado uma ÚNICA vez no document
let globalListenersBound = false;

function closeAllSelects(except = null) {
  document.querySelectorAll(`.${SELECT_CLASS}.${OPEN_CLASS}`).forEach(cs => {
    if (cs !== except) {
      cs.classList.remove(OPEN_CLASS);
      const trigger = cs.querySelector(`.${TRIGGER_CLASS}`);
      if (trigger) trigger.setAttribute('aria-expanded', 'false');
    }
  });
}

function bindGlobalListeners() {
  if (globalListenersBound) return;
  globalListenersBound = true;

  // Fecha ao clicar fora
  document.addEventListener('click', () => {
    closeAllSelects();
  });

  // Fecha ao pressionar Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllSelects();
    }
  });
}

function buildCustomOptions(select, customSelect, trigger, optionsContainer) {
  // Limpa opções anteriores (para suportar re-init dinâmico)
  optionsContainer.innerHTML = '';

  Array.from(select.options).forEach((opt, index) => {
    // Ignora placeholders (disabled sem value ou com value vazio)
    if (opt.disabled && !opt.value) return;

    const customOpt = document.createElement('span');
    customOpt.className = OPTION_CLASS;
    customOpt.textContent = opt.text;
    customOpt.dataset.value = opt.value;
    customOpt.setAttribute('role', 'option');
    customOpt.setAttribute('tabindex', '-1');
    customOpt.id = `${select.id || 'select'}-opt-${index}`;

    if (opt.selected && opt.value) {
      customOpt.classList.add(SELECTED_CLASS);
      customOpt.setAttribute('aria-selected', 'true');
    }

    customOpt.addEventListener('click', function (e) {
      e.stopPropagation();

      // Atualiza texto do trigger
      trigger.querySelector('span').textContent = this.textContent;

      // Sincroniza com o select nativo
      select.value = this.dataset.value;

      // Atualiza estados visuais
      optionsContainer.querySelectorAll(`.${OPTION_CLASS}`).forEach(o => {
        o.classList.remove(SELECTED_CLASS);
        o.setAttribute('aria-selected', 'false');
      });
      this.classList.add(SELECTED_CLASS);
      this.setAttribute('aria-selected', 'true');

      // Fecha o dropdown
      customSelect.classList.remove(OPEN_CLASS);
      trigger.setAttribute('aria-expanded', 'false');

      // Dispara o evento de "change" para o controller identificar a mudança
      select.dispatchEvent(new Event('change', { bubbles: true }));
    });

    optionsContainer.appendChild(customOpt);
  });
}

function enhanceSelect(select) {
  // Se já foi enhanced, faz refresh nas opções (suporta re-populate dinâmico)
  if (select.getAttribute(ENHANCED_ATTR) === 'true') {
    const existingWrapper = select.closest(`.${WRAPPER_CLASS}`);
    if (existingWrapper) {
      const customSelect = existingWrapper.querySelector(`.${SELECT_CLASS}`);
      const trigger = existingWrapper.querySelector(`.${TRIGGER_CLASS}`);
      const optionsContainer = existingWrapper.querySelector(`.${OPTIONS_CLASS}`);

      if (customSelect && trigger && optionsContainer) {
        // Refresh: reconstroi opções + atualiza texto do trigger
        const selectedText = select.options[select.selectedIndex]?.text || 'Selecione...';
        trigger.querySelector('span').textContent = selectedText;
        buildCustomOptions(select, customSelect, trigger, optionsContainer);
        return;
      }
    }
  }

  select.setAttribute(ENHANCED_ATTR, 'true');

  // Estrutura do DOM customizado
  const wrapper = document.createElement('div');
  wrapper.className = WRAPPER_CLASS;

  const customSelect = document.createElement('div');
  customSelect.className = SELECT_CLASS;

  const trigger = document.createElement('div');
  trigger.className = TRIGGER_CLASS;
  trigger.setAttribute('role', 'combobox');
  trigger.setAttribute('aria-expanded', 'false');
  trigger.setAttribute('aria-haspopup', 'listbox');
  trigger.setAttribute('tabindex', '0');

  const selectedText = select.options[select.selectedIndex]?.text || 'Selecione...';
  trigger.innerHTML = `<span>${selectedText}</span><div class="arrow"></div>`;

  const optionsContainer = document.createElement('div');
  optionsContainer.className = OPTIONS_CLASS;
  optionsContainer.setAttribute('role', 'listbox');

  buildCustomOptions(select, customSelect, trigger, optionsContainer);

  customSelect.appendChild(trigger);
  customSelect.appendChild(optionsContainer);
  wrapper.appendChild(customSelect);

  // Insere no DOM e esconde o nativo
  select.parentNode.insertBefore(wrapper, select);
  wrapper.appendChild(select);
  select.style.display = 'none';

  // Toggle do dropdown via click
  trigger.addEventListener('click', function (e) {
    e.stopPropagation();
    closeAllSelects(customSelect);

    const isOpen = customSelect.classList.toggle(OPEN_CLASS);
    trigger.setAttribute('aria-expanded', String(isOpen));
  });

  // Navegação por teclado
  trigger.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      e.stopPropagation();
      closeAllSelects(customSelect);

      const isOpen = customSelect.classList.toggle(OPEN_CLASS);
      trigger.setAttribute('aria-expanded', String(isOpen));

      if (isOpen) {
        const firstOpt = optionsContainer.querySelector(`.${OPTION_CLASS}`);
        if (firstOpt) firstOpt.focus();
      }
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!customSelect.classList.contains(OPEN_CLASS)) {
        customSelect.classList.add(OPEN_CLASS);
        trigger.setAttribute('aria-expanded', 'true');
      }
      const firstOpt = optionsContainer.querySelector(`.${OPTION_CLASS}`);
      if (firstOpt) firstOpt.focus();
    }
  });

  // Navegação entre opções via setas
  optionsContainer.addEventListener('keydown', function (e) {
    const opts = Array.from(optionsContainer.querySelectorAll(`.${OPTION_CLASS}`));
    const currentIndex = opts.indexOf(document.activeElement);

    if (e.key === 'ArrowDown' && currentIndex < opts.length - 1) {
      e.preventDefault();
      opts[currentIndex + 1].focus();
    }

    if (e.key === 'ArrowUp' && currentIndex > 0) {
      e.preventDefault();
      opts[currentIndex - 1].focus();
    }

    if (e.key === 'ArrowUp' && currentIndex === 0) {
      e.preventDefault();
      trigger.focus();
    }

    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (document.activeElement?.classList.contains(OPTION_CLASS)) {
        document.activeElement.click();
        trigger.focus();
      }
    }
  });
}

/**
 * Inicializa ou re-inicializa todos os <select> da página.
 * Seguro para chamar múltiplas vezes (idempotente).
 */
export function initEnhancedSelects() {
  bindGlobalListeners();

  const selects = document.querySelectorAll('select');
  selects.forEach(enhanceSelect);
}

/**
 * Destrói a instância enhanced de um select específico,
 * restaurando o elemento nativo.
 */
export function destroyEnhancedSelect(select) {
  if (!select || select.getAttribute(ENHANCED_ATTR) !== 'true') return;

  const wrapper = select.closest(`.${WRAPPER_CLASS}`);
  if (wrapper) {
    wrapper.parentNode.insertBefore(select, wrapper);
    wrapper.remove();
  }

  select.style.display = '';
  select.removeAttribute(ENHANCED_ATTR);
}