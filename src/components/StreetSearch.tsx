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

const MALAGA_BOUNDS = "-4.5539,36.7845,-4.3005,36.6596";

export const StreetSearch = ({ onStreetSelected }: Props) => {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<NominatimResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query.trim().length < 3) return;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      setLoading(true);
      const url = `https://nominatim.openstreetmap.org/search?` + 
        `format=json&q=${encodeURIComponent(query + ', Málaga')}&` +
        `viewbox=${MALAGA_BOUNDS}&bounded=1&addressdetails=1&limit=5`;

      fetch(url, { signal: controller.signal })
        .then((res) => res.json())
        .then((data) => {
          setResults(data);
          setLoading(false);
        })
        .catch((err) => {
          if (err.name !== 'AbortError') setLoading(false);
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

    setResults([]);
    setQuery(item.display_name.split(',')[0]);
    
    onStreetSelected([lat, lon], item.display_name);
  };

  return (
    <div className="relative">
      <label className="block text-xs font-black text-slate-400 uppercase mb-3 tracking-widest">
        {t('checkAddress')}
      </label>

      <div className="relative">
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (e.target.value.trim().length < 3) setResults([]);
          }}
          placeholder={t('streetPlaceholder')}
          className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 bg-slate-50 focus:border-emerald-500 focus:bg-white focus:outline-none transition-all shadow-sm text-sm"
        />
        <span className="absolute right-4 top-4 opacity-30">
          {loading ? '⏳' : '🔍'}
        </span>
      </div>

      {results.length > 0 && (
        <ul className="absolute z-3000 w-full mt-2 bg-white rounded-2xl border shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
          {results.map((r, i) => (
            <li
              key={i}
              onClick={() => handleSelect(r)}
              className="px-4 py-4 cursor-pointer hover:bg-emerald-50 border-b border-slate-50 last:border-0 transition-colors"
            >
              <p className="font-bold text-sm text-slate-700">
                {r.display_name.split(',')[0]}
              </p>
              <p className="text-[10px] text-slate-400 truncate">{r.display_name}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};