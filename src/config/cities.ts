import type { LatLngTuple } from 'leaflet';

// MÁLAGA
const MALAGA_ZONA_1: LatLngTuple[] = [
  [36.7235, -4.4255], [36.7251, -4.4230], [36.7245, -4.4190],
  [36.7225, -4.4170], [36.7210, -4.4180], [36.7200, -4.4200],
  [36.7195, -4.4235], [36.7215, -4.4250],
];

const MALAGA_ZONA_2: LatLngTuple[] = [
  [36.7175, -4.4270], [36.7160, -4.4220], [36.7185, -4.4150],
  [36.7240, -4.4130], [36.7270, -4.4160], [36.7290, -4.4220],
  [36.7280, -4.4270], [36.7230, -4.4285], [36.7200, -4.4280],
];

// MADRID - Zona 1: Madrid Central (Distrito Centro)
const MADRID_ZONA_1: LatLngTuple[] = [
  [40.4285, -3.7115], [40.4295, -3.7050], [40.4260, -3.6900],
  [40.4080, -3.6920], [40.4050, -3.7050], [40.4080, -3.7150]
];

// MADRID - Zona 2: Aproximación de M-30 (anillo exterior)
const MADRID_ZONA_2: LatLngTuple[] = [
  // Norte
  [40.4700, -3.7000], [40.4700, -3.6800], [40.4700, -3.6600],
  // Este
  [40.4600, -3.6400], [40.4400, -3.6300], [40.4200, -3.6300],
  // Sur
  [40.3900, -3.6400], [40.3800, -3.6600], [40.3800, -3.6800],
  // Oeste
  [40.3800, -3.7300], [40.3900, -3.7500], [40.4200, -3.7600],
  [40.4400, -3.7600], [40.4600, -3.7400], [40.4700, -3.7200]
];

export const CITIES = {
  malaga: {
    id: 'malaga',
    name: 'Málaga',
    coords: [36.7213, -4.4215] as LatLngTuple,
    zoom: 14,
    polygons: {
      zona1: MALAGA_ZONA_1,
      zona2: MALAGA_ZONA_2
    }
  },
  madrid: {
    id: 'madrid',
    name: 'Madrid',
    coords: [40.416775, -3.703790] as LatLngTuple,
    zoom: 12,
    polygons: {
      zona1: MADRID_ZONA_1,
      zona2: MADRID_ZONA_2
    }
  }
};

export type CityKey = keyof typeof CITIES;