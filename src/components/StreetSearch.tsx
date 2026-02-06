import { useEffect, useState, useRef } from 'react';
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

const MALAGA_BOUNDS = '-4.5539,36.7845,-4.3005,36.6596';

export const StreetSearch = ({ onStreetSelected }: Props) => {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<NominatimResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  const isManualChange = useRef(false);


  useEffect(() => {
    if (isManualChange.current) {
      isManualChange.current = false;
      return;
    }

    if (query.trim().length < 3) return;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      setLoading(true);

      const url =
        `https://nominatim.openstreetmap.org/search?` +
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

    isManualChange.current = true; 
    setResults([]);
    setQuery(item.display_name.split(',')[0]);

    onStreetSelected([lat, lon], item.display_name);
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setGpsError(t('location.notSupported'));
      return;
    }

    setGpsLoading(true);
    setGpsError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        isManualChange.current = true;
        setGpsLoading(false);
        setResults([]);
        setQuery(t('location.currentPosition'));

        onStreetSelected([latitude, longitude], t('location.currentPosition'));
      },
      () => {
        setGpsLoading(false);
        setGpsError(t('location.permissionDenied'));
      },
      { enableHighAccuracy: true }
    );
  };

  return (
    <div className="relative">
      <label className="mb-3 block text-xs font-black uppercase tracking-widest text-slate-400">
        {t('checkAddress')}
      </label>

      <div className="relative">
        <input
          value={query}
          onChange={(e) => {
            isManualChange.current = false;
            setQuery(e.target.value);
            if (e.target.value.trim().length < 3) setResults([]);
          }}
          placeholder={t('streetPlaceholder')}
          className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50 px-5 py-4 text-sm shadow-sm transition-all focus:border-emerald-500 focus:bg-white focus:outline-none"
        />
        <span className="absolute right-4 top-4 opacity-30">
          {loading ? '⏳' : '🔍'}
        </span>
      </div>

      <button
        type="button"
        onClick={handleUseCurrentLocation}
        disabled={gpsLoading}
        className="mt-3 flex cursor-pointer items-center gap-2 text-sm font-bold text-emerald-600 transition hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {gpsLoading ? '⏳' : '📍'} {t('location.useCurrent')}
      </button>

      {gpsError && (
        <p className="mt-2 text-xs font-medium text-red-500">{gpsError}</p>
      )}

      {results.length > 0 && (
        <ul className="absolute z-3000 mt-2 w-full animate-in fade-in zoom-in-95 overflow-hidden rounded-2xl border bg-white shadow-2xl">
          {results.map((r, i) => (
            <li
              key={i}
              onClick={() => handleSelect(r)}
              className="cursor-pointer border-b border-slate-50 px-4 py-4 transition-colors last:border-0 hover:bg-emerald-50"
            >
              <p className="text-sm font-bold text-slate-700">
                {r.display_name.split(',')[0]}
              </p>
              <p className="truncate text-[10px] text-slate-400">
                {r.display_name}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};