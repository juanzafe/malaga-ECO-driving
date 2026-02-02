interface Props {
  badge: 'ECO' | 'CERO' | 'C' | 'B' | 'SIN' | null;
  isFuture: boolean;
  isResident: boolean;
}

export const BadgeResult = ({ badge, isFuture, isResident }: Props) => {
  if (!badge) return null;

  const getDetailMessage = () => {
    // REGLA DE ORO: Si es Residente, siempre puede pasar por ahora
    if (isResident) {
      return {
        title: `Etiqueta ${badge}: Acceso Residente`,
        desc: "✅ Al estar empadronado en Málaga, tienes permiso para circular por toda la ZBE (Centro y Anillo) sin restricciones, independientemente de tu etiqueta. Las cámaras reconocerán tu matrícula.",
        color: "border-emerald-200 bg-emerald-50 text-emerald-800",
        icon: "🏠"
      };
    }

    // REGLA PARA NO RESIDENTES (Visitantes/Fuera de Málaga)
    switch (badge) {
      case 'CERO':
      case 'ECO':
        return {
          title: `Etiqueta ${badge}: Libertad Total`,
          desc: "Puedes circular y aparcar en cualquier zona de Málaga sin restricciones ni necesidad de parking público.",
          color: "border-green-200 bg-green-50 text-green-800",
          icon: "🍀"
        };
      case 'C':
        return {
          title: `Etiqueta C: Acceso con Condiciones`,
          desc: isFuture 
            ? "🅿️ EN 2027: Solo podrás entrar a la ZBE (Centro y Anillo) SI vas directamente a un parking público oficial."
            : "✅ HOY: Tienes acceso libre al Anillo Exterior, pero para entrar al Centro Histórico (Zona 1) es obligatorio aparcar en parking público.",
          color: "border-blue-200 bg-blue-50 text-blue-800",
          icon: "🅿️"
        };
     case 'B':
  return {
    title: isResident ? "Etiqueta B: Acceso Residente" : (isFuture ? "Etiqueta B: PROHIBIDO" : "Etiqueta B: ACCESO RESTRINGIDO"),
    desc: isResident 
      ? "✅ Como residente de Málaga capital, puedes seguir circulando con tu etiqueta B en 2027 gracias a la moratoria para empadronados." 
      : (isFuture 
          ? "🚫 PROHIBIDO: En 2027 los vehículos B de no residentes no pueden entrar a ninguna zona de la ZBE." 
          : "🚫 ACCESO RESTRINGIDO: Si no eres residente, ya no puedes circular por la ZBE con etiqueta B."),
    color: isResident ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-red-200 bg-red-50 text-red-800",
    icon: isResident ? "🏠" : "🚫"
  };
      case 'SIN':
        return {
          title: "Sin Etiqueta: PROHIBIDO",
          desc: "🚫 ACCESO DENEGADO: Los vehículos sin etiqueta de no residentes tienen prohibida la entrada y circulación por toda la ZBE (Centro y Anillo). Multa: 200€.",
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