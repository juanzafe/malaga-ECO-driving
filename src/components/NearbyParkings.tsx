import { useEffect } from 'react';
import type { Parking } from '../types/Parking';
import { getZoneFromCoords } from '../data/ZbeRules';

interface Props {
  origin: [number, number];
  onParkingsLoaded: (parkings: Parking[]) => void;
  onParkingSelected?: (parking: Parking) => void;
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

const OVERPASS_SERVERS: string[] = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
  'https://overpass.openstreetmap.ru/api/interpreter',
];

export const NearbyParkings = ({ origin, onParkingsLoaded}: Props) => {
  useEffect(() => {
    const controller = new AbortController();
    let isMounted = true;

    const fetchParkings = async (): Promise<void> => {
      const query = `
        [out:json][timeout:10];
        (
          node["amenity"="parking"]["access"!="private"](around:2000,${origin[0]},${origin[1]});
          way["amenity"="parking"]["access"!="private"](around:2000,${origin[0]},${origin[1]});
        );
        out center 40;
      `;

      for (const server of OVERPASS_SERVERS) {
        if (!isMounted) return;
        
        try {
          const res = await fetch(server, { 
            method: 'POST', 
            body: query,
            signal: controller.signal 
          });

          if (!res.ok) continue;

          const data = (await res.json()) as OverpassResponse;
          if (!isMounted) return;

          const parsedFromAPI: Parking[] = data.elements
            .map((el: OverpassElement): Parking | null => {
              const lat = el.lat ?? el.center?.lat;
              const lon = el.lon ?? el.center?.lon;
              if (!lat || !lon) return null;
              return {
                id: String(el.id),
                name: el.tags?.name || 'Parking público',
                coords: [lat, lon] as [number, number],
              };
            })
            .filter((p): p is Parking => {
              if (p === null) return false;
              const zone = getZoneFromCoords(p.coords);
              return zone === 'ZONA1' || zone === 'ZONA2';
            });

          const all: Parking[] = [...FIXED_ZONA1_PARKINGS, ...parsedFromAPI];
          const seen = new Set<string>();
          const uniqueParkings: Parking[] = [];

          for (const p of all) {
            const bucket = `${p.coords[0].toFixed(4)},${p.coords[1].toFixed(4)}`;
            if (!seen.has(bucket)) {
              seen.add(bucket);
              uniqueParkings.push(p);
            }
          }

          onParkingsLoaded(uniqueParkings.slice(0, 15));
          return; 

        } catch (err: unknown) {
          if (err instanceof Error) {
            if (err.name === 'AbortError') return;
            console.warn(`Error en ${server}: ${err.message}`);
          }
        }
      }

      if (isMounted) onParkingsLoaded(FIXED_ZONA1_PARKINGS);
    };

    fetchParkings();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [onParkingsLoaded, origin]);

  return null;
};