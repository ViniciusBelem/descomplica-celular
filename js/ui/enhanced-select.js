/**
 * Transforma <select> nativos em caixas de seleção interativas e bonitas.
 */
export function initEnhancedSelects() {
  const selects = document.querySelectorAll('select');
  
  selects.forEach(select => {
    // Evita inicializar duas vezes no mesmo elemento
    if (select.dataset.enhanced === 'true') {
      const existingWrapper = select.closest('.custom-select-wrapper');
      if (existingWrapper) {
        existingWrapper.parentNode.insertBefore(select, existingWrapper);
        existingWrapper.remove();
      }
    }
    select.dataset.enhanced = 'true';

    const wrapper = document.createElement('div');
    wrapper.className = 'custom-select-wrapper';

    const customSelect = document.createElement('div');
    customSelect.className = 'custom-select';

    const trigger = document.createElement('div');
    trigger.className = 'custom-select-trigger';
    
    const selectedText = select.options[select.selectedIndex]?.text || 'Selecione...';
    trigger.innerHTML = `<span>${selectedText}</span><div class="arrow"></div>`;

    const options = document.createElement('div');
    options.className = 'custom-options';

    Array.from(select.options).forEach(opt => {
      if (!opt.value && opt.disabled) return; // Ignora placeholders

      const customOpt = document.createElement('span');
      customOpt.className = 'custom-option';
      if (opt.selected) customOpt.classList.add('selected');
      customOpt.textContent = opt.text;
      customOpt.dataset.value = opt.value;

      customOpt.addEventListener('click', function(e) {
        e.stopPropagation();
        trigger.querySelector('span').textContent = this.textContent;
        select.value = this.dataset.value;
        
        options.querySelectorAll('.custom-option').forEach(o => o.classList.remove('selected'));
        this.classList.add('selected');
        customSelect.classList.remove('open');

        // Dispara o evento de "change" para o controller identificar a mudança
        select.dispatchEvent(new Event('change', { bubbles: true }));
      });

      options.appendChild(customOpt);
    });

    customSelect.appendChild(trigger);
    customSelect.appendChild(options);
    wrapper.appendChild(customSelect);

    // Esconde o select nativo e insere o customizado
    select.parentNode.insertBefore(wrapper, select);
    wrapper.appendChild(select);
    select.style.display = 'none';

    trigger.addEventListener('click', function(e) {
      e.stopPropagation();
      // Fecha outros selects abertos
      document.querySelectorAll('.custom-select').forEach(cs => {
        if (cs !== customSelect) cs.classList.remove('open');
      });
      customSelect.classList.toggle('open');
    });
  });

  // Fecha o dropdown ao clicar fora dele
  document.addEventListener('click', function() {
    document.querySelectorAll('.custom-select').forEach(cs => cs.classList.remove('open'));
  });
}