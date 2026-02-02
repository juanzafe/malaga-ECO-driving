import { useTranslation } from 'react-i18next';

export const LanguageToggle = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'es' ? 'en' : 'es';
    i18n.changeLanguage(newLang);
    localStorage.setItem('lang', newLang);
  };

  return (
    <div className="fixed top-3 right-3 z-5000 md:top-6 md:right-6">
      <button
        onClick={toggleLanguage}
        className="flex items-center gap-2 bg-white/90 backdrop-blur-sm border border-slate-200 
                   px-3 py-1.5 rounded-full shadow-xl hover:shadow-2xl 
                   transition-all active:scale-90 select-none"
      >
        <span className="text-sm font-black text-slate-700">
          {i18n.language === 'es' ? 'EN' : 'ES'}
        </span>
      </button>
    </div>
  );
};