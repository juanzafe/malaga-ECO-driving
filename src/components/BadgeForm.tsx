import { useTranslation } from "react-i18next";

interface Props {
  onFuelChange: (val: string) => void;
  onYearChange: (val: string) => void;
  onMonthChange: (val: string) => void;
  onCalculate: () => void;
}

export const BadgeForm = ({ onFuelChange, onYearChange, onMonthChange, onCalculate }: Props) => {
  const { t } = useTranslation();

  // Array de claves para los meses (debes añadirlas a i18n.ts o usar una lista traducible)
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
      {/* Selector de Motor */}
      <div>
        <label className="block text-sm font-semibold text-gray-600 mb-1">
          {t('fuelType')}
        </label>
        <select 
          onChange={(e) => onFuelChange(e.target.value)}
          className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all"
        >
          <option value="">{t('selectFuel')}</option>
          <option value="gasoline">{t('engineGasoline')}</option>
          <option value="diesel">{t('engineDiesel')}</option>
          <option value="hybrid">{t('engineHybrid')}</option>
          <option value="electric">{t('engineElectric')}</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Selector de AÑO */}
        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-1">
            {t('registrationYear')}
          </label>
          <select 
            onChange={(e) => onYearChange(e.target.value)}
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
          >
            <option value="">{t('selectYear')}</option>
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        {/* Selector de MES */}
        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-1">
            {t('registrationMonth')}
          </label>
          <select 
            onChange={(e) => onMonthChange(e.target.value)}
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
          >
            <option value="">{t('selectMonth')}</option>
            {monthKeys.map((mKey, i) => (
              <option key={mKey} value={i + 1}>
                {t(`months.${mKey}`)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button 
        onClick={onCalculate}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl shadow-md shadow-green-200 transition-all active:scale-95 uppercase tracking-wide"
      >
        {t('calculate')}
      </button>
    </div>
  );
};