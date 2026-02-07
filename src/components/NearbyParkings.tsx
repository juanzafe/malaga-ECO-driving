import { useEffect, useState } from 'react';
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
  center?: {
    lat: number;
    lon: number;
  };
  tags?: {
    name?: string;
  };
}

interface OverpassResponse {
  elements: OverpassElement[];
}

// 🅿️ Parkings fijos en ZONA1 (centro de Málaga)
const FIXED_ZONA1_PARKINGS: Parking[] = [
  {
    id: 'fixed-alcazaba',
    name: 'Parking Alcazaba',
    coords: [36.7215, -4.4165],
  },
  {
    id: 'fixed-marina',
    name: 'Parking Marina Square',
    coords: [36.7205, -4.4190],
  },
  {
    id: 'fixed-larios',
    name: 'Parking Larios Centro',
    coords: [36.7220, -4.4210],
  },
];

// Lista de servidores Overpass alternativos
const OVERPASS_SERVERS = [
  'https://overpass.kumi.systems/api/interpreter',
  'https://overpass-api.de/api/interpreter',
  'https://overpass.openstreetmap.ru/api/interpreter',
];

export const NearbyParkings = ({ origin, onParkingsLoaded, onParkingSelected }: Props) => {
  const [state, setState] = useState<{
    parkings: Parking[];
    isLoading: boolean;
    error: boolean;
  }>({
    parkings: [],
    isLoading: true,
    error: false,
  });

  useEffect(() => {
    console.log('🔍 Buscando parkings en:', origin);
    let cancelled = false;
    let serverIndex = 0;

    const query = `
      [out:json][timeout:15];
      (
        node["amenity"="parking"]["access"!="private"](around:2000,${origin[0]},${origin[1]});
        way["amenity"="parking"]["access"!="private"](around:2000,${origin[0]},${origin[1]});
        node["amenity"="parking"]["parking"="surface"](around:2000,${origin[0]},${origin[1]});
        node["amenity"="parking"]["parking"="multi-storey"](around:2000,${origin[0]},${origin[1]});
      );
      out center tags;
    `;

    const tryFetch = async () => {
      while (serverIndex < OVERPASS_SERVERS.length && !cancelled) {
        const server = OVERPASS_SERVERS[serverIndex];
        console.log(`📡 Intentando servidor ${serverIndex + 1}/${OVERPASS_SERVERS.length}: ${server}`);

        try {
          const res = await fetch(server, {
            method: 'POST',
            body: query,
          });

          console.log('📡 Respuesta recibida:', res.status);

          if (!res.ok) {
            throw new Error(`HTTP ${res.status}`);
          }

          const data: OverpassResponse = await res.json();

          if (cancelled) return;

          console.log('✅ Parkings encontrados:', data.elements.length);

          const parsedFromAPI: Parking[] = data.elements
            .map(el => {
              const lat = el.lat ?? el.center?.lat;
              const lon = el.lon ?? el.center?.lon;

              if (!lat || !lon) {
                return null;
              }

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

          // 🔥 COMBINAR parkings de API + parkings fijos de ZONA1
          const allParkings = [...FIXED_ZONA1_PARKINGS, ...parsedFromAPI];

          // Eliminar duplicados por proximidad (si están a menos de 50m)
          const uniqueParkings = allParkings.filter((parking, index, self) => {
            return index === self.findIndex(p => {
              const distance = Math.sqrt(
                Math.pow(p.coords[0] - parking.coords[0], 2) +
                Math.pow(p.coords[1] - parking.coords[1], 2)
              ) * 111000; // Convertir a metros aproximadamente
              return distance < 50; // Menos de 50 metros = duplicado
            });
          });

          // Ordenar por distancia
          const sorted = uniqueParkings.sort((a, b) => {
            const distA = Math.sqrt(
              Math.pow(a.coords[0] - origin[0], 2) + 
              Math.pow(a.coords[1] - origin[1], 2)
            );
            const distB = Math.sqrt(
              Math.pow(b.coords[0] - origin[0], 2) + 
              Math.pow(b.coords[1] - origin[1], 2)
            );
            return distA - distB;
          });

          // Limitar a 15
          const final = sorted.slice(0, 15);

          console.log('🗺️ Parkings finales:', final);
          console.log(`📊 ZONA1: ${final.filter(p => getZoneFromCoords(p.coords) === 'ZONA1').length}`);
          console.log(`📊 ZONA2: ${final.filter(p => getZoneFromCoords(p.coords) === 'ZONA2').length}`);

          setState({
            parkings: final,
            isLoading: false,
            error: false,
          });
          onParkingsLoaded(final);
          return;

        } catch (err) {
          console.error(`❌ Error en servidor ${serverIndex + 1}:`, err);
          serverIndex++;

          if (serverIndex >= OVERPASS_SERVERS.length && !cancelled) {
            // Si falla todo, al menos mostrar los parkings fijos de ZONA1
            console.log('⚠️ Usando solo parkings fijos de ZONA1');
            setState({
              parkings: FIXED_ZONA1_PARKINGS,
              isLoading: false,
              error: false,
            });
            onParkingsLoaded(FIXED_ZONA1_PARKINGS);
          }
        }
      }
    };

    tryFetch();

    return () => {
      cancelled = true;
    };
  }, [origin, onParkingsLoaded]);

  const openGoogleMaps = (parkingCoords: [number, number]) => {
    const url = `https://www.google.com/maps/dir/?api=1&origin=${origin[0]},${origin[1]}&destination=${parkingCoords[0]},${parkingCoords[1]}&travelmode=driving`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleParkingClick = (parking: Parking) => {
    if (onParkingSelected) {
      onParkingSelected(parking);
    }
  };

  if (state.isLoading) {
    return (
      <p className="text-sm text-slate-500">
        🔄 Buscando parkings en ZBE…
      </p>
    );
  }

  if (state.error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
        <p className="text-sm text-red-600 font-semibold">
          ⚠️ No se pudieron cargar los parkings
        </p>
        <p className="text-xs text-red-500 mt-1">
          Los servidores están saturados. Inténtalo más tarde.
        </p>
      </div>
    );
  }

  if (state.parkings.length === 0) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
        <p className="text-sm text-amber-700 font-semibold">
          ℹ️ No hay parkings públicos registrados en la ZBE
        </p>
        <p className="text-xs text-amber-600 mt-1">
          Es posible que existan parkings privados o de pago no listados.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">
        🅿️ Parkings en ZBE ({state.parkings.length})
      </h4>

      {state.parkings.map(p => {
        const zone = getZoneFromCoords(p.coords);
        const isZone1 = zone === 'ZONA1';
        
        return (
          <div
            key={p.id}
            className="flex items-center justify-between bg-white border rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex-1 min-w-0 mr-3">
              <div className="flex items-center gap-2">
                <p className="font-bold text-sm truncate">{p.name}</p>
                {onParkingSelected && (
                  <button
                    onClick={() => handleParkingClick(p)}
                    className="text-[10px] bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded-full text-slate-600 font-bold transition-colors"
                    title="Ver en el mapa"
                  >
                    📍 Ver
                  </button>
                )}
              </div>
              <p className="text-[10px] text-slate-400">
                {isZone1 ? '🔴 Centro (ZONA 1)' : '🟡 Anillo (ZONA 2)'}
              </p>
            </div>

            <button
              onClick={() => openGoogleMaps(p.coords)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full text-xs font-black transition-colors flex items-center gap-1 whitespace-nowrap"
              title="Abrir en Google Maps"
            >
              <span>🗺️</span>
              <span>Cómo llegar</span>
            </button>
          </div>
        );
      })}
    </div>
  );
};