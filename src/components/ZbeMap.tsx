import { MapContainer, TileLayer, Polygon, Marker, Tooltip } from 'react-leaflet';
import type { LatLngTuple } from 'leaflet';
import { useState } from 'react';
import L from 'leaflet';
import type { Badge } from './VehicleChecker';

import 'leaflet/dist/leaflet.css';

/* ================= ICONOS ================= */
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

/* ================= TIPOS ================= */
type ZoneType = 'ZONA1' | 'ZONA2';

/* ================= POLÍGONOS ZBE ================= */
const POLY_ZONA_1: LatLngTuple[] = [
  [36.7214, -4.4215], [36.7230, -4.4165], [36.7255, -4.4175],
  [36.7285, -4.4210], [36.7290, -4.4245], [36.7275, -4.4275],
  [36.7240, -4.4270], [36.7185, -4.4255], [36.7160, -4.4230],
];

const POLY_ZONA_2: LatLngTuple[] = [
  [36.7325, -4.4280], [36.7350, -4.4350], [36.7280, -4.4420],
  [36.7200, -4.4450], [36.7150, -4.4380], [36.7120, -4.4250],
  [36.7120, -4.4150], [36.7200, -4.4100], [36.7300, -4.4150],
];

/* ================= UTILS ================= */
const isPointInPolygon = (point: LatLngTuple, vs: LatLngTuple[]) => {
  const x = point[0], y = point[1];
  let inside = false;
  for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
    const xi = vs[i][0], yi = vs[i][1];
    const xj = vs[j][0], yj = vs[j][1];
    const intersect = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
};

/* ================= MAIN ================= */
export const ZbeMap = ({
  isFuture,
  userLabel,
  externalSearch,
}: {
  isFuture: boolean;
  userLabel: Badge;
  externalSearch?: { coords: [number, number]; address: string } | null;
}) => {
  const [hovered, setHovered] = useState<ZoneType | null>(null);

  const searched = externalSearch ?? null;

  const getZoneStatus = (zone: ZoneType) => {
    if (!userLabel) return { text: 'Selecciona tu etiqueta', color: '#64748b', icon: '🔍' };
    if (userLabel === 'SIN') return { text: 'Prohibido', color: '#dc2626', icon: '⛔' };
    if (userLabel === 'CERO' || userLabel === 'ECO') return { text: 'Libre', color: '#16a34a', icon: '✅' };

    if (userLabel === 'C') {
      if (isFuture && zone === 'ZONA1') return { text: 'Parking obligatorio', color: '#eab308', icon: '🅿️' };
      return { text: 'Libre', color: '#16a34a', icon: '✅' };
    }

    if (userLabel === 'B') {
      if (isFuture) return { text: 'Prohibido (solo residentes)', color: '#dc2626', icon: '🚫' };
      return { text: 'Libre con advertencia', color: '#f97316', icon: '⚠️' };
    }

    return { text: 'Acceso permitido', color: '#16a34a', icon: '✅' };
  };

  const zoneResult: { zone: ZoneType | null; name: string } | null = searched
    ? isPointInPolygon(searched.coords, POLY_ZONA_1)
      ? { zone: 'ZONA1', name: 'Centro Histórico' }
      : isPointInPolygon(searched.coords, POLY_ZONA_2)
      ? { zone: 'ZONA2', name: 'Anillo Exterior' }
      : { zone: null, name: 'Fuera de ZBE' }
    : null;

  /* Determina si pintar cada zona o dejarla neutra */
  const shouldPaintZone = (zone: ZoneType) => {
    if (!searched) return false; // Sin búsqueda no pintamos
    if (zoneResult?.zone === zone) return true;
    return false;
  };

  return (
    <div className="relative w-full h-150 rounded-3xl overflow-hidden shadow-2xl border-4 border-white">

      {/* PANEL DE RESULTADO */}
      <div className="absolute top-4 right-4 z-50 bg-white/95 backdrop-blur rounded-2xl shadow-xl p-4 min-w-60">
        {searched && zoneResult ? (
          <>
            <p className="text-[10px] uppercase font-black text-slate-400 mb-1">Resultado</p>
            <p className="font-bold text-sm">{zoneResult.name}</p>
            {zoneResult.zone ? (
              <p className="text-xs font-semibold flex gap-2 items-center"
                 style={{ color: getZoneStatus(zoneResult.zone).color }}>
                {getZoneStatus(zoneResult.zone).icon} {getZoneStatus(zoneResult.zone).text}
              </p>
            ) : (
              <p className="text-xs text-slate-600 flex gap-2 items-center">
                🌍 Fuera de ZBE
              </p>
            )}
          </>
        ) : (
          <p className="text-xs font-bold text-slate-600">🔍 Busca una calle arriba para analizar</p>
        )}
      </div>

      <MapContainer center={[36.7213, -4.4215]} zoom={14} className="h-full w-full" zoomControl={false}>
        <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />

        {/* POLÍGONOS DINÁMICOS */}
        <Polygon
          positions={POLY_ZONA_2}
          eventHandlers={{ mouseover: () => setHovered('ZONA2'), mouseout: () => setHovered(null) }}
          pathOptions={{
            fillColor: shouldPaintZone('ZONA2') ? getZoneStatus('ZONA2').color : '#94a3b8', // gris neutro
            fillOpacity: hovered === 'ZONA2' ? 0.35 : 0.22,
            color: '#1e293b',
            weight: hovered === 'ZONA2' ? 3 : 1,
            dashArray: '8 6',
          }}
        >
          <Tooltip sticky>
            <b>Anillo Exterior</b><br />{getZoneStatus('ZONA2').text}
          </Tooltip>
        </Polygon>

        <Polygon
          positions={POLY_ZONA_1}
          eventHandlers={{ mouseover: () => setHovered('ZONA1'), mouseout: () => setHovered(null) }}
          pathOptions={{
            fillColor: shouldPaintZone('ZONA1') ? getZoneStatus('ZONA1').color : '#94a3b8',
            fillOpacity: hovered === 'ZONA1' ? 0.55 : 0.4,
            color: '#0f172a',
            weight: hovered === 'ZONA1' ? 3 : 2,
          }}
        >
          <Tooltip sticky>
            <b>Centro Histórico</b><br />{getZoneStatus('ZONA1').text}
          </Tooltip>
        </Polygon>

        {/* MARKER DE BÚSQUEDA */}
        {searched && (
          <Marker position={searched.coords}>
            <Tooltip permanent direction="top" className="font-bold bg-white p-2 rounded-xl shadow">
              📍 {searched.address.split(',')[0]}
            </Tooltip>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};
