import { describe, it, expect } from 'vitest';
import { checkAccess, getZoneFromCoords } from './data/ZbeRules';

describe('Lógica de Acceso ZBE Málaga', () => {

  describe('checkAccess()', () => {
    
    it('debe permitir acceso libre a etiquetas CERO y ECO independientemente de la zona', () => {
      const result = checkAccess('CERO', false, 'ZONA1', false, 'malaga');
      expect(result.allowed).toBe(true);
      expect(result.status).toBe('allowed');
      expect(result.icon).toBe('✅');
    });

    it('debe denegar acceso si no se selecciona ninguna etiqueta', () => {
      const result = checkAccess(null, false, 'ZONA1', false, 'malaga');
      expect(result.allowed).toBe(false);
      expect(result.messageKey).toBe('selectBadge');
    });

    it('un residente siempre debe tener permitido el acceso', () => {
      const result = checkAccess('SIN', false, 'ZONA1', true, 'malaga');
      expect(result.allowed).toBe(true);
    });

    it('etiqueta B en ZONA1 (Centro) debe estar prohibido', () => {
      const result = checkAccess('B', false, 'ZONA1', false, 'malaga');
      expect(result.allowed).toBe(false);
      expect(result.status).toBe('prohibited');
      expect(result.messageKey).toBe('forbiddenCenterB');
    });

    it('etiqueta C en el futuro debe requerir parking obligatoriamente', () => {
      const result = checkAccess('C', true, 'ZONA2', false, 'malaga');
      expect(result.allowed).toBe(false);
      expect(result.status).toBe('warning');
      expect(result.messageKey).toBe('parkingRequiredAll');
    });

  });

  describe('getZoneFromCoords()', () => {

    it('debe identificar coordenadas dentro de la ZONA1', () => {
      const zone = getZoneFromCoords([36.720, -4.420], 'malaga');
      expect(zone).toBe('ZONA1');
    });

    it('debe devolver OUTSIDE si las coordenadas están lejos', () => {
      const zone = getZoneFromCoords([37.000, -5.000], 'malaga');
      expect(zone).toBe('OUTSIDE');
    });

    it('debe identificar ZONA2 si está fuera de Z1 pero dentro de los límites de Z2', () => {
      const zone = getZoneFromCoords([36.728, -4.428], 'malaga');
      expect(zone).toBe('ZONA2');
    });

  });
});

describe('Lógica de Acceso ZBE Madrid', () => {

  it('SIN etiqueta debe estar prohibido en todo Madrid', () => {
    const result = checkAccess(
      'SIN',
      false,
      'ZONA2',
      false,
      'madrid'
    );

    expect(result.allowed).toBe(false);
    expect(result.status).toBe('prohibited');
    expect(result.messageKey).toBe('forbiddenEverywhere');
  });

  it('ECO debe tener acceso libre', () => {
    const result = checkAccess(
      'ECO',
      false,
      'ZONA1',
      false,
      'madrid'
    );

    expect(result.allowed).toBe(true);
  });

  it('Etiqueta B prohibida en ZONA1', () => {
    const result = checkAccess(
      'B',
      false,
      'ZONA1',
      false,
      'madrid'
    );

    expect(result.allowed).toBe(false);
  });

});

describe('getZoneFromCoords Madrid', () => {

  it('detecta ZONA1 Madrid correctamente', () => {
    const zone = getZoneFromCoords(
      [40.415, -3.700],
      'madrid'
    );

    expect(zone).toBe('ZONA1');
  });

  it('detecta ZONA2 Madrid correctamente', () => {
    const zone = getZoneFromCoords(
      [40.44, -3.72],
      'madrid'
    );

    expect(zone).toBe('ZONA2');
  });

});

describe('Edge cases', () => {

  it('badge null siempre neutral', () => {
    const result = checkAccess(
      null,
      false,
      'ZONA1',
      false,
      'madrid'
    );

    expect(result.status).toBe('neutral');
  });

});