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
import { ParkingHint } from './components/ParkingHint'
import { useParams, Navigate, BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
import { CITIES, type CityKey } from './config/cities'
import { CitySelector } from './components/Cityselector'


function CityView() {
  const { cityId } = useParams<{ cityId: string }>();
  const navigate = useNavigate();
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          <div className="hidden lg:flex flex-col gap-4">

            <VehicleChecker
              isFuture={isFuture}
              isResident={isResident}
              cityId={cityId!}
              onLabelCalculated={setCurrentBadge}
            />

            <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-5 shadow-2xl border border-white/10 space-y-4 relative z-1000">
              <StreetSearch
                isResident={isResident}
                isFuture={isFuture}
                userLabel={currentBadge}
                cityId={cityId!}
                onStreetSelected={(coords, address) => {
                  setNearbyParkings([])
                  setSearchedLocation({ coords, address })
                }}
              />

              {searchedLocation ? (
                <NearbyParkings
                  cityId={cityId!}
                  origin={searchedLocation.coords}
                  onParkingsLoaded={setNearbyParkings}
                  onParkingSelected={(parking) => {
                    setSearchedLocation({
                      coords: parking.coords,
                      address: parking.name,
                    })
                  }}
                />
              ) : (
                <ParkingHint />
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24">
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

                <div className="relative h-[65vh] lg:h-[calc(100vh-10rem)] z-0">
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

        </div>
      </main>

  
      <div className="fixed bottom-6 left-6 z-9998">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 bg-slate-800/90 backdrop-blur-xl border border-white/10
                     hover:bg-slate-700/90 hover:border-white/20 hover:scale-105
                     text-white px-4 py-3 rounded-full shadow-2xl
                     transition-all duration-300 group"
        >
          <svg className="w-4 h-4 text-emerald-400 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="text-xs font-black uppercase tracking-widest text-slate-300 group-hover:text-white transition-colors">
            {t('citySelector.selectCity')}
          </span>
        </button>
      </div>

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

            {searchedLocation ? (
              <>
                <div className="mb-4">
                  <NearbyParkings
                    cityId={cityId!}
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
            ) : (
              <div className="mb-4">
                <ParkingHint />
              </div>
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
              cityId={cityId!}
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