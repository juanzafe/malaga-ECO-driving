import { useTranslation } from "react-i18next";

interface Props {
  badge: 'ECO' | 'CERO' | 'C' | 'B' | 'SIN' | null;
  isFuture: boolean;
  isResident: boolean;
}

export const BadgeResult = ({ badge, isFuture, isResident }: Props) => {
  useTranslation();
  if (!badge) return null;

  const getInfo = () => {
    if (isResident) return { 
      title: "Acceso Total Residente", 
      desc: "Como residente en Málaga, puedes circular por ambas zonas con cualquier etiqueta hasta 2027.",
      color: "bg-emerald-50 border-emerald-200 text-emerald-800",
      icon: "🏠" 
    };

    switch (badge) {
      case 'CERO':
      case 'ECO':
        return { 
          title: "Sin restricciones", 
          desc: "Puedes circular y aparcar libremente por todo el centro y el anillo exterior.",
          color: "bg-green-50 border-green-200 text-green-800",
          icon: "🍀"
        };
      case 'C':
        return { 
          title: isFuture ? "Solo Parking (2027)" : "Libre en Anillo, Parking en Centro", 
          desc: isFuture 
            ? "En 2027, tu etiqueta C solo podrá entrar a las ZBE si vas directo a un parking público." 
            : "Hoy: Puedes circular por el anillo exterior. Si entras al Centro Histórico (Zona 1), debes ir a un parking.",
          color: "bg-blue-50 border-blue-200 text-blue-800",
          icon: "🅿️"
        };
      case 'B':
        return { 
          title: isFuture ? "Acceso Prohibido (2027)" : "Prohibido en Centro", 
          desc: isFuture 
            ? "En 2027, los vehículos etiqueta B no podrán entrar en ninguna de las dos zonas ZBE." 
            : "Hoy: Puedes circular por el anillo exterior, pero tienes prohibido entrar al Centro Histórico.",
          color: "bg-red-50 border-red-200 text-red-800",
          icon: "🚫"
        };
      default:
        return { 
          title: "Acceso Prohibido", 
          desc: "Los vehículos sin etiqueta tienen prohibido el acceso a ambas zonas ZBE.",
          color: "bg-slate-100 border-slate-300 text-slate-700",
          icon: "⛔"
        };
    }
  };


  const info = getInfo();
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