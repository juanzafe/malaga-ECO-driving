import { MapContainer, TileLayer, Polygon, Marker, Tooltip } from 'react-leaflet';
import type { LatLngTuple } from 'leaflet';
import { useState } from 'react';
import L from 'leaflet';
import { type Badge, checkAccess } from '../data/ZbeRules';

import 'leaflet/dist/leaflet.css';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

type ZoneType = 'ZONA1' | 'ZONA2';

const POLY_ZONA_1: LatLngTuple[] = [
  [36.7214, -4.4215],
  [36.7230, -4.4165],
  [36.7255, -4.4175],
  [36.7285, -4.4210],
  [36.7290, -4.4245],
  [36.7275, -4.4275],
  [36.7240, -4.4270],
  [36.7185, -4.4255],
  [36.7160, -4.4230],
];

const POLY_ZONA_2: LatLngTuple[] = [
  [36.7325, -4.4280],
  [36.7350, -4.4350],
  [36.7280, -4.4420],
  [36.7200, -4.4450],
  [36.7150, -4.4380],
  [36.7120, -4.4250],
  [36.7120, -4.4150],
  [36.7200, -4.4100],
  [36.7300, -4.4150],
];

const isPointInPolygon = (point: LatLngTuple, vs: LatLngTuple[]) => {
  const x = point[0];
  const y = point[1];
  let inside = false;

  for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
    const xi = vs[i][0];
    const yi = vs[i][1];
    const xj = vs[j][0];
    const yj = vs[j][1];

    const intersect =
      yi > y !== yj > y &&
      x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;

    if (intersect) inside = !inside;
  }

  return inside;
};

export const ZbeMap = ({
  isFuture,
  userLabel,
  isResident,
  externalSearch,
}: {
  isFuture: boolean;
  userLabel: Badge;
  isResident: boolean;
  externalSearch?: { coords: [number, number]; address: string } | null;
}) => {
  const [hovered, setHovered] = useState<ZoneType | null>(null);
  const searched = externalSearch ?? null;

  const zoneResult = searched
    ? isPointInPolygon(searched.coords, POLY_ZONA_1)
      ? { zone: 'ZONA1' as ZoneType, name: 'Centro Histórico' }
      : isPointInPolygon(searched.coords, POLY_ZONA_2)
      ? { zone: 'ZONA2' as ZoneType, name: 'Anillo Exterior' }
      : { zone: null, name: 'Fuera de ZBE' }
    : null;

  const currentRule =
    zoneResult?.zone
      ? checkAccess(userLabel, isFuture, zoneResult.zone, isResident)
      : null;

  return (
    <div className="relative w-full h-150 rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-100">

      {/* PANEL FLOTANTE (solo aparece cuando hay búsqueda) */}
      {searched && zoneResult && (
        <div className="absolute top-4 right-4 z-1000 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-4 min-w-64 border border-slate-200 animate-in fade-in slide-in-from-top-2 duration-300">

          <div className="flex justify-between items-center mb-3">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Análisis
            </span>
            <span
              className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${
                isResident
                  ? 'bg-green-100 text-green-700'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              {isResident ? '🏠 RESIDENTE' : '🌍 VISITANTE'}
            </span>
          </div>

          <p className="font-bold text-slate-800 mb-1">{zoneResult.name}</p>

          {currentRule ? (
            <p
              className="text-xs font-semibold flex gap-2 items-center"
              style={{ color: currentRule.color }}
            >
              {currentRule.icon} {currentRule.message}
            </p>
          ) : (
            <p className="text-xs text-slate-500 italic">
              Área libre de restricciones
            </p>
          )}
        </div>
      )}

      {/* MAPA */}
      <MapContainer
        center={[36.7213, -4.4215]}
        zoom={14}
        className="h-full w-full"
        zoomControl={false}
      >
        <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />

        <Polygon
          positions={POLY_ZONA_2}
          eventHandlers={{
            mouseover: () => setHovered('ZONA2'),
            mouseout: () => setHovered(null),
          }}
          pathOptions={{
            fillColor:
              searched && zoneResult?.zone === 'ZONA2'
                ? checkAccess(userLabel, isFuture, 'ZONA2', isResident).color
                : '#cbd5e1',
            fillOpacity: hovered === 'ZONA2' ? 0.4 : 0.25,
            color: '#475569',
            weight: 1,
            dashArray: '8 6',
          }}
        >
          <Tooltip sticky>
            <b>Anillo Exterior</b>
            <br />
            {checkAccess(userLabel, isFuture, 'ZONA2', isResident).message}
          </Tooltip>
        </Polygon>

        <Polygon
          positions={POLY_ZONA_1}
          eventHandlers={{
            mouseover: () => setHovered('ZONA1'),
            mouseout: () => setHovered(null),
          }}
          pathOptions={{
            fillColor:
              searched && zoneResult?.zone === 'ZONA1'
                ? checkAccess(userLabel, isFuture, 'ZONA1', isResident).color
                : '#94a3b8',
            fillOpacity: hovered === 'ZONA1' ? 0.6 : 0.45,
            color: '#1e293b',
            weight: 2,
          }}
        >
          <Tooltip sticky>
            <b>Centro Histórico</b>
            <br />
            {checkAccess(userLabel, isFuture, 'ZONA1', isResident).message}
          </Tooltip>
        </Polygon>

        {searched && (
          <Marker position={searched.coords}>
            <Tooltip
              permanent
              direction="top"
              className="font-bold rounded-lg shadow-lg border-none p-2"
            >
              📍 {searched.address.split(',')[0]}
            </Tooltip>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};
