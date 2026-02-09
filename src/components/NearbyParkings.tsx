import { useEffect } from 'react';
import type { Parking } from '../types/Parking';
import { getZoneFromCoords } from '../data/ZbeRules';

interface Props {
  origin: [number, number];
  onParkingsLoaded: (parkings: Parking[]) => void;
}

interface OverpassElement {
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number; };
  tags?: { name?: string; };
}

interface OverpassResponse {
  elements: OverpassElement[];
}

const FIXED_ZONA1_PARKINGS: Parking[] = [
  { id: 'fixed-alcazaba', name: 'Parking Alcazaba', coords: [36.7215, -4.4165] },
  { id: 'fixed-marina', name: 'Parking Marina Square', coords: [36.7205, -4.4190] },
  { id: 'fixed-larios', name: 'Parking Larios Centro', coords: [36.7220, -4.4210] },
];

const OVERPASS_SERVERS = [
  'https://overpass.kumi.systems/api/interpreter',
  'https://overpass-api.de/api/interpreter',
  'https://overpass.openstreetmap.ru/api/interpreter',
];

export const NearbyParkings = ({ origin, onParkingsLoaded }: Props) => {
  useEffect(() => {
    let cancelled = false;
    let serverIndex = 0;

    const query = `
      [out:json][timeout:15];
      (
        node["amenity"="parking"]["access"!="private"](around:2000,${origin[0]},${origin[1]});
        way["amenity"="parking"]["access"!="private"](around:2000,${origin[0]},${origin[1]});
      );
      out center tags;
    `;

    const tryFetch = async () => {
      while (serverIndex < OVERPASS_SERVERS.length && !cancelled) {
        const server = OVERPASS_SERVERS[serverIndex];
        try {
          const res = await fetch(server, { method: 'POST', body: query });
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const data: OverpassResponse = await res.json();
          if (cancelled) return;

          const parsedFromAPI: Parking[] = data.elements
            .map(el => {
              const lat = el.lat ?? el.center?.lat;
              const lon = el.lon ?? el.center?.lon;
              if (!lat || !lon) return null;
              return {
                id: String(el.id),
                name: el.tags?.name || 'Parking público',
                coords: [lat, lon] as [number, number],
              };
            })
            .filter((p): p is Parking => p !== null)
            .filter(p => {
              const zone = getZoneFromCoords(p.coords);
              return zone === 'ZONA1' || zone === 'ZONA2';
            });

          const allParkings = [...FIXED_ZONA1_PARKINGS, ...parsedFromAPI];
          
          const uniqueParkings = allParkings.filter((parking, index, self) => 
            index === self.findIndex(p => {
              const dist = Math.sqrt(Math.pow(p.coords[0] - parking.coords[0], 2) + Math.pow(p.coords[1] - parking.coords[1], 2)) * 111000;
              return dist < 50;
            })
          );

          onParkingsLoaded(uniqueParkings.slice(0, 15));
          return;
        } catch {
          serverIndex++;
          if (serverIndex >= OVERPASS_SERVERS.length && !cancelled) {
            onParkingsLoaded(FIXED_ZONA1_PARKINGS);
          }
        }
      }
    };

    tryFetch();
    return () => { cancelled = true; };
  }, [origin, onParkingsLoaded]);

  return null;
};