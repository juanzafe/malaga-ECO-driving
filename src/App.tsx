import { MobileBottomSheet } from './components/MobileBottomSheet'
import { useState } from 'react'
import 'leaflet/dist/leaflet.css'
import { VehicleChecker } from './components/VehicleChecker'
import { ZbeMap } from './components/ZbeMap'
import { StreetSearch } from './components/StreetSearch'
import type { Badge } from './data/ZbeRules'
import { useTranslation } from 'react-i18next'
import { checkAccess, getZoneFromCoords } from './data/ZbeRules'
import { Header } from './components/Header'
import type { Parking } from './types/Parking'
import { NearbyParkings } from './components/NearbyParkings'
import { useParams, Navigate, BrowserRouter, Routes, Route } from 'react-router-dom'
import { CITIES, type CityKey } from './config/cities'
import { CitySelector } from './components/Cityselector'


function CityView() {
  const { cityId } = useParams<{ cityId: string }>();
  const { t } = useTranslation();
  const cityConfig = CITIES[cityId as CityKey];
  
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [nearbyParkings, setNearbyParkings] = useState<Parking[]>([])
  const [isFuture, setIsFuture] = useState(false)
  const [isResident, setIsResident] = useState(false)
  const [currentBadge, setCurrentBadge] = useState<Badge>(null)
  const [searchedLocation, setSearchedLocation] = useState<{
    coords: [number, number]
    address: string
  } | null>(null)

  if (!cityConfig) return <Navigate to="/malaga" />;

  const currentRule = searchedLocation
    ? checkAccess(currentBadge, isFuture, getZoneFromCoords(searchedLocation.coords, cityId!), isResident, cityId!)
    : null

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-x-hidden">
      <Header
        isFuture={isFuture}
        isResident={isResident}
        setIsFuture={setIsFuture}
        setIsResident={setIsResident}
        cityName={cityConfig.name}
      />

      <main className="max-w-7xl mx-auto px-4 py-6 mb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="hidden lg:block lg:col-span-4">
            <VehicleChecker
              isFuture={isFuture}
              isResident={isResident}
              cityId={cityId!}
              onLabelCalculated={setCurrentBadge}
            />
          </div>

          <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="hidden lg:block bg-white/5 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/10 space-y-4">
              <StreetSearch
                isResident={isResident}
                isFuture={isFuture}
                userLabel={currentBadge}
                onStreetSelected={(coords, address) => {
                  setNearbyParkings([])
                  setSearchedLocation({ coords, address })
                }}
              />

              {searchedLocation && (
                <NearbyParkings
                  origin={searchedLocation.coords}
                  onParkingsLoaded={setNearbyParkings}
                  onParkingSelected={(parking) => {
                    setSearchedLocation({
                      coords: parking.coords,
                      address: parking.name,
                    })
                  }}
                />
              )}
            </div>

            <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-3 shadow-2xl border border-white/10 overflow-hidden relative">
              {searchedLocation && currentRule && !isSheetOpen && (
                <div className="lg:hidden absolute bottom-6 left-4 right-4 z-1001 pointer-events-none">
                  <div
                    className="bg-slate-800/95 backdrop-blur-md p-4 rounded-2xl shadow-2xl border-2 pointer-events-auto"
                    style={{ borderColor: currentRule.color }}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-black" style={{ color: currentRule.color }}>
                          {currentRule.icon} {t(currentRule.messageKey)}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-1 uppercase truncate max-w-50">
                          {searchedLocation.address.split(',')[0]}
                        </p>
                      </div>
                      <button
                        onClick={() => setSearchedLocation(null)}
                        className="bg-white/10 p-1.5 rounded-full text-slate-300 hover:bg-white/20 text-xs transition-all"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="relative h-[65vh] lg:h-150 z-0">
                <ZbeMap
                  cityCenter={cityConfig.coords}
                  cityZoom={cityConfig.zoom}
                  polygons={cityConfig.polygons}
                  isFuture={isFuture}
                  userLabel={currentBadge}
                  isResident={isResident}
                  cityId={cityId!}
                  externalSearch={searchedLocation}
                  externalParkings={nearbyParkings}
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 lg:hidden">
        <button
          onClick={() => setIsSheetOpen(true)}
          className="bg-linear-to-r from-emerald-500 to-teal-500 text-white px-8 py-3 rounded-full font-black shadow-2xl shadow-emerald-500/30 flex items-center gap-2 hover:scale-105 transition-transform"
        >
          ⚙️ {t('configure')}
        </button>
      </div>

      <MobileBottomSheet isOpen={isSheetOpen} setOpen={setIsSheetOpen}>
        <div className="space-y-8">
          <section>
            <h3 className="text-sm font-black text-slate-400 uppercase mb-4 tracking-widest">
              1. {t('vehicleData')}
            </h3>

            {searchedLocation && (
              <>
                <div className="mb-4">
                  <NearbyParkings
                    origin={searchedLocation.coords}
                    onParkingsLoaded={setNearbyParkings}
                    onParkingSelected={(parking) => {
                      setSearchedLocation({
                        coords: parking.coords,
                        address: parking.name,
                      })
                    }}
                  />
                </div>
                <div className="h-px bg-slate-100 mb-4" />
              </>
            )}

            <VehicleChecker
              isFuture={isFuture}
              isResident={isResident}
              cityId={cityId!}
              onLabelCalculated={setCurrentBadge}
            />
          </section>

          <div className="h-px bg-slate-100" />

          <section>
            <h3 className="text-sm font-black text-slate-400 uppercase mb-4 tracking-widest">
              2. {t('checkAddress')}
            </h3>
            <StreetSearch
              isResident={isResident}
              isFuture={isFuture}
              userLabel={currentBadge}
              onStreetSelected={(coords, address) => {
                setNearbyParkings([])
                setSearchedLocation({ coords, address })
                setIsSheetOpen(false)
              }}
            />
          </section>
        </div>
      </MobileBottomSheet>
    </div>
  );
}


function App() {
    return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CitySelector />} />
        <Route path="/:cityId" element={<CityView />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App