import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LanguageToggle } from './LanguageToggle';

interface HeaderProps {
  isFuture: boolean;
  isResident: boolean;
  setIsFuture: (value: boolean) => void;
  setIsResident: (value: boolean) => void;
  cityName: string;
}

export const Header = ({ isFuture, isResident, setIsFuture, setIsResident, cityName }: HeaderProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <header className="bg-linear-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-white/10 sticky top-0 z-1000 backdrop-blur-xl">
      <LanguageToggle variant="dark" />
      
      <div className="max-w-7xl mx-auto px-14 py-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div 
            onClick={() => navigate('/')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="text-4xl transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
              🚗
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-black bg-clip-text text-transparent bg-linear-to-r from-emerald-400 to-teal-400 group-hover:from-emerald-300 group-hover:to-teal-300 transition-all">
                {cityName}
              </h1>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                {t('subtitle')}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">

            <div className="flex items-center gap-2 bg-white/5 backdrop-blur-xl rounded-full px-3 py-1.5 border border-white/10">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                {isResident ? '🏠' : '🚗'}
              </span>
              <button
                onClick={() => setIsResident(!isResident)}
                className={`relative w-14 h-7 rounded-full transition-all duration-300 ${
                  isResident 
                    ? 'bg-linear-to-r from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/30' 
                    : 'bg-white/10'
                }`}
              >
                <div
                  className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-lg transition-transform duration-300 ${
                    isResident ? 'translate-x-7' : 'translate-x-0.5'
                  }`}
                />
              </button>
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                {t(isResident ? 'resident' : 'nonResident')}
              </span>
            </div>

            <div className="flex gap-1 bg-white/5 backdrop-blur-xl rounded-full p-1 border border-white/10">
              <button
                onClick={() => setIsFuture(false)}
                className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider transition-all duration-300 ${
                  !isFuture
                    ? 'bg-linear-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {t('year2026')}
              </button>
              <button
                onClick={() => setIsFuture(true)}
                className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider transition-all duration-300 ${
                  isFuture
                    ? 'bg-linear-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {t('year2027')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};