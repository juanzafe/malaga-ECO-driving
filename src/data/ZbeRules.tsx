export type Badge = 'CERO' | 'ECO' | 'C' | 'B' | 'SIN' | null;

export interface RuleResult {
  status: 'allowed' | 'warning' | 'prohibited' | 'neutral';
  messageKey: string;
  color: string;
  icon: string;
}

export const checkAccess = (
  badge: Badge,
  is2027: boolean,
  zone: 'ZONA1' | 'ZONA2',
  isResident: boolean
): RuleResult => {
  if (!badge) {
    return {
      status: 'neutral',
      messageKey: 'selectBadge',
      color: '#64748b',
      icon: '🔍',
    };
  }

  if (isResident) {
    return {
      status: 'allowed',
      messageKey: 'residentAccess',
      color: '#16a34a',
      icon: '🏠',
    };
  }

  if (badge === 'SIN' || badge === 'B') {
    return {
      status: 'prohibited',
      messageKey: 'noResidentForbidden',
      color: '#dc2626',
      icon: '⛔',
    };
  }

  if (badge === 'C') {
    if (is2027) {
      return {
        status: 'warning',
        messageKey: 'parkingRequiredAll',
        color: '#eab308',
        icon: '🅿️',
      };
    }
    if (zone === 'ZONA1') {
      return {
        status: 'warning',
        messageKey: 'parkingCenter',
        color: '#eab308',
        icon: '🅿️',
      };
    }
    return {
      status: 'allowed',
      messageKey: 'freeOuterRing',
      color: '#16a34a',
      icon: '✅',
    };
  }

  return {
    status: 'allowed',
    messageKey: 'freeAccess',
    color: '#16a34a',
    icon: '✅',
  };
};
