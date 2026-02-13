
import { LanguageToggle } from "./LanguageToggle";
import { useTranslation } from 'react-i18next';


interface HeaderProps {
    isFuture: boolean;
    isResident: boolean;
    setIsFuture: (value: boolean) => void;
    setIsResident: (value: boolean) => void;
    cityName:string;
}
export const Header = ({ isFuture, isResident, setIsFuture, setIsResident, cityName }: HeaderProps) => {

 const { t } = useTranslation();
  return (
    <>
          <LanguageToggle />
    
          <nav className="sticky top-0 z-50 bg-emerald-600 shadow-md">
  <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col text-white">
    <h1 className="text-xl font-black uppercase tracking-tight">
      <span>🌿</span>
      ZBE {cityName}
    </h1>

    <p className="text-xs text-emerald-100 mt-1 font-medium">
      {t('appTagline')}
    </p>
  </div>
</nav>
    
          <div className="sticky top-17 z-40 bg-white/80 backdrop-blur border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center gap-2">
              <button
                onClick={() => setIsResident(!isResident)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                  isResident ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                }`}
              >
                🏠 {isResident ? t('resident') : t('nonResident')}
              </button>
              <div className="flex bg-slate-200 rounded-full p-1">
                <button onClick={() => setIsFuture(false)} className={`px-4 py-1 rounded-full text-xs font-bold ${!isFuture ? 'bg-white shadow' : ''}`}>2026</button>
                <button onClick={() => setIsFuture(true)} className={`px-4 py-1 rounded-full text-xs font-bold ${isFuture ? 'bg-white shadow' : ''}`}>2027</button>
              </div>
            </div>
          </div>
    </>
  )
}
