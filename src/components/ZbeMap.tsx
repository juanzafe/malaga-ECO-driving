import { MapContainer, TileLayer, Polygon, useMap, Marker, Popup } from 'react-leaflet';
import type { LatLngTuple, Control } from 'leaflet';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import { useEffect, useState } from 'react';
import L from 'leaflet';

import 'leaflet-geosearch/dist/geosearch.css';
import 'leaflet/dist/leaflet.css';

// Fix Iconos
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
const DefaultIcon = L.icon({ iconUrl: icon, shadowUrl: iconShadow, iconSize: [25, 41], iconAnchor: [12, 41] });
L.Marker.prototype.options.icon = DefaultIcon;

interface GeoSearchOptions {
  provider: OpenStreetMapProvider;
  style?: 'bar' | 'button';
  showMarker?: boolean;
  autoClose?: boolean;
  searchLabel?: string;
  keepResult?: boolean;
}

type GeoSearchControlConstructor = new (options: GeoSearchOptions) => Control;
interface GeoSearchResult { location: { x: string; y: string; label: string; }; }

// POLÍGONOS MÁLAGA (Afinados)
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

const isPointInPolygon = (point: LatLngTuple, vs: LatLngTuple[]) => {
    const x = point[0], y = point[1];
    let inside = false;
    for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        const xi = vs[i][0], yi = vs[i][1];
        const xj = vs[j][0], yj = vs[j][1];
        const intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    return inside;
};

const SearchField = ({ onLocationFound }: { onLocationFound: (coords: LatLngTuple, label: string) => void }) => {
  const map = useMap();
  useEffect(() => {
    const provider = new OpenStreetMapProvider({
      params: { 'accept-language': 'es', countrycodes: 'es', viewbox: '-4.5,36.6,-4.3,36.8' },
    });
    const SearchControl = GeoSearchControl as unknown as GeoSearchControlConstructor;
    const searchControl = new SearchControl({
      provider, style: 'bar', showMarker: false, autoClose: true,
      searchLabel: 'Escribe tu destino (ej: Calle Larios)', keepResult: true,
    });
    map.addControl(searchControl);
    const handleSearch = (result: unknown) => {
        const data = result as GeoSearchResult;
        onLocationFound([parseFloat(data.location.y), parseFloat(data.location.x)], data.location.label);
    };
    map.on('geosearch/showlocation', handleSearch);
    return () => { map.removeControl(searchControl); map.off('geosearch/showlocation', handleSearch); };
  }, [map, onLocationFound]);
  return null;
};

export const ZbeMap = ({ isFuture, userLabel }: { isFuture: boolean, userLabel: string | null }) => {
  const [searchedLocation, setSearchedLocation] = useState<{coords: LatLngTuple, address: string} | null>(null);
  const [streetStatus, setStreetStatus] = useState<'NONE' | 'ZONA1' | 'ZONA2' | 'OUTSIDE'>('NONE');

  const getRestrictionColor = (status: 'ZONA1' | 'ZONA2' | 'OUTSIDE') => {
      if (status === 'OUTSIDE') return '#22c55e';
      if (!userLabel) return '#94a3b8';
      if (status === 'ZONA1') {
          if (userLabel === 'CERO' || userLabel === 'ECO') return '#22c55e';
          if (userLabel === 'C') return '#eab308';
          return '#ef4444';
      }
      if (status === 'ZONA2') {
          if (userLabel === 'B' && isFuture) return '#f97316';
          if (userLabel === 'B') return '#eab308';
          if (userLabel === 'SIN') return '#ef4444';
          return '#22c55e';
      }
      return '#94a3b8';
  };

  const handleLocationFound = (coords: LatLngTuple, address: string) => {
      const status = isPointInPolygon(coords, POLY_ZONA_1) ? 'ZONA1' : isPointInPolygon(coords, POLY_ZONA_2) ? 'ZONA2' : 'OUTSIDE';
      setSearchedLocation({ coords, address });
      setStreetStatus(status);
  };

  const currentColor = streetStatus !== 'NONE' ? getRestrictionColor(streetStatus) : '#94a3b8';

  return (
    <div className="relative w-full h-150 rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-200">
      
      {/* PANEL INFORMATIVO (INTEGRADO) */}
      <div className="absolute bottom-6 left-4 right-4 z-1000 flex flex-col items-center pointer-events-none">
        {searchedLocation ? (
            <div className="bg-white p-5 rounded-2xl shadow-2xl w-full max-w-lg border-l-12 pointer-events-auto transition-all duration-500"
                 style={{ borderColor: currentColor }}>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Análisis de Ubicación</p>
                <h3 className="text-sm font-bold text-slate-800 truncate mb-3">{searchedLocation.address}</h3>
                
                <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-3xl">
                        {currentColor === '#ef4444' ? '⛔' : currentColor === '#eab308' ? '🅿️' : currentColor === '#f97316' ? '⚠️' : '✅'}
                    </span>
                    <div>
                        <p className="font-black text-lg leading-none mb-1" style={{ color: currentColor }}>
                            {currentColor === '#ef4444' ? 'ACCESO PROHIBIDO' : 
                             currentColor === '#eab308' ? 'OBLIGATORIO PARKING' : 
                             currentColor === '#f97316' ? 'SOLO RESIDENTES' : 'ACCESO PERMITIDO'}
                        </p>
                        <p className="text-xs text-slate-600 font-medium leading-tight">
                            {currentColor === '#ef4444' ? 'Si entras, la cámara te multará automáticamente.' : 
                             currentColor === '#eab308' ? '⚠️ Si no metes el coche en un parking subterráneo, te llegará multa. No puedes aparcar en la calle.' : 
                             currentColor === '#f97316' ? 'Prohibido el acceso excepto si estás empadronado aquí.' : 
                             'Puedes circular y aparcar en la calle libremente.'}
                        </p>
                    </div>
                </div>
            </div>
        ) : (
            <div className="bg-white/95 backdrop-blur px-6 py-2 rounded-full shadow-lg border border-slate-200 pointer-events-auto">
                <p className="text-xs text-slate-500 font-bold flex items-center gap-2">
                   <span>🔍</span> BUSCA UNA CALLE PARA ANALIZAR LAS RESTRICCIONES
                </p>
             </div>
        )}
      </div>

      <MapContainer 
  center={[36.7213, -4.4215]} 
  zoom={14} 
  className="h-full w-full" 
  zoomControl={false}
>
  <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
  
  <SearchField onLocationFound={handleLocationFound} />

  {/* ZONA 2: Borde negro fino con guiones para indicar área técnica */}
  <Polygon 
    positions={POLY_ZONA_2} 
    pathOptions={{ 
      fillColor: getRestrictionColor('ZONA2'), 
      fillOpacity: 0.2, 
      color: '#1e293b', // Azul grisáceo muy oscuro (casi negro)
      weight: 1, 
      dashArray: '5,5' 
    }} 
  />

  {/* ZONA 1: Borde negro sólido para delimitar el Centro Histórico */}
  <Polygon 
    positions={POLY_ZONA_1} 
    pathOptions={{ 
      fillColor: getRestrictionColor('ZONA1'), 
      fillOpacity: 0.4, 
      color: '#0f172a', // Negro pizarra
      weight: 1.5 
    }} 
  />

  {searchedLocation && (
    <Marker position={searchedLocation.coords}>
      <Popup><strong>{searchedLocation.address}</strong></Popup>
    </Marker>
  )}
</MapContainer>
    </div>
  );
};