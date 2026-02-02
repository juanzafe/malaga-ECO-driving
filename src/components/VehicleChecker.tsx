import { useState } from 'react';
import { BadgeForm } from './BadgeForm';
import { BadgeResult } from './BadgeResult';
import { useTranslation } from 'react-i18next';

export type Badge = 'ECO' | 'CERO' | 'C' | 'B' | 'SIN' | null;

interface VehicleCheckerProps {
  isFuture: boolean;
  isResident: boolean;
  onLabelCalculated: (badge: Badge) => void;
}

export const VehicleChecker = ({
  isFuture,
  isResident,
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
    <div className="p-6 bg-white rounded-2xl shadow-xl max-w-md mx-auto border">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-800">
          {t('badgeFinder')}
        </h2>

        {badge && (
          <button
            onClick={() => {
              setBadge(null);
              onLabelCalculated(null);
            }}
            className="text-xs text-slate-400 underline hover:text-slate-600"
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

      <BadgeResult badge={badge} isFuture={isFuture} isResident={isResident} />
    </div>
  );
};
