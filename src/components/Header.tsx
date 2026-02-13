import { LanguageToggle } from "./LanguageToggle";
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
    isFuture: boolean;
    isResident: boolean;
    setIsFuture: (value: boolean) => void;
    setIsResident: (value: boolean) => void;
    cityName: string;
}

export const Header = ({ isFuture, isResident, setIsFuture, setIsResident, cityName }: HeaderProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <>
      <LanguageToggle />
    
      {/* Main Header - Dark theme */}
      <nav className="sticky top-0 z-50 bg-linear-to-r from-slate-900 via-slate-800 to-slate-900 shadow-2xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <button 
                onClick={() => navigate('/')}
                className="group flex items-center gap-3 hover:opacity-80 transition-opacity"
              >
                <div className="text-3xl transform group-hover:scale-110 transition-transform">
                  🌿
                </div>
                <div>
                  <h1 className="text-2xl font-black text-transparent bg-clip-text bg-linear-to-r from-emerald-400 to-teal-400 tracking-tight">
                    ZBE {cityName}
                  </h1>
                  <p className="text-xs text-slate-400 font-medium tracking-wide">
                    {t('appTagline')}
                  </p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </nav>
    
      {/* Controls Bar - Glass morphism */}
      <div className="sticky top-22 z-40 bg-slate-800/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center gap-4">
            
            {/* Resident Toggle */}
            <button
              onClick={() => setIsResident(!isResident)}
              className={`group px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300
                        flex items-center gap-2 shadow-lg
                        ${isResident 
                          ? 'bg-linear-to-r from-emerald-500 to-teal-500 text-white shadow-emerald-500/30 scale-105' 
                          : 'bg-white/10 text-slate-300 hover:bg-white/20'
                        }`}
            >
              <span className="text-lg">{isResident ? '🏠' : '👤'}</span>
              <span>{isResident ? t('resident') : t('nonResident')}</span>
            </button>

            {/* Year Toggle */}
            <div className="flex bg-white/10 backdrop-blur-md rounded-full p-1 border border-white/20 shadow-lg">
              <button 
                onClick={() => setIsFuture(false)} 
                className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-300
                          ${!isFuture 
                            ? 'bg-linear-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30' 
                            : 'text-slate-300 hover:text-white'
                          }`}
              >
                2026
              </button>
              <button 
                onClick={() => setIsFuture(true)} 
                className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-300
                          ${isFuture 
                            ? 'bg-linear-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30' 
                            : 'text-slate-300 hover:text-white'
                          }`}
              >
                2027
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};