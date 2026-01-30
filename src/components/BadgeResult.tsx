interface Props {
  badge: 'ECO' | 'CERO' | 'C' | 'B' | 'SIN' | null;
  isFuture: boolean; // Añadimos esto para sincronizar con el mapa
}

export const BadgeResult = ({ badge, isFuture }: Props) => {
  if (!badge) return null;

  // Lógica de mensajes detallados según etiqueta y tiempo
  const getDetailMessage = () => {
    switch (badge) {
      case 'CERO':
      case 'ECO':
        return {
          title: `Etiqueta ${badge}: Libertad Total`,
          desc: "Puedes circular y aparcar en cualquier zona de Málaga (Centro y Anillo) sin restricciones, tanto ahora como en el futuro.",
          color: "border-green-200 bg-green-50 text-green-800",
          icon: "🍀"
        };
      case 'C':
        return {
          title: `Etiqueta C: Acceso con Condiciones`,
          desc: isFuture 
            ? "⚠️ En el futuro (2027), podrías verte obligado a usar parking público para entrar al Centro Histórico. Consulta el buscador del mapa."
            : "✅ Actualmente puedes circular libremente. En el mapa verás tu zona en verde o amarillo (parking).",
          color: "border-blue-200 bg-blue-50 text-blue-800",
          icon: "🔵"
        };
      case 'B':
  return {
    title: "Etiqueta B: Riesgo de sanción",
    desc: isFuture 
      ? "🚫 ACCESO PROHIBIDO: En 2027, tener etiqueta B será como no tener nada. Solo los que vivan en el centro (Residentes) podrán pasar. Si entras, te llegará la multa de 200€ a casa."
      : "⚠️ CUIDADO: Ahora puedes pasar, pero el mapa ya te marca zonas en naranja. Eso significa que en pocos meses esas calles serán exclusivas para vecinos y tú no podrás ni cruzar por ellas.",
    color: "border-orange-200 bg-orange-50 text-orange-800",
    icon: "🟡"
  };

case 'SIN':
  return {
    title: "Sin Etiqueta: Prohibido y Vigilado",
    desc: "⛔ MULTA AUTOMÁTICA: Las cámaras ya están activas. No puedes entrar ni al Centro ni al anillo exterior (Huelin, La Victoria, Perchel). La sanción es de 200€ por cada entrada detectada.",
    color: "border-red-200 bg-red-50 text-red-800",
    icon: "⛔"
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
      <p className="text-xs leading-relaxed opacity-90">
        {info.desc}
      </p>

      <div className="mt-4 pt-3 border-t border-black/5 flex flex-col gap-2">
        <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Sincronización con el mapa:</p>
        <div className="flex gap-2">
            <div className="flex items-center gap-1 text-[10px] font-bold">
                <span className="w-2 h-2 rounded-full bg-green-500"></span> Libre
            </div>
            <div className="flex items-center gap-1 text-[10px] font-bold">
                <span className="w-2 h-2 rounded-full bg-yellow-500"></span> Parking
            </div>
            <div className="flex items-center gap-1 text-[10px] font-bold">
                <span className="w-2 h-2 rounded-full bg-orange-500"></span> Residentes
            </div>
            <div className="flex items-center gap-1 text-[10px] font-bold">
                <span className="w-2 h-2 rounded-full bg-red-500"></span> Multa
            </div>
        </div>
      </div>
    </div>
  );
};