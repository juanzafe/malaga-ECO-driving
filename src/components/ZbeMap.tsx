import { MapContainer, TileLayer, Polygon, Marker, Tooltip, Popup } from 'react-leaflet';
import type { LatLngTuple } from 'leaflet';
import { useState, useEffect } from 'react';
import L from 'leaflet';
import { type Badge, checkAccess } from '../data/ZbeRules';
import type { Parking } from '../types/Parking';
import { getZoneFromCoords } from '../data/ZbeRules';

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

const POLY_ZONA_1: LatLngTuple[] = [
  [36.7235, -4.4255], [36.7251, -4.4230], [36.7245, -4.4190],
  [36.7225, -4.4170], [36.7210, -4.4180], [36.7200, -4.4200],
  [36.7195, -4.4235], [36.7215, -4.4250],
];

const POLY_ZONA_2: LatLngTuple[] = [
  [36.7175, -4.4270], [36.7160, -4.4220], [36.7185, -4.4150],
  [36.7240, -4.4130], [36.7270, -4.4160], [36.7290, -4.4220],
  [36.7280, -4.4270], [36.7230, -4.4285], [36.7200, -4.4280],
];

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

export const NearbyParkings = ({ origin, onParkingsLoaded }: { origin: [number, number], onParkingsLoaded: (p: Parking[]) => void }) => {
  useEffect(() => {
    let cancelled = false;
    let serverIndex = 0;

    const query = `[out:json][timeout:15];(node["amenity"="parking"]["access"!="private"](around:2000,${origin[0]},${origin[1]});way["amenity"="parking"]["access"!="private"](around:2000,${origin[0]},${origin[1]}););out center tags;`;

    const tryFetch = async () => {
      while (serverIndex < OVERPASS_SERVERS.length && !cancelled) {
        try {
          const res = await fetch(OVERPASS_SERVERS[serverIndex], { method: 'POST', body: query });
          if (!res.ok) throw new Error();
          const data: OverpassResponse = await res.json();
          if (cancelled) return;

          const parsed: Parking[] = data.elements
            .map((el: OverpassElement) => {
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
            .filter((p) => {
               const zone = getZoneFromCoords(p.coords);
               return zone === 'ZONA1' || zone === 'ZONA2';
            });

          const all = [...FIXED_ZONA1_PARKINGS, ...parsed];
          const unique = all.filter((p, i, s) => 
            i === s.findIndex(t => Math.abs(t.coords[0]-p.coords[0]) < 0.0005 && Math.abs(t.coords[1]-p.coords[1]) < 0.0005)
          );

          onParkingsLoaded(unique.slice(0, 15));
          return;
        } catch {
          serverIndex++;
          if (serverIndex >= OVERPASS_SERVERS.length && !cancelled) onParkingsLoaded(FIXED_ZONA1_PARKINGS);
        }
      }
    };
    tryFetch();
    return () => { cancelled = true; };
  }, [origin, onParkingsLoaded]);
  return null;
};

export const ZbeMap = ({
  isFuture,
  userLabel,
  isResident,
  externalSearch,
  externalParkings,
}: {
  isFuture: boolean;
  userLabel: Badge;
  isResident: boolean;
  externalSearch?: { coords: [number, number]; address: string } | null;
  externalParkings?: Parking[];
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
      <MapContainer center={[36.7213, -4.4215]} zoom={14} className="h-full w-full" zoomControl={false}>
        <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" attribution="© OSM" />

        <Polygon positions={POLY_ZONA_2} eventHandlers={{ mouseover: () => setHovered('ZONA2'), mouseout: () => setHovered(null) }}
          pathOptions={{ fillColor: ruleZona2.color, color: ruleZona2.color, weight: hovered === 'ZONA2' ? 4 : 2, fillOpacity: hovered === 'ZONA2' ? 0.4 : 0.2, dashArray: '5, 10' }} />

        <Polygon positions={POLY_ZONA_1} eventHandlers={{ mouseover: () => setHovered('ZONA1'), mouseout: () => setHovered(null) }}
          pathOptions={{ fillColor: ruleZona1.color, color: ruleZona1.color, weight: hovered === 'ZONA1' ? 4 : 2, fillOpacity: hovered === 'ZONA1' ? 0.7 : 0.5 }} />

        {externalSearch && (
          <Marker position={externalSearch.coords}>
            <Tooltip permanent direction="top" offset={[0, -20]}>
              <span className="font-bold">📍 {externalSearch.address.split(',')[0]}</span>
            </Tooltip>
          </Marker>
        )}

        {parkingsToShow.map(p => (
          <Marker key={p.id} position={p.coords} icon={ParkingIcon}>
            <Popup closeButton={false}>
              <div className="p-1 flex flex-col items-center gap-2 min-w-35">
                <p className="font-bold text-slate-800 m-0 text-center text-sm leading-tight">{p.name}</p>
                <button
                  onClick={() => openGoogleMaps(p.coords)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full text-[10px] font-black transition-colors w-full text-center shadow-md flex items-center justify-center gap-1"
                >
                  <span>🚗</span>
                  <span>CÓMO LLEGAR</span>
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