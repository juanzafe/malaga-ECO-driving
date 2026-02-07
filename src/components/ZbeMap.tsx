import { MapContainer, TileLayer, Polygon, Marker, Tooltip } from 'react-leaflet';
import type { LatLngTuple } from 'leaflet';
import { useState } from 'react';
import L from 'leaflet';
import { type Badge, checkAccess } from '../data/ZbeRules';
// He quitado useTranslation porque no se usaba
import type { Parking } from '../types/Parking';
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
  className: 'text-xl',
  iconSize: [24, 24],
});

type ZoneType = 'ZONA1' | 'ZONA2';

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

  const ruleZona1 = checkAccess(userLabel, isFuture, 'ZONA1', isResident);
  const ruleZona2 = checkAccess(userLabel, isFuture, 'ZONA2', isResident);

  return (
    <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-inner bg-slate-100">
      <MapContainer
        center={[36.7213, -4.4215]}
        zoom={14}
        className="h-full w-full"
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution="&copy; OSM"
        />

        <Polygon
          positions={POLY_ZONA_2}
          eventHandlers={{
            mouseover: () => setHovered('ZONA2'),
            mouseout: () => setHovered(null),
          }}
          pathOptions={{
            fillColor: ruleZona2.color,
            color: ruleZona2.color,
            weight: hovered === 'ZONA2' ? 4 : 2,
            fillOpacity: hovered === 'ZONA2' ? 0.4 : 0.2,
            dashArray: '5, 10',
          }}
        />

        <Polygon
          positions={POLY_ZONA_1}
          eventHandlers={{
            mouseover: () => setHovered('ZONA1'),
            mouseout: () => setHovered(null),
          }}
          pathOptions={{
            fillColor: ruleZona1.color,
            color: ruleZona1.color,
            weight: hovered === 'ZONA1' ? 4 : 2,
            fillOpacity: hovered === 'ZONA1' ? 0.7 : 0.5,
          }}
        />

        {externalSearch && (
          <Marker position={externalSearch.coords}>
            <Tooltip permanent direction="top" offset={[0, -20]}>
              <span className="font-bold">📍 {externalSearch.address.split(',')[0]}</span>
            </Tooltip>
          </Marker>
        )}

{externalParkings?.map(p => {
  // Validar que las coordenadas existen y son números
  if (!p.coords || !p.coords[0] || !p.coords[1]) {
    console.warn('⚠️ Parking sin coordenadas válidas:', p);
    return null;
  }
  
  return (
    <Marker key={p.id} position={p.coords} icon={ParkingIcon}>
      <Tooltip>
        <b>{p.name}</b>
      </Tooltip>
    </Marker>
  );
})}
      </MapContainer>
    </div>
  );
};