import { MapContainer, TileLayer, Polygon, Marker, Tooltip } from 'react-leaflet';
import type { LatLngTuple } from 'leaflet';
import { useState } from 'react';
import L from 'leaflet';
import { type Badge, checkAccess } from '../data/ZbeRules';
import { useTranslation } from 'react-i18next';

// Configuración de iconos de Leaflet para que no fallen los marcadores
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

// --- COORDENADAS AJUSTADAS AL PLANO DE MÁLAGA ---

// ZONA 1: Centro Histórico (Interior de Carretería, Álamos, Alcazabilla y Alameda)
const POLY_ZONA_1: LatLngTuple[] = [
  [36.7235, -4.4255], // Pasillo de Santa Isabel
  [36.7251, -4.4230], // Carretería (Inicio)
  [36.7245, -4.4190], // Álamos / Plaza de la Merced
  [36.7225, -4.4170], // Calle Victoria (Inicio)
  [36.7210, -4.4180], // Túnel de la Alcazaba
  [36.7200, -4.4200], // Plaza de la Marina / Cortina del Muelle
  [36.7195, -4.4235], // Alameda Principal (Sur)
  [36.7215, -4.4250], // Puente de los Alemanes
];

// ZONA 2: Anillo Exterior (Muelle Heredia, Paseo del Parque, Victoria, Capuchinos, Mármoles)
const POLY_ZONA_2: LatLngTuple[] = [
  [36.7175, -4.4270], // Av. de Andalucía / Tetuán
  [36.7160, -4.4220], // Muelle Heredia
  [36.7185, -4.4150], // Paseo de Reding / Malagueta
  [36.7240, -4.4130], // Túnel Alcazaba (Salida Este)
  [36.7270, -4.4160], // Calle Victoria / Cristo de la Epidemia
  [36.7290, -4.4220], // Alameda de Capuchinos
  [36.7280, -4.4270], // Calle Mármoles
  [36.7230, -4.4285], // Armengual de la Mota
  [36.7200, -4.4280], // Av. de la Aurora
];

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
  const { t } = useTranslation();
  const [hovered, setHovered] = useState<ZoneType | null>(null);

  // Reglas dinámicas por zona
  const ruleZona1 = checkAccess(userLabel, isFuture, 'ZONA1', isResident);
  const ruleZona2 = checkAccess(userLabel, isFuture, 'ZONA2', isResident);

  // Determinar en qué zona cae la búsqueda para el mensaje flotante
  const currentRule = externalSearch && checkAccess(userLabel, isFuture, 'ZONA1', isResident);

  return (
    <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-inner bg-slate-100">

      {/* Info de la búsqueda */}
      {externalSearch && currentRule && (
        <div className="absolute top-4 right-4 z-1000 bg-white/95 rounded-2xl p-4 shadow-xl border border-white animate-in fade-in zoom-in">
          <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none mb-1">
            Ubicación Seleccionada
          </p>
          <p className="text-sm font-bold text-slate-800">{externalSearch.address.split(',')[0]}</p>
          <div className="mt-2 flex items-center gap-2 font-bold text-xs" style={{ color: currentRule.color }}>
            <span>{currentRule.icon}</span>
            <span>{t(currentRule.messageKey)}</span>
          </div>
        </div>
      )}

      <MapContainer
        center={[36.7213, -4.4215]}
        zoom={14}
        className="h-full w-full"
        zoomControl={false}
      >
        <TileLayer 
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" 
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
        />

        {/* ZONA 2 (Se dibuja primero para que la 1 quede encima) */}
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
            dashArray: '5, 10' // Efecto punteado para el anillo exterior
          }}
        >
          <Tooltip sticky><b>{t('outerRing')}</b></Tooltip>
        </Polygon>

        {/* ZONA 1 (Centro Histórico) */}
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
            fillOpacity: hovered === 'ZONA1' ? 0.7 : 0.5 
          }}
        >
          <Tooltip sticky><b>{t('historicCenter')}</b></Tooltip>
        </Polygon>

        {/* MARCADOR DE CALLE BUSCADA */}
        {externalSearch && (
          <Marker position={externalSearch.coords}>
            <Tooltip permanent direction="top" offset={[0, -20]}>
              <span className="font-bold">📍 {externalSearch.address.split(',')[0]}</span>
            </Tooltip>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};