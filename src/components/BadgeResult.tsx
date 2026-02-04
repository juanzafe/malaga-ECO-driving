import { useTranslation } from "react-i18next";

interface Props {
  badge: 'ECO' | 'CERO' | 'C' | 'B' | 'SIN' | null;
  isFuture: boolean;
  isResident: boolean;
}

export const BadgeResult = ({ badge, isFuture, isResident }: Props) => {
  const { t } = useTranslation();

  if (!badge) return null;

  const getDetailMessage = () => {
    if (isResident) {
      return {
        title: `${t('badgeFinder')} ${badge}: ${t('resident')}`,
        desc: t('residentBadgeDesc'), 
        color: "border-emerald-200 bg-emerald-50 text-emerald-800",
        icon: "🏠"
      };
    }

    switch (badge) {
      case 'CERO':
      case 'ECO':
        return {
          title: `Etiqueta ${badge}: ${t('freeArea')}`,
          desc: t('ecoBadgeDesc'),
          color: "border-green-200 bg-green-50 text-green-800",
          icon: "🍀"
        };
      case 'C':
        return {
          title: `Etiqueta C: ${t('checkAddress')}`,
          desc: isFuture ? t('cBadgeFutureDesc') : t('cBadgeTodayDesc'),
          color: "border-blue-200 bg-blue-50 text-blue-800",
          icon: "🅿️"
        };
      case 'B':
        return {
          title: `Etiqueta B: ${isFuture ? t('streetForbidden') : t('nonResident')}`,
          desc: isFuture ? t('bBadgeFutureDesc') : t('bBadgeTodayDesc'),
          color: "border-red-200 bg-red-50 text-red-800",
          icon: "🚫"
        };
      case 'SIN':
        return {
          title: t('streetForbidden'),
          desc: t('sinBadgeDesc'),
          color: "border-red-200 bg-red-50 text-red-800",
          icon: "🚫"
        };
      default:
        return null;
    }
  };

  const info = getDetailMessage();
  if (!info) return null;

  return (
    <div className={`mt-6 p-5 rounded-2xl border-2 transition-all duration-500 animate-in fade-in slide-in-from-top-4 ${info.color}`}>
      <div className="flex items-center gap-3 mb-2">
        <span className="text-3xl">{info.icon}</span>
        <div className="text-2xl font-black tracking-tighter uppercase">{badge}</div>
      </div>
      
      <h4 className="font-bold text-sm mb-1">{info.title}</h4>
      <p className="text-xs leading-relaxed opacity-90 font-medium">
        {info.desc}
      </p>
    </div>
  );
};