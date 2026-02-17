import { useTranslation } from "react-i18next";

interface Props {
  badge: 'ECO' | 'CERO' | 'C' | 'B' | 'SIN' | null;
  isFuture: boolean;
  isResident: boolean;
  cityId: string;
}

type ZoneStatus = 'allowed' | 'parking' | 'forbidden';

interface ZoneInfo {
  status: ZoneStatus;
  label: string;
}

interface BadgeInfo {
  title: string;
  gradient: string;
  icon: string;
  summary: string;
  zones: ZoneInfo[];
}

const statusStyles: Record<ZoneStatus, { bg: string; border: string; text: string; icon: string }> = {
  allowed:   { bg: 'bg-emerald-500/15', border: 'border-emerald-500/40', text: 'text-emerald-400', icon: '✅' },
  parking:   { bg: 'bg-yellow-500/15',  border: 'border-yellow-500/40',  text: 'text-yellow-400',  icon: '🅿️' },
  forbidden: { bg: 'bg-red-500/15',     border: 'border-red-500/40',     text: 'text-red-400',     icon: '⛔' },
};

export const BadgeResult = ({ badge, isFuture, isResident, cityId }: Props) => {
  const { t } = useTranslation();

  if (!badge) return null;

  const getInfo = (): BadgeInfo => {

    if (isResident) {
      return {
        title: t('resident'),
        gradient: 'from-emerald-500 to-teal-500',
        icon: '🏠',
        summary: t('residentBadgeDesc'),
        zones: [
          { status: 'allowed', label: t('badgeResult.zone1') },
          { status: 'allowed', label: t('badgeResult.zone2') },
        ],
      };
    }

    if (badge === 'CERO' || badge === 'ECO') {
      return {
        title: badge,
        gradient: 'from-green-400 to-emerald-500',
        icon: '🍃',
        summary: t('ecoBadgeDesc'),
        zones: [
          { status: 'allowed', label: t('badgeResult.zone1') },
          { status: 'allowed', label: t('badgeResult.zone2') },
        ],
      };
    }

    if (badge === 'C') {
      if (isFuture) {
        return {
          title: 'C',
          gradient: 'from-yellow-400 to-orange-400',
          icon: '🅿️',
          summary: t('cBadgeFutureDesc'),
          zones: [
            { status: 'parking',  label: t('badgeResult.zone1') },
            { status: 'parking',  label: t('badgeResult.zone2') },
          ],
        };
      }
      return {
        title: 'C',
        gradient: 'from-blue-500 to-cyan-500',
        icon: '🅿️',
        summary: t('cBadgeTodayDesc'),
        zones: [
          { status: 'parking',  label: t('badgeResult.zone1') },
          { status: 'allowed',  label: t('badgeResult.zone2') },
        ],
      };
    }

    if (badge === 'B') {
      if (isFuture) {
        return {
          title: 'B',
          gradient: 'from-red-500 to-orange-500',
          icon: '⛔',
          summary: t('bBadgeFutureDesc'),
          zones: [
            { status: 'forbidden', label: t('badgeResult.zone1') },
            { status: 'forbidden', label: t('badgeResult.zone2') },
          ],
        };
      }
      return {
        title: 'B',
        gradient: 'from-red-500 to-orange-500',
        icon: '🚫',
        summary: t('bBadgeTodayDesc'),
        zones: [
          { status: 'forbidden', label: t('badgeResult.zone1') },
          { status: 'allowed',   label: t('badgeResult.zone2') },
        ],
      };
    }

    return {
      title: cityId === 'madrid' || cityId === 'barcelona' ? 'SIN' : 'SIN',
      gradient: 'from-slate-600 to-slate-800',
      icon: '⛔',
      summary: t('sinBadgeDesc'),
      zones: [
        { status: 'forbidden', label: t('badgeResult.zone1') },
        { status: 'forbidden', label: t('badgeResult.zone2') },
      ],
    };
  };

  const info = getInfo();

  return (
    <div className="relative mt-8">

      <div className={`absolute inset-0 bg-linear-to-r ${info.gradient} blur-2xl opacity-15 rounded-3xl pointer-events-none`} />

      <div className="relative p-6 rounded-3xl bg-slate-900/80 border border-white/10 shadow-2xl backdrop-blur-xl">

        <div className="flex items-center gap-4 mb-5">
          <div className={`w-14 h-14 rounded-2xl bg-linear-to-br ${info.gradient}
                          flex items-center justify-center text-2xl shadow-lg shrink-0`}>
            {info.icon}
          </div>
          <div>
            <div className="text-3xl font-black text-white tracking-tight leading-none">
              {info.title}
            </div>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              {info.summary}
            </p>
          </div>
        </div>

        <div className="h-px bg-white/10 mb-4" />

        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">
          {t('badgeResult.accessByZone')}
        </p>

        <div className="grid grid-cols-2 gap-3">
          {info.zones.map((zone, i) => {
            const style = statusStyles[zone.status];
            return (
              <div
                key={i}
                className={`flex flex-col gap-1.5 rounded-2xl p-3 border ${style.bg} ${style.border}`}
              >
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                  {zone.label}
                </span>
                <div className={`flex items-center gap-1.5 ${style.text}`}>
                  <span className="text-base leading-none">{style.icon}</span>
                  <span className="text-xs font-bold">
                    {zone.status === 'allowed'   && t('badgeResult.statusAllowed')}
                    {zone.status === 'parking'   && t('badgeResult.statusParking')}
                    {zone.status === 'forbidden' && t('badgeResult.statusForbidden')}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};