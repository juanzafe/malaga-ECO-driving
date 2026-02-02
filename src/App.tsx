import { useState } from 'react';
import 'leaflet/dist/leaflet.css';
import { VehicleChecker } from './components/VehicleChecker';
import { ZbeMap } from './components/ZbeMap';
import { StreetSearch } from './components/StreetSearch';
import type { Badge } from './data/ZbeRules';
import { useTranslation } from 'react-i18next';
import { LanguageToggle } from './components/LanguageToggle';
import { checkAccess } from './data/ZbeRules'; // Importante para la lógica del mensaje

function App() {
  const { t } = useTranslation();
  const [isFuture, setIsFuture] = useState(false);
  const [isResident, setIsResident] = useState(false);
  const [currentBadge, setCurrentBadge] = useState<Badge>(null);
  const [searchedLocation, setSearchedLocation] = useState<{
    coords: [number, number];
    address: string;
  } | null>(null);

  // Lógica para el mensaje de la calle seleccionada
  const currentRule = searchedLocation 
    ? checkAccess(currentBadge, isFuture, 'ZONA1', isResident) 
    : null;

  return (
    <div className="min-h-screen bg-linear-to-br from-emerald-50 via-teal-50 to-cyan-50 text-slate-900">

      <LanguageToggle />

      {/* HEADER */}
      <nav className="sticky top-0 z-50 bg-linear-to-r from-emerald-600 via-green-600 to-teal-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 backdrop-blur p-3 rounded-2xl">🌿</div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-white">
                {t('appName')}
              </h1>
              <span className="text-[10px] text-white/80 uppercase tracking-widest">
                {t('subtitle')}
              </span>
            </div>
          </div>
        </div>
      </nav>

      {/* TOGGLES */}
      <div className="sticky top-18 z-40 bg-white/90 backdrop-blur border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap gap-4 justify-between items-center">
          <button
            onClick={() => setIsResident(!isResident)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition ${
              isResident ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
            }`}
          >
            🏠 {isResident ? t('resident') : t('nonResident')}
          </button>

          <div className="flex items-center bg-slate-200 rounded-full p-1">
            <button
              onClick={() => setIsFuture(false)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition ${
                !isFuture ? 'bg-white shadow text-slate-900' : 'text-slate-500'
              }`}
            >
              {t('year2026')}
            </button>
            <button
              onClick={() => setIsFuture(true)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition ${
                isFuture ? 'bg-white shadow text-slate-900' : 'text-slate-500'
              }`}
            >
              {t('year2027')}
            </button>
          </div>
        </div>
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* COLUMNA DERECHA (Mapa y Buscador) */}
          <div className="lg:col-span-8 order-1 lg:order-2 flex flex-col gap-6">
            
            <div className="bg-white rounded-3xl p-6 shadow-xl border border-white">
              <StreetSearch
                isResident={isResident}
                isFuture={isFuture}
                userLabel={currentBadge}
                onStreetSelected={(coords, address) => setSearchedLocation({ coords, address })}
              />
              {/* RESULTADO DE LA CALLE (Lo que faltaba) */}
              {searchedLocation && currentRule && (
                <div className="mt-4 p-4 rounded-2xl border-l-4 animate-in fade-in slide-in-from-left-2" 
                     style={{ backgroundColor: `${currentRule.color}10`, borderColor: currentRule.color }}>
                  <p className="text-sm font-bold flex items-center gap-2" style={{ color: currentRule.color }}>
                    {currentRule.icon} {t(currentRule.messageKey)}
                  </p>
                  <p className="text-[10px] text-slate-500 mt-1 uppercase font-bold tracking-wider">
                    {searchedLocation.address}
                  </p>
                </div>
              )}
            </div>

            <div className="bg-white rounded-3xl p-2 shadow-xl border border-white overflow-hidden">
              <div className="relative h-[50vh] lg:h-125 z-0">
                <ZbeMap
                  isFuture={isFuture}
                  userLabel={currentBadge}
                  isResident={isResident}
                  externalSearch={searchedLocation}
                />
              </div>
            </div>
          </div>

          {/* COLUMNA IZQUIERDA (Vehículo) */}
          <div className="lg:col-span-4 order-2 lg:order-1">
            <div className="lg:sticky lg:top-40 space-y-6">
              <VehicleChecker
                isFuture={isFuture}
                isResident={isResident}
                onLabelCalculated={setCurrentBadge}
              />

              
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default App;