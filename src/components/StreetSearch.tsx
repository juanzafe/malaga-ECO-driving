import { useEffect, useState, useRef } from 'react';
import type { Badge } from './VehicleChecker';
import { useTranslation } from 'react-i18next';

interface Props {
  onStreetSelected: (coords: [number, number], address: string) => void;
  isFuture: boolean;
  userLabel: Badge;
  isResident: boolean;
  cityId: string;
}

interface NominatimResult {
  lat: string;
  lon: string;
  display_name: string;
  type: string;
}

const CITY_BOUNDS: Record<string, string> = {
  malaga: '-4.5539,36.7845,-4.3005,36.6596',
  madrid: '-3.8882,40.5868,-3.5179,40.3119',
  barcelona: '2.0536,41.4695,2.2280,41.3200'
};

const CITY_NAMES: Record<string, string> = {
  malaga: 'Málaga',
  madrid: 'Madrid',
  barcelona: 'Barcelona'
};

export const StreetSearch = ({ onStreetSelected, cityId }: Props) => {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<NominatimResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [isCurrentLocation, setIsCurrentLocation] = useState(false);

  const isManualChange = useRef(false);

  const cityBounds = CITY_BOUNDS[cityId] || CITY_BOUNDS.malaga;
  const cityName = CITY_NAMES[cityId] || 'Málaga';

  const displayQuery = isCurrentLocation ? t('location.currentPosition') : query;

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
        `format=json&q=${encodeURIComponent(query + ', ' + cityName)}&` +
        `viewbox=${cityBounds}&bounded=1&addressdetails=1&limit=5`;

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
  }, [query, cityBounds, cityName]);

  const handleSelect = (item: NominatimResult) => {
    const lat = parseFloat(item.lat);
    const lon = parseFloat(item.lon);

    isManualChange.current = true; 
    setResults([]);
    setIsCurrentLocation(false);
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
        setIsCurrentLocation(true);
        setQuery('');

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
      <label className="mb-3 block text-xs font-black uppercase tracking-widest text-slate-300">
        {t('checkAddress')}
      </label>

      <div className="relative">
        <input
          value={displayQuery}
          onChange={(e) => {
            isManualChange.current = false;
            setIsCurrentLocation(false);
            setQuery(e.target.value);
            if (e.target.value.trim().length < 3) setResults([]);
          }}
          placeholder={t('streetPlaceholder')}
          className="w-full rounded-2xl border-2 border-white/20 bg-white/10 backdrop-blur-md px-5 py-4 text-sm text-white placeholder-slate-400
                   shadow-lg transition-all focus:border-emerald-500/50 focus:bg-white/15 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
        />
        <span className="absolute right-4 top-4 text-slate-400">
          {loading ? '⏳' : '🔍'}
        </span>
      </div>

      <button
        type="button"
        onClick={handleUseCurrentLocation}
        disabled={gpsLoading}
        className="mt-3 flex cursor-pointer items-center gap-2 text-sm font-bold text-emerald-400 transition hover:text-emerald-300 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {gpsLoading ? '⏳' : '📍'} {t('location.useCurrent')}
      </button>

      {gpsError && (
        <p className="mt-2 text-xs font-medium text-red-400">{gpsError}</p>
      )}

      {results.length > 0 && (
        <ul className="absolute z-50 mt-2 w-full animate-in fade-in zoom-in-95 overflow-hidden rounded-2xl border border-white/20 bg-slate-800/95 backdrop-blur-xl shadow-2xl"
            style={{ zIndex: 10000 }}>
          {results.map((r, i) => (
            <li
              key={i}
              onClick={() => handleSelect(r)}
              className="cursor-pointer border-b border-white/10 px-4 py-4 transition-colors last:border-0 hover:bg-emerald-500/20"
            >
              <p className="text-sm font-bold text-white">
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