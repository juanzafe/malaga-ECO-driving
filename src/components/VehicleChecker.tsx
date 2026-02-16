import { useState } from 'react'; 
import { BadgeForm } from './BadgeForm'; 
import { BadgeResult } from './BadgeResult'; 
import { useTranslation } from 'react-i18next'; 

export type Badge = 'ECO' | 'CERO' | 'C' | 'B' | 'SIN' | null; 
interface VehicleCheckerProps 
{ isFuture: boolean; isResident: boolean; cityId: string; onLabelCalculated: (badge: Badge) => void; }

export const VehicleChecker = ({
  isFuture,
  isResident,
  cityId,
  onLabelCalculated,
}: VehicleCheckerProps) => {
  const { t } = useTranslation();

  const [badge, setBadge] = useState<Badge>(null);
  const [fuel, setFuel] = useState('');
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');

  const calculateBadge = () => {
    const y = parseInt(year);
    const m = parseInt(month);

    if (!fuel || !year || !month) {
      alert(t('fillAllFields'));
      return;
    }

    let result: Badge = null;

    if (fuel === 'electric') result = 'CERO';
    else if (fuel === 'hybrid') result = 'ECO';
    else if (fuel === 'gasoline') {
      if (y > 2006 || (y === 2006 && m >= 1)) result = 'C';
      else if (y > 2001) result = 'B';
      else result = 'SIN';
    } else if (fuel === 'diesel') {
      if (y > 2015 || (y === 2015 && m >= 9)) result = 'C';
      else if (y > 2006) result = 'B';
      else result = 'SIN';
    }

    setBadge(result);
    onLabelCalculated(result);
  };

  return (
    <div className="relative max-w-lg mx-auto">

      <div className="absolute inset-0 bg-linear-to-r from-emerald-500/20 to-blue-500/20 blur-3xl opacity-40 rounded-3xl -z-10" />

      <div className="p-8 bg-white/5 backdrop-blur-xl rounded-3xl 
                      border border-white/10 shadow-2xl
                      hover:border-white/20 transition-all duration-500">

        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-black text-white tracking-tight">
            🚗 {t('badgeFinder')}
          </h2>

          {badge && (
            <button
              onClick={() => {
                setBadge(null);
                onLabelCalculated(null);
              }}
              className="text-xs text-slate-400 hover:text-white transition-colors underline"
            >
              {t('clear')}
            </button>
          )}
        </div>

        <BadgeForm
          onFuelChange={setFuel}
          onYearChange={setYear}
          onMonthChange={setMonth}
          onCalculate={calculateBadge}
        />

        <BadgeResult 
          badge={badge} 
          isFuture={isFuture} 
          isResident={isResident} 
          cityId={cityId}
        />
      </div>
    </div>
  );
};
