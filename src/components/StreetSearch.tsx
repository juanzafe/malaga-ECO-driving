import { useEffect, useState } from 'react';
import type { Badge } from './VehicleChecker';

interface Props {
  onStreetSelected: (coords: [number, number], address: string) => void;
  isFuture: boolean;
  userLabel: Badge;
}

interface NominatimResult {
  lat: string;
  lon: string;
  display_name: string;
  type: string;
}

/* =======================
   POLÍGONO REAL ZBE MÁLAGA
======================= */
const ZBE_POLYGON: [number, number][] = [
  [-4.4249, 36.7219],
  [-4.4232, 36.7196],
  [-4.4201, 36.7174],
  [-4.4167, 36.7164],
  [-4.4129, 36.7169],
  [-4.4104, 36.7186],
  [-4.4098, 36.7211],
  [-4.4112, 36.7236],
  [-4.4145, 36.7252],
  [-4.4189, 36.7254],
  [-4.4226, 36.7241],
];

function isPointInPolygon(
  [lat, lon]: [number, number],
  polygon: [number, number][]
) {
  let inside = false;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i][1],
      yi = polygon[i][0];
    const xj = polygon[j][1],
      yj = polygon[j][0];

    const intersect =
      yi > lat !== yj > lat &&
      lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi;

    if (intersect) inside = !inside;
  }

  return inside;
}

export const StreetSearch = ({
  onStreetSelected,
  isFuture,
  userLabel,
}: Props) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<NominatimResult[]>([]);
  const [selected, setSelected] = useState<{
    name: string;
    type: string;
    insideZbe: boolean;
  } | null>(null);

  /* FETCH SOLO CUANDO HAY TEXTO SUFICIENTE */
  useEffect(() => {
    if (query.trim().length < 3) return;

    const controller = new AbortController();

    fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        query + ', Málaga, España'
      )}&limit=5`,
      { signal: controller.signal }
    )
      .then((res) => res.json())
      .then(setResults)
      .catch(() => {});

    return () => controller.abort();
  }, [query]);

  const formatType = (type: string) => {
    switch (type) {
      case 'residential':
        return 'Calle';
      case 'pedestrian':
        return 'Calle peatonal';
      case 'footway':
        return 'Pasaje';
      case 'square':
        return 'Plaza';
      default:
        return 'Vía';
    }
  };

  const handleSelect = (item: NominatimResult) => {
    const lat = parseFloat(item.lat);
    const lon = parseFloat(item.lon);

    const insideZbe = isPointInPolygon([lat, lon], ZBE_POLYGON);

    setSelected({
      name: item.display_name.split(',')[0],
      type: formatType(item.type),
      insideZbe,
    });

    setResults([]);
    onStreetSelected([lat, lon], item.display_name);
  };

  const canAccess = () => {
    if (!selected || !selected.insideZbe) return true;
    if (!userLabel) return false;

    if (!isFuture) return userLabel !== null;
    return userLabel === 'ECO' || userLabel === 'CERO';
  };

  return (
    <div>
      <input
        value={query}
        onChange={(e) => {
          const value = e.target.value;
          setQuery(value);
          setSelected(null);

          if (value.trim().length < 3) {
            setResults([]);
          }
        }}
        placeholder="Ej: Mármoles, Larios, Constitución…"
        className="w-full px-5 py-3 rounded-2xl border-2 border-emerald-200 focus:border-emerald-500 focus:outline-none"
      />

      {results.length > 0 && (
        <ul className="mt-2 bg-white rounded-2xl border shadow-lg overflow-hidden">
          {results.map((r, i) => (
            <li
              key={i}
              onClick={() => handleSelect(r)}
              className="px-4 py-3 cursor-pointer hover:bg-emerald-50 border-b last:border-0"
            >
              <p className="font-semibold text-sm">
                {formatType(r.type)} · {r.display_name.split(',')[0]}
              </p>
              <p className="text-xs text-slate-500">{r.display_name}</p>
            </li>
          ))}
        </ul>
      )}

      {selected && (
        <div className="mt-4 p-4 rounded-2xl border bg-slate-50">
          <p className="font-black text-sm mb-1">
            📍 {selected.type} {selected.name}
          </p>

          {!selected.insideZbe ? (
            <p className="text-green-700 text-sm">
              ✅ Fuera de la ZBE. Acceso permitido sin restricciones.
            </p>
          ) : (
            <p
              className={`text-sm font-semibold ${
                canAccess() ? 'text-green-700' : 'text-red-700'
              }`}
            >
              {canAccess()
                ? '✅ Puedes circular según la ordenanza municipal vigente.'
                : '⛔ Acceso prohibido según la ordenanza municipal vigente.'}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
