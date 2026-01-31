interface Props {
  badge: 'ECO' | 'CERO' | 'C' | 'B' | 'SIN' | null;
  isFuture: boolean;
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
            ? "🅿️ EN 2027: Podrás entrar al Centro Histórico SOLO SI vas a un parking público. En el Anillo Exterior podrás circular libremente sin restricciones."
            : "✅ HOY PUEDES CIRCULAR: Acceso libre en toda la ZBE sin necesidad de parking. Busca tu calle en el mapa para confirmar.",
          color: "border-blue-200 bg-blue-50 text-blue-800",
          icon: "🔵"
        };
      case 'B':
        return {
          title: isFuture ? "Etiqueta B: PROHIBIDO" : "Etiqueta B: PERMITIDO (por ahora)",
          desc: isFuture 
            ? "🚫 NO PUEDES ENTRAR: A partir de 2027, la etiqueta B está totalmente prohibida en toda la ZBE (Centro y Anillo). No podrás acceder ni siquiera a parkings públicos. Solo permitido para residentes empadronados en Málaga capital. Multa: 200€."
            : "✅ HOY SÍ PUEDES CIRCULAR: Tienes acceso libre en toda la ZBE, sin necesidad de ir a parkings. PERO ATENCIÓN: A partir de 2027 quedarás totalmente prohibido, ni siquiera para ir a parkings. Usa el interruptor de arriba para ver cómo te afectará.",
          color: isFuture ? "border-red-200 bg-red-50 text-red-800" : "border-orange-200 bg-orange-50 text-orange-800",
          icon: isFuture ? "🚫" : "⚠️"
        };
      case 'SIN':
        return {
          title: "Sin Etiqueta: PROHIBIDO",
          desc: "⛔ NO PUEDES ENTRAR: Las cámaras están activas. Prohibido tanto en Centro como en Anillo Exterior, ni siquiera para ir a parkings. Solo permitido para residentes empadronados en Málaga capital. Multa automática: 200€.",
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
    </div>
  );
};