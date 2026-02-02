import 'leaflet/dist/leaflet.css';
import { useState } from 'react';
import { VehicleChecker } from './components/VehicleChecker';
import { ZbeMap } from './components/ZbeMap';
import { StreetSearch } from './components/StreetSearch';
import type { Badge } from './data/ZbeRules';

function App() {
  const [isFuture, setIsFuture] = useState(false);
  const [isResident, setIsResident] = useState(false);
  const [currentBadge, setCurrentBadge] = useState<Badge>(null);
  const [searchedLocation, setSearchedLocation] = useState<{
    coords: [number, number];
    address: string;
  } | null>(null);

  return (
    <div className="min-h-screen bg-linear-to-br from-emerald-50 via-teal-50 to-cyan-50 text-slate-900">

      {/* HEADER */}
      <nav className="sticky top-0 z-50 bg-linear-to-r from-emerald-600 via-green-600 to-teal-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 backdrop-blur p-3 rounded-2xl">
              🌿
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-white">
                Málaga<span className="text-emerald-200">Eco</span>
              </h1>
              <span className="text-[10px] text-white/80 uppercase tracking-widest">
                Zona de Bajas Emisiones
              </span>
            </div>
          </div>
        </div>
      </nav>

      {/* TOGGLES (móvil + desktop) */}
      <div className="sticky top-18 z-40 bg-white/90 backdrop-blur border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap gap-4 justify-between items-center">

          {/* Toggle residente */}
          <button
            onClick={() => setIsResident(!isResident)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition ${
              isResident
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-200 text-slate-600'
            }`}
          >
            🏠 {isResident ? 'Residente' : 'No residente'}
          </button>

          {/* Toggle año */}
          <div className="flex items-center bg-slate-200 rounded-full p-1">
            <button
              onClick={() => setIsFuture(false)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition ${
                !isFuture ? 'bg-white shadow text-slate-900' : 'text-slate-500'
              }`}
            >
              2026
            </button>
            <button
              onClick={() => setIsFuture(true)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition ${
                isFuture ? 'bg-white shadow text-slate-900' : 'text-slate-500'
              }`}
            >
              2027
            </button>
          </div>
        </div>
      </div>

      {/* CONTENIDO */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* MAPA */}
          <div className="lg:col-span-8 order-1 lg:order-2">
            <div className="bg-white rounded-3xl p-2 shadow-xl border border-white">
              <div className="relative h-[60vh] lg:h-125 z-0">
                <ZbeMap
                  isFuture={isFuture}
                  userLabel={currentBadge}
                  isResident={isResident}
                  externalSearch={searchedLocation}
                />
              </div>
            </div>

            <div className="mt-6 bg-white rounded-3xl p-6 shadow border">
              <StreetSearch
                isFuture={isFuture}
                userLabel={currentBadge}
                onStreetSelected={(coords, address) =>
                  setSearchedLocation({ coords, address })
                }
              />
            </div>
          </div>

          {/* VEHICLE CHECKER */}
          <div className="lg:col-span-4 order-2 lg:order-1">
            <div className="lg:sticky lg:top-40 space-y-6">
              <VehicleChecker
                isFuture={isFuture}
                isResident={isResident}
                onLabelCalculated={setCurrentBadge}
              />

              <div className="bg-white/70 backdrop-blur p-4 rounded-2xl border">
                <h4 className="text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">
                  Información oficial
                </h4>
                <p className="text-xs text-slate-500">
                  Restricciones activas de lunes a viernes (07:00–20:00).
                </p>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default App;
