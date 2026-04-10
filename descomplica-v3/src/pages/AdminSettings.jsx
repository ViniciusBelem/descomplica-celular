import { useTranslation } from 'react-i18next';
import { useThemeStore } from '../store/useThemeStore';
import { Moon, Sun, Palette, Globe, Check } from 'lucide-react';

export function AdminSettings() {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme, palette, setPalette } = useThemeStore();

  const palettes = [
    { id: 'default', name: 'Default', colors: 'bg-primary' },
    { id: 'ocean', name: 'Midnight Ocean', colors: 'bg-blue-600' },
    { id: 'forest', name: 'Forest Harmony', colors: 'bg-emerald-600' },
  ];

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-text">{t('admin.settings', 'Configurações')}</h1>
        <p className="text-text-muted mt-1">{t('admin.settingsDesc', 'Personalize sua experiência administrativa.')}</p>
      </div>

      <div className="space-y-6">
        {/* Aparência */}
        <section className="glass-panel p-6 rounded-2xl border-primary/10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Palette size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-text">{t('settings.appearance', 'Aparência')}</h2>
              <p className="text-sm text-text-muted">{t('settings.appearanceDesc', 'Altere o tema e paleta de cores.')}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Modo de Cor */}
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-text-muted mb-4">
                {t('settings.colorMode', 'Modo de Cor')}
              </label>
              <div className="flex p-1 bg-surface-container rounded-xl w-fit">
                <button 
                  onClick={toggleTheme}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${theme === 'light' ? 'bg-background text-primary shadow-sm' : 'text-text-muted hover:text-text'}`}
                >
                  <Sun size={16} /> {t('settings.light', 'Claro')}
                </button>
                <button 
                  onClick={toggleTheme}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${theme === 'dark' ? 'bg-background text-primary shadow-sm' : 'text-text-muted hover:text-text'}`}
                >
                  <Moon size={16} /> {t('settings.dark', 'Escuro')}
                </button>
              </div>
            </div>

            {/* Paletas Personalizadas */}
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-text-muted mb-4">
                {t('settings.palettes', 'Paletas de Cores')}
              </label>
              <div className="flex flex-wrap gap-3">
                {palettes.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setPalette(p.id)}
                    className={`group relative flex items-center gap-3 px-4 py-2 rounded-xl border-2 transition-all ${palette === p.id ? 'border-primary bg-primary/5' : 'border-transparent bg-surface-container hover:border-primary/30'}`}
                  >
                    <div className={`w-4 h-4 rounded-full ${p.colors} shadow-sm`} />
                    <span className={`text-sm font-bold ${palette === p.id ? 'text-primary' : 'text-text-muted group-hover:text-text'}`}>
                      {p.name}
                    </span>
                    {palette === p.id && <Check size={14} className="text-primary" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Idioma */}
        <section className="glass-panel p-6 rounded-2xl border-primary/10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
              <Globe size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-text">{t('settings.language', 'Idioma')}</h2>
              <p className="text-sm text-text-muted">{t('settings.languageDesc', 'Escolha o idioma global da interface.')}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            {['pt', 'en'].map((lang) => (
              <button
                key={lang}
                onClick={() => i18n.changeLanguage(lang)}
                className={`px-6 py-3 rounded-xl border-2 font-black uppercase tracking-widest transition-all ${i18n.language.startsWith(lang) ? 'border-accent bg-accent/5 text-accent' : 'border-transparent bg-surface-container text-text-muted hover:border-accent/30 hover:text-text'}`}
              >
                {lang === 'pt' ? 'Português (BR)' : 'English (US)'}
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
