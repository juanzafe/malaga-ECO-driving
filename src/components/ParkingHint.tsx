import { useTranslation } from 'react-i18next';

export const ParkingHint = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center gap-4 rounded-3xl border border-dashed border-white/20 bg-white/3 px-6 py-8 text-center">
      
      <div className="relative">
        <div className="text-5xl animate-bounce" style={{ animationDuration: '2s' }}>
          🅿️
        </div>
      </div>
      <div className="space-y-2">
        <p className="text-sm font-black text-white">
          {t('parkingHint.title')}
        </p>
        <p className="text-xs text-slate-400 leading-relaxed max-w-xs">
          {t('parkingHint.desc')}
        </p>
      </div>

      <div className="hidden lg:flex items-center gap-2 mt-1 text-emerald-400/60">
        <svg className="w-4 h-4 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
        <span className="text-[10px] font-bold uppercase tracking-widest">
          {t('checkAddress')}
        </span>
        <svg className="w-4 h-4 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
};