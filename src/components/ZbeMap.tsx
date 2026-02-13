import { MapContainer, TileLayer, Polygon, Marker, Tooltip, Popup, useMap } from 'react-leaflet';
import type { LatLngTuple } from 'leaflet';
import { useState, useEffect } from 'react';
import L from 'leaflet';
import { type Badge, checkAccess } from '../data/ZbeRules';
import type { Parking } from '../types/Parking';

// --- ICONOS (Se mantienen igual) ---
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

const ParkingIcon = L.divIcon({
  html: '🅿️',
  className: 'text-xl flex items-center justify-center',
  iconSize: [24, 24],
});

// --- TIPOS ---
type ZoneType = 'ZONA1' | 'ZONA2';

interface OverpassElement {
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: { name?: string };
}

interface OverpassResponse {
  elements: OverpassElement[];
}

// 💡 Sub-componente para mover la cámara cuando cambias de ciudad
function ChangeView({ center, zoom }: { center: LatLngTuple, zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

const OVERPASS_SERVERS = ['https://overpass-api.de/api/interpreter', 'https://overpass.kumi.systems/api/interpreter'];

// --- COMPONENTE NEARBY PARKINGS (Se mantiene igual, ya es dinámico por el 'origin') ---
export const NearbyParkings = ({ origin, onParkingsLoaded }: { origin: [number, number], onParkingsLoaded: (p: Parking[]) => void }) => {
  useEffect(() => {
    const controller = new AbortController();
    let isMounted = true;

    const fetchParkings = async (): Promise<void> => {
      const query = `[out:json][timeout:10];(node["amenity"="parking"]["access"!="private"](around:2000,${origin[0]},${origin[1]});way["amenity"="parking"]["access"!="private"](around:2000,${origin[0]},${origin[1]}););out center 30;`;

      for (const server of OVERPASS_SERVERS) {
        if (!isMounted) return;
        try {
          const res = await fetch(server, { method: 'POST', body: query, signal: controller.signal });
          if (!res.ok) continue;
          const data = (await res.json()) as OverpassResponse;
          
          const parsed: Parking[] = data.elements
            .map((el: OverpassElement): Parking | null => {
              const lat = el.lat ?? el.center?.lat;
              const lon = el.lon ?? el.center?.lon;
              if (!lat || !lon) return null;
              return { id: String(el.id), name: el.tags?.name || 'Parking público', coords: [lat, lon] };
            })
            .filter((p): p is Parking => p !== null); // Aquí quitamos el filtro de zona para que sea genérico

          onParkingsLoaded(parsed.slice(0, 15));
          return;
        } catch (err: unknown) {
          if (err instanceof Error && err.name === 'AbortError') return;
        }
      }
    };
    fetchParkings();
    return () => { isMounted = false; controller.abort(); };
  }, [onParkingsLoaded, origin]);
  return null;
};

// --- COMPONENTE ZBEMAP ACTUALIZADO ---
export const ZbeMap = ({ 
  isFuture, 
  userLabel, 
  isResident, 
  externalSearch, 
  externalParkings,
  cityCenter,  // <-- NUEVA PROP
  cityZoom,    // <-- NUEVA PROP
  polygons     // <-- NUEVA PROP (un objeto con { zona1: [], zona2: [] })
}: {
  isFuture: boolean;
  userLabel: Badge;
  isResident: boolean;
  externalSearch?: { coords: [number, number]; address: string } | null;
  externalParkings?: Parking[];
  cityCenter: LatLngTuple;
  cityZoom: number;
  polygons: { zona1: LatLngTuple[], zona2: LatLngTuple[] }
}) => {
  const [hovered, setHovered] = useState<ZoneType | null>(null);
  const [localParkings, setLocalParkings] = useState<Parking[]>([]);

  const parkingsToShow = externalParkings || localParkings;
  const ruleZona1 = checkAccess(userLabel, isFuture, 'ZONA1', isResident);
  const ruleZona2 = checkAccess(userLabel, isFuture, 'ZONA2', isResident);

  const openGoogleMaps = (dest: [number, number]) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${dest[0]},${dest[1]}&travelmode=driving`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-inner bg-slate-100">
      <MapContainer 
        center={cityCenter} 
        zoom={cityZoom} 
        className="h-full w-full" 
        zoomControl={false}
      >
        <ChangeView center={cityCenter} zoom={cityZoom} />
        
        <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" attribution="© OSM" />

        {/* ZONA 2 - EXTERIOR (DInámica) */}
        {polygons.zona2.length > 0 && (
          <Polygon 
            positions={polygons.zona2} 
            eventHandlers={{ mouseover: () => setHovered('ZONA2'), mouseout: () => setHovered(null) }}
            pathOptions={{ 
              fillColor: ruleZona2.color, 
              color: ruleZona2.color, 
              weight: hovered === 'ZONA2' ? 4 : 2, 
              fillOpacity: hovered === 'ZONA2' ? 0.4 : 0.2, 
              dashArray: '5, 10' 
            }}
          />
        )}

        {/* ZONA 1 - CENTRO (Dinámica) */}
        {polygons.zona1.length > 0 && (
          <Polygon 
            positions={polygons.zona1} 
            eventHandlers={{ mouseover: () => setHovered('ZONA1'), mouseout: () => setHovered(null) }}
            pathOptions={{ 
              fillColor: ruleZona1.color, 
              color: ruleZona1.color, 
              weight: hovered === 'ZONA1' ? 4 : 2, 
              fillOpacity: hovered === 'ZONA1' ? 0.7 : 0.5,
            }}
          />
        )}

        {/* Marcador de búsqueda y Parkings se mantienen igual... */}
        {externalSearch && (
          <Marker position={externalSearch.coords} zIndexOffset={1100}>
            <Tooltip permanent direction="top" offset={[0, -20]}>
              <span className="font-bold">📍 {externalSearch.address.split(',')[0]}</span>
            </Tooltip>
          </Marker>
        )}

        {parkingsToShow.map(p => (
          <Marker key={p.id} position={p.coords} icon={ParkingIcon} zIndexOffset={1000}>
            <Popup closeButton={false}>
              <div className="p-1 flex flex-col items-center gap-2 min-w-35">
                <p className="font-bold text-slate-800 m-0 text-center text-sm leading-tight">{p.name}</p>
                <button
                  onClick={() => openGoogleMaps(p.coords)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full text-[10px] font-black w-full shadow-md flex items-center justify-center gap-1"
                >
                  <span>🚗 CÓMO LLEGAR</span>
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {externalSearch && (
        <NearbyParkings origin={externalSearch.coords} onParkingsLoaded={setLocalParkings} />
      )}
    </div>
  );
};