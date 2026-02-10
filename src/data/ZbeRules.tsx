export type Badge = 'CERO' | 'ECO' | 'C' | 'B' | 'SIN' | null;

export interface RuleResult {
  message: string;
  allowed: any;
  status: 'allowed' | 'warning' | 'prohibited' | 'neutral';
  messageKey: string;
  color: string;
  icon: string;
}

export const checkAccess = (
  badge: Badge,
  isFuture: boolean,
  zone: 'ZONA1' | 'ZONA2' | 'OUTSIDE',
  isResident: boolean
): RuleResult => {
  if (!badge) {
    return { 
      status: 'neutral', 
      messageKey: 'selectBadge', 
      color: '#64748b', 
      icon: '🔍' 
    };
  }

  if (isResident || badge === 'CERO' || badge === 'ECO') {
    return { 
      status: 'allowed', 
      messageKey: 'freeAccess', 
      color: '#16a34a', 
      icon: '✅' 
    };
  }

  if (zone === 'OUTSIDE') {
    return { 
      status: 'allowed', 
      messageKey: 'outsideZbe', 
      color: '#16a34a', 
      icon: '🌍' 
    };
  }

  if (badge === 'C') {
    if (isFuture) {
      return { status: 'warning', messageKey: 'parkingRequiredAll', color: '#eab308', icon: '🅿️' };
    }
    if (zone === 'ZONA1') {
      return { status: 'warning', messageKey: 'parkingCenterOnly', color: '#eab308', icon: '🅿️' };
    }
    return { status: 'allowed', messageKey: 'freeAccess', color: '#16a34a', icon: '✅' };
  }

  if (badge === 'B') {
    if (isFuture) {
      return { status: 'prohibited', messageKey: 'forbiddenEverywhere', color: '#dc2626', icon: '⛔' };
    }
    if (zone === 'ZONA1') {
      return { status: 'prohibited', messageKey: 'forbiddenCenterB', color: '#dc2626', icon: '⛔' };
    }
    return { status: 'allowed', messageKey: 'freeAccess', color: '#16a34a', icon: '✅' };
  }

  return { 
    status: 'prohibited', 
    messageKey: 'forbiddenEverywhere', 
    color: '#dc2626', 
    icon: '⛔' 
  };
};

export const getZoneFromCoords = (coords: [number, number]): 'ZONA1' | 'ZONA2' | 'OUTSIDE' => {
  const [lat, lng] = coords;
  
  const isInsideZ1 = lat > 36.719 && lat < 36.725 && lng > -4.426 && lng < -4.416;
  if (isInsideZ1) return 'ZONA1';
  
  const isInsideZ2 = lat > 36.715 && lat < 36.730 && lng > -4.430 && lng < -4.410;
  if (isInsideZ2) return 'ZONA2';
  
  return 'OUTSIDE';
};