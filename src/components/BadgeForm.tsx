import { useTranslation } from "react-i18next";

interface Props {
  onFuelChange: (val: string) => void;
  onYearChange: (val: string) => void;
  onMonthChange: (val: string) => void;
  onCalculate: () => void;
}

export const BadgeForm = ({ onFuelChange, onYearChange, onMonthChange, onCalculate }: Props) => {
  const { t } = useTranslation();

  const monthKeys = [
    'january', 'february', 'march', 'april', 'may', 'june', 
    'july', 'august', 'september', 'october', 'november', 'december'
  ];
  
  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - 1980 + 1 }, 
    (_, i) => currentYear - i
  );

  return (
    <div className="space-y-5">
      {/* Fuel Type */}
      <div>
        <label className="block text-sm font-bold text-slate-300 mb-2">
          {t('fuelType')}
        </label>
        <select 
          onChange={(e) => onFuelChange(e.target.value)}
          className="w-full p-3.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl 
                   text-white placeholder-slate-400
                   focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 
                   outline-none transition-all hover:bg-white/15
                   appearance-none cursor-pointer"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 0.75rem center',
            backgroundSize: '1.5em 1.5em',
            paddingRight: '2.5rem'
          }}
        >
          <option value="" className="bg-slate-800 text-slate-300">{t('selectFuel')}</option>
          <option value="gasoline" className="bg-slate-800 text-white">⛽ {t('engineGasoline')}</option>
          <option value="diesel" className="bg-slate-800 text-white">🛢️ {t('engineDiesel')}</option>
          <option value="hybrid" className="bg-slate-800 text-white">⚡ {t('engineHybrid')}</option>
          <option value="electric" className="bg-slate-800 text-white">🔋 {t('engineElectric')}</option>
        </select>
      </div>

      {/* Year and Month Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold text-slate-300 mb-2">
            {t('registrationYear')}
          </label>
          <select 
            onChange={(e) => onYearChange(e.target.value)}
            className="w-full p-3.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl 
                     text-white placeholder-slate-400
                     focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 
                     outline-none transition-all hover:bg-white/15
                     appearance-none cursor-pointer"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 0.75rem center',
              backgroundSize: '1.5em 1.5em',
              paddingRight: '2.5rem'
            }}
          >
            <option value="" className="bg-slate-800 text-slate-300">{t('selectYear')}</option>
            {years.map(year => (
              <option key={year} value={year} className="bg-slate-800 text-white">{year}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-300 mb-2">
            {t('registrationMonth')}
          </label>
          <select 
            onChange={(e) => onMonthChange(e.target.value)}
            className="w-full p-3.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl 
                     text-white placeholder-slate-400
                     focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 
                     outline-none transition-all hover:bg-white/15
                     appearance-none cursor-pointer"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 0.75rem center',
              backgroundSize: '1.5em 1.5em',
              paddingRight: '2.5rem'
            }}
          >
            <option value="" className="bg-slate-800 text-slate-300">{t('selectMonth')}</option>
            {monthKeys.map((mKey, i) => (
              <option key={mKey} value={i + 1} className="bg-slate-800 text-white">
                {t(`months.${mKey}`)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Calculate Button */}
      <button 
        onClick={onCalculate}
        className="w-full bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 
                 text-white font-black py-4 rounded-xl shadow-lg shadow-emerald-500/30
                 transition-all active:scale-95 uppercase tracking-wider
                 hover:shadow-xl hover:shadow-emerald-500/40 transform hover:-translate-y-0.5"
      >
        ✨ {t('calculate')}
      </button>
    </div>
  );
};