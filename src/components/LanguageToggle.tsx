import { useTranslation } from 'react-i18next';

interface Props {
  variant?: 'light' | 'dark';
}

export const LanguageToggle = ({ variant = 'light' }: Props) => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'es' ? 'en' : 'es';
    i18n.changeLanguage(newLang);
    localStorage.setItem('lang', newLang);
  };

  // Estilos según variante
  const isDark = variant === 'dark';
  
  const buttonClasses = isDark
    ? `flex items-center gap-2 bg-white/10 backdrop-blur-xl border border-white/20 
       px-3 py-1.5 rounded-full shadow-lg hover:bg-white/20 hover:shadow-emerald-500/30
       transition-all active:scale-90 select-none`
    : `flex items-center gap-2 bg-white/90 backdrop-blur-sm border border-slate-200 
       px-3 py-1.5 rounded-full shadow-xl hover:shadow-2xl 
       transition-all active:scale-90 select-none`;
  
  const textClasses = isDark
    ? 'text-sm font-black text-white'
    : 'text-sm font-black text-slate-700';

  return (
    <div className="fixed top-3 right-3 z-5000 md:top-6 md:right-6">
      <button
        onClick={toggleLanguage}
        className={buttonClasses}
        aria-label={`Switch to ${i18n.language === 'es' ? 'English' : 'Spanish'}`}
      >
        <span className={textClasses}>
          {i18n.language === 'es' ? '🇬🇧 EN' : '🇪🇸 ES'}
        </span>
      </button>
    </div>
  );
};