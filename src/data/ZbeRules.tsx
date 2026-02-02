export type Badge = 'CERO' | 'ECO' | 'C' | 'B' | 'SIN' | null;

export interface RuleResult {
  status: 'allowed' | 'warning' | 'prohibited' | 'neutral';
  message: string;
  color: string;
  icon: string;
}

export const checkAccess = (
  badge: Badge, 
  is2027: boolean, 
  zone: 'ZONA1' | 'ZONA2',
  isResident: boolean
): RuleResult => {
  if (!badge) return { status: 'neutral', message: 'Selecciona tu etiqueta', color: '#64748b', icon: '🔍' };

  // 1. RESIDENTES: Tienen moratoria/permiso especial en Málaga
  if (isResident) {
    return { 
      status: 'allowed', 
      message: '✅ Acceso permitido por ser Residente.', 
      color: '#16a34a', 
      icon: '🏠' 
    };
  }

  // 2. NO RESIDENTES (Visitantes)
  if (badge === 'SIN' || badge === 'B') {
    return { 
      status: 'prohibited', 
      message: '🚫 Acceso prohibido para no residentes.', 
      color: '#dc2626', 
      icon: '⛔' 
    };
  }

  if (badge === 'C') {
    if (is2027) {
      return { status: 'warning', message: '🅿️ Parking obligatorio en toda la ZBE.', color: '#eab308', icon: '🅿️' };
    }
    if (zone === 'ZONA1') {
      return { status: 'warning', message: '🅿️ Centro: Solo Parking Público.', color: '#eab308', icon: '🅿️' };
    }
    return { status: 'allowed', message: '✅ Acceso libre (Anillo Exterior).', color: '#16a34a', icon: '✅' };
  }

  // ECO Y CERO
  return { status: 'allowed', message: '✅ Acceso libre.', color: '#16a34a', icon: '✅' };
};