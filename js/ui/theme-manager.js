const THEME_KEY = 'descomplica_theme';
const THEME_LIGHT = 'light';
const THEME_DARK = 'dark';

export function initTheme() {
  // Recupera o tema atual ou do SO
  const savedTheme = localStorage.getItem(THEME_KEY);
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;

  const currentTheme = savedTheme || (prefersLight ? THEME_LIGHT : THEME_DARK);
  applyTheme(currentTheme);

  const toggleBtn = document.getElementById('theme-toggle');
  if (!toggleBtn) return;
  if (toggleBtn.dataset.themeBound === 'true') return;
  toggleBtn.dataset.themeBound = 'true';

  // Evento de clique para alternar
  toggleBtn.addEventListener('click', () => {
    const isLight = document.documentElement.getAttribute('data-theme') === THEME_LIGHT;
    const newTheme = isLight ? THEME_DARK : THEME_LIGHT;
    applyTheme(newTheme);
  });
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_KEY, theme);
  updateToggleIcon(theme);
}

function updateToggleIcon(theme) {
  const toggleBtn = document.getElementById('theme-toggle');
  if (!toggleBtn) return;

  // Alterna entre Sol e Lua renderizados via SVG limpo
  if (theme === THEME_LIGHT) {
    toggleBtn.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
      </svg>
    `;
    toggleBtn.setAttribute('aria-label', 'Mudar para tema escuro');
  } else {
    toggleBtn.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
      </svg>
    `;
    toggleBtn.setAttribute('aria-label', 'Mudar para tema claro');
  }
}