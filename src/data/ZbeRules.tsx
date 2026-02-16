export type Badge = 'CERO' | 'ECO' | 'C' | 'B' | 'SIN' | null;

export interface RuleResult {
  message?: string;
  allowed: boolean; 
  status: 'allowed' | 'warning' | 'prohibited' | 'neutral';
  messageKey: string;
  color: string;
  icon: string;
}

export const checkAccess = (
  badge: Badge,
  isFuture: boolean,
  zone: 'ZONA1' | 'ZONA2' | 'OUTSIDE',
  isResident: boolean,
  cityId: string
): RuleResult => {
  if (!badge) {
    return { 
      allowed: false,
      status: 'neutral', 
      messageKey: 'selectBadge', 
      color: '#64748b', 
      icon: '🔍' 
    };
  }

  // Reglas especiales por ciudad
  if (cityId === 'madrid' && badge === 'SIN') {
    return { allowed: false, status: 'prohibited', messageKey: 'forbiddenEverywhere', color: '#dc2626', icon: '⛔' };
  }

  if (cityId === 'barcelona' && badge === 'SIN') {
    return { allowed: false, status: 'prohibited', messageKey: 'forbiddenEverywhere', color: '#dc2626', icon: '⛔' };
  }

  // Residentes y vehículos limpios siempre permitidos
  if (isResident || badge === 'CERO' || badge === 'ECO') {
    return { 
      allowed: true,
      status: 'allowed', 
      messageKey: 'freeAccess', 
      color: '#16a34a', 
      icon: '✅' 
    };
  }

  // Fuera de ZBE
  if (zone === 'OUTSIDE') {
    return { 
      allowed: true,
      status: 'allowed', 
      messageKey: 'outsideZbe', 
      color: '#16a34a', 
      icon: '🌍' 
    };
  }

  // Reglas para etiqueta C
  if (badge === 'C') {
    if (isFuture) {
      return { allowed: false, status: 'warning', messageKey: 'parkingRequiredAll', color: '#eab308', icon: '🅿️' };
    }
    if (zone === 'ZONA1') {
      return { allowed: false, status: 'warning', messageKey: 'parkingCenterOnly', color: '#eab308', icon: '🅿️' };
    }
    return { allowed: true, status: 'allowed', messageKey: 'freeAccess', color: '#16a34a', icon: '✅' };
  }

  // Reglas para etiqueta B
  if (badge === 'B') {
    if (isFuture) {
      return { allowed: false, status: 'prohibited', messageKey: 'forbiddenEverywhere', color: '#dc2626', icon: '⛔' };
    }
    if (zone === 'ZONA1') {
      return { allowed: false, status: 'prohibited', messageKey: 'forbiddenCenterB', color: '#dc2626', icon: '⛔' };
    }
    return { allowed: true, status: 'allowed', messageKey: 'freeAccess', color: '#16a34a', icon: '✅' };
  }

  // Por defecto: prohibido
  return { 
    allowed: false,
    status: 'prohibited', 
    messageKey: 'forbiddenEverywhere', 
    color: '#dc2626', 
    icon: '⛔' 
  };
};

export const getZoneFromCoords = (coords: [number, number], cityId: string): 'ZONA1' | 'ZONA2' | 'OUTSIDE' => {
  const [lat, lng] = coords;
  
  if (cityId === 'malaga') {
    const isInsideZ1 = lat > 36.719 && lat < 36.725 && lng > -4.426 && lng < -4.416;
    if (isInsideZ1) return 'ZONA1';
    const isInsideZ2 = lat > 36.715 && lat < 36.730 && lng > -4.430 && lng < -4.410;
    if (isInsideZ2) return 'ZONA2';
  }

  if (cityId === 'madrid') {
    const isInsideZ1 = lat > 40.405 && lat < 40.430 && lng > -3.715 && lng < -3.690;
    if (isInsideZ1) return 'ZONA1';
    const isInsideZ2 = lat > 40.380 && lat < 40.470 && lng > -3.750 && lng < -3.650;
    if (isInsideZ2) return 'ZONA2';
  }

  if (cityId === 'barcelona') {
    // Zona 1: Ciutat Vella y Eixample central
    const isInsideZ1 = lat > 41.387 && lat < 41.401 && lng > 2.164 && lng < 2.196;
    if (isInsideZ1) return 'ZONA1';
    // Zona 2: Rondas de Barcelona
    const isInsideZ2 = lat > 41.374 && lat < 41.425 && lng > 2.131 && lng < 2.221;
    if (isInsideZ2) return 'ZONA2';
  }
  
  return 'OUTSIDE';
};