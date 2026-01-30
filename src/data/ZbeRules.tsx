export type Badge = 'CERO' | 'ECO' | 'C' | 'B' | 'SIN' | null;

export const checkAccess = (badge: Badge, isAfterNov2026: boolean) => {
  if (!badge) return null;

  // REGLAS HASTA NOVIEMBRE 2026
  if (!isAfterNov2026) {
    if (badge === 'SIN') return {
      status: 'restricted',
      message: '🚫 Prohibido (salvo si estás empadronado en Málaga capital).'
    };
    return { status: 'allowed', message: '✅ Acceso libre para todas las etiquetas.' };
  }

  // REGLAS DESPUÉS DE NOVIEMBRE 2026 (Año 3 en adelante)
  if (badge === 'CERO' || badge === 'ECO' || badge === 'C') {
    return { status: 'allowed', message: '✅ Acceso permitido.' };
  }
  
  if (badge === 'B') {
    return { 
      status: 'restricted', 
      message: '⚠️ Solo empadronados. Si vienes de fuera de Málaga, ya no puedes acceder con etiqueta B.' 
    };
  }

  return { status: 'prohibited', message: '🚫 Acceso prohibido para vehículos sin etiqueta.' };
};