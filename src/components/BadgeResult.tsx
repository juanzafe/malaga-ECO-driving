import { useTranslation } from "react-i18next";

interface Props {
  badge: 'ECO' | 'CERO' | 'C' | 'B' | 'SIN' | null;
  isFuture: boolean;
  isResident: boolean;
  cityId: string;
}

export const BadgeResult = ({ badge, isFuture, isResident }: Props) => {
  const { t } = useTranslation();

  if (!badge) return null;

  const getInfo = () => {

    if (isResident) {
      return {
        title: t('resident'),
        desc: t('residentBadgeDesc'),
        gradient: "from-emerald-500 to-teal-500",
        icon: "🏠"
      };
    }

    switch (badge) {
      case 'CERO':
      case 'ECO':
        return {
          title: badge,
          desc: t('ecoBadgeDesc'),
          gradient: "from-green-400 to-emerald-500",
          icon: "🍀"
        };

      case 'C':
        return {
          title: badge,
          desc: isFuture 
            ? t('cBadgeFutureDesc')
            : t('cBadgeTodayDesc'),
          gradient: "from-blue-500 to-cyan-500",
          icon: "🅿️"
        };

      case 'B':
        return {
          title: badge,
          desc: isFuture 
            ? t('bBadgeFutureDesc')
            : t('bBadgeTodayDesc'),
          gradient: "from-red-500 to-orange-500",
          icon: "🚫"
        };

      case 'SIN':
      default:
        return {
          title: badge,
          desc: t('sinBadgeDesc'),
          gradient: "from-slate-600 to-slate-800",
          icon: "⛔"
        };
    }
  };

  const info = getInfo();

  return (
    <div className="relative mt-8">

      {/* Glow */}
      <div className={`absolute inset-0 bg-linear-to-r ${info.gradient}
                      blur-2xl opacity-20 rounded-3xl`} />

      {/* Card */}
      <div className="relative p-6 rounded-3xl
                      bg-slate-900/80
                      border border-white/20
                      shadow-2xl
                      backdrop-blur-xl
                      transition-all duration-500">

        <div className="flex items-center gap-4 mb-4">
          <div className={`w-14 h-14 rounded-2xl bg-linear-to-br ${info.gradient}
                          flex items-center justify-center text-2xl shadow-lg`}>
            {info.icon}
          </div>

          <div>
            <div className="text-3xl font-black text-white tracking-tight">
              {info.title}
            </div>
          </div>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed">
          {info.desc}
        </p>
      </div>
    </div>
  );
};
