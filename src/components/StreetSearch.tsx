import { useEffect, useState } from 'react';
import type { Badge } from './VehicleChecker';
import { useTranslation } from 'react-i18next';

interface Props {
  onStreetSelected: (coords: [number, number], address: string) => void;
  isFuture: boolean;
  userLabel: Badge;
  isResident: boolean;
}

interface NominatimResult {
  lat: string;
  lon: string;
  display_name: string;
  type: string;
}

const ZBE_POLYGON: [number, number][] = [
  [-4.4249, 36.7219], [-4.4232, 36.7196], [-4.4201, 36.7174],
  [-4.4167, 36.7164], [-4.4129, 36.7169], [-4.4104, 36.7186],
  [-4.4098, 36.7211], [-4.4112, 36.7236], [-4.4145, 36.7252],
  [-4.4189, 36.7254], [-4.4226, 36.7241],
];

const MALAGA_BOUNDS = "-4.5539,36.7845,-4.3005,36.6596";

function isPointInPolygon([lat, lon]: [number, number], polygon: [number, number][]) {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i][1], yi = polygon[i][0];
    const xj = polygon[j][1], yj = polygon[j][0];
    const intersect = yi > lat !== yj > lat && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

export const StreetSearch = ({ onStreetSelected, isFuture, userLabel, isResident }: Props) => {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<NominatimResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<{
    name: string;
    type: string;
    insideZbe: boolean;
  } | null>(null);

  useEffect(() => {
    // Si la query es corta, no hacemos nada (el estado ya se limpia en onChange)
    if (query.trim().length < 3) return;

    const controller = new AbortController();

    const timeoutId = setTimeout(() => {
      setLoading(true);

      const url = `https://nominatim.openstreetmap.org/search?` + 
        `format=json&` +
        `q=${encodeURIComponent(query + ', Málaga')}&` +
        `viewbox=${MALAGA_BOUNDS}&` +
        `bounded=1&` +
        `addressdetails=1&` +
        `limit=5`;

      fetch(url, { signal: controller.signal })
        .then((res) => res.json())
        .then((data) => {
          setResults(data);
          setLoading(false);
        })
        .catch((err) => {
          if (err.name !== 'AbortError') {
            setLoading(false);
          }
        });
    }, 500);

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [query]);

  const handleSelect = (item: NominatimResult) => {
    const lat = parseFloat(item.lat);
    const lon = parseFloat(item.lon);
    const insideZbe = isPointInPolygon([lat, lon], ZBE_POLYGON);

    setSelected({
      name: item.display_name.split(',')[0],
      type: t(`streetType.${item.type}`, { defaultValue: t('streetType.residential') }),
      insideZbe,
    });

    setResults([]);
    setQuery(item.display_name.split(',')[0]);
    onStreetSelected([lat, lon], item.display_name);
  };

  const canAccess = () => {
    if (isResident) return true;
    if (!selected?.insideZbe) return true;
    if (!userLabel || userLabel === 'SIN') return false;
    
    if (!isFuture) {
      if (userLabel === 'B') return false;
      return true;
    }
    
    return userLabel === 'ECO' || userLabel === 'CERO';
  };

  return (
    <div className="relative">
      <label className="block text-sm font-semibold text-gray-600 mb-2">
        {t('checkAddress')}
      </label>

      <div className="relative">
        <input
          value={query}
          onChange={(e) => {
            const value = e.target.value;
            setQuery(value);
            setSelected(null);
            // Limpiamos resultados síncronamente aquí para evitar el error de React
            if (value.trim().length < 3) {
              setResults([]);
              setLoading(false);
            }
          }}
          placeholder={t('streetPlaceholder')}
          className="w-full px-5 py-3 rounded-xl border-2 border-slate-100 bg-slate-50 focus:border-emerald-500 focus:bg-white focus:outline-none transition-all shadow-sm"
        />
        <span className="absolute right-4 top-3.5 opacity-30">
          {loading ? '⏳' : '🔍'}
        </span>
      </div>

      {results.length > 0 && (
        <ul className="absolute z-2000 w-full mt-2 bg-white rounded-2xl border shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
          {results.map((r, i) => (
            <li
              key={i}
              onClick={() => handleSelect(r)}
              className="px-4 py-3 cursor-pointer hover:bg-emerald-50 border-b border-slate-50 last:border-0 transition-colors"
            >
              <p className="font-bold text-sm text-slate-700">
                {r.display_name.split(',')[0]}
              </p>
              <p className="text-[10px] text-slate-400 truncate">{r.display_name}</p>
            </li>
          ))}
        </ul>
      )}

      {selected && (
        <div className={`mt-4 p-4 rounded-2xl border-2 animate-in slide-in-from-top-2 ${
          canAccess() 
            ? 'bg-green-50 border-green-100' 
            : 'bg-red-50 border-red-100'
        }`}>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              {selected.type}
            </span>
            <p className="font-bold text-slate-800 text-sm">
              {selected.name}
            </p>
            <div className={`mt-2 flex items-center gap-2 text-sm font-bold ${
              canAccess() ? 'text-green-700' : 'text-red-700'
            }`}>
              <span>{canAccess() ? '✅' : '🚫'}</span>
              <span>{canAccess() ? t('streetAllowed') : t('streetForbidden')}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};