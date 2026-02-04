import { MobileBottomSheet } from './components/MobileBottomSheet';
import { useEffect, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import { VehicleChecker } from './components/VehicleChecker';
import { ZbeMap } from './components/ZbeMap';
import { StreetSearch } from './components/StreetSearch';
import type { Badge } from './data/ZbeRules';
import { useTranslation } from 'react-i18next';
import { LanguageToggle } from './components/LanguageToggle';
import { checkAccess } from './data/ZbeRules';

function App() {
  const { t } = useTranslation();
  const consentButtonRef = useRef<HTMLButtonElement | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [privacyConsent, setPrivacyConsent] = useState<'accepted' | 'rejected' | null>(() => {
    const cookie = document.cookie.split('; ').find((entry) => entry.startsWith('privacy_consent='));
    const value = cookie?.split('=')[1];
    return (value === 'accepted' || value === 'rejected') ? value : null;
  });

  const [isFuture, setIsFuture] = useState(false);
  const [isResident, setIsResident] = useState(false);
  const [currentBadge, setCurrentBadge] = useState<Badge>(null);
  const [searchedLocation, setSearchedLocation] = useState<{
    coords: [number, number];
    address: string;
  } | null>(null);

  useEffect(() => {
    if (privacyConsent === null) consentButtonRef.current?.focus();
  }, [privacyConsent]);

  const setPrivacyCookie = (value: 'accepted' | 'rejected') => {
    document.cookie = `privacy_consent=${value}; max-age=31536000; path=/; samesite=lax`;
    setPrivacyConsent(value);
  };

  const currentRule = searchedLocation 
    ? checkAccess(currentBadge, isFuture, 'ZONA1', isResident) 
    : null;

  if (privacyConsent === null) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 space-y-6">
          <h2 className="text-2xl font-black">{t('privacy.title')}</h2>
          <button ref={consentButtonRef} onClick={() => setPrivacyCookie('accepted')} className="w-full py-3 bg-emerald-600 text-white rounded-full font-bold">
            {t('privacy.accept')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 overflow-x-hidden">
      <LanguageToggle />

      <nav className="sticky top-0 z-50 bg-emerald-600 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center text-white">
          <h1 className="text-xl font-black uppercase tracking-tight">{t('appName')}</h1>
        </div>
      </nav>

      <div className="sticky top-17 z-40 bg-white/80 backdrop-blur border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center gap-2">
          <button
            onClick={() => setIsResident(!isResident)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
              isResident ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
            }`}
          >
            🏠 {isResident ? t('resident') : t('nonResident')}
          </button>
          <div className="flex bg-slate-200 rounded-full p-1">
            <button onClick={() => setIsFuture(false)} className={`px-4 py-1 rounded-full text-xs font-bold ${!isFuture ? 'bg-white shadow' : ''}`}>2026</button>
            <button onClick={() => setIsFuture(true)} className={`px-4 py-1 rounded-full text-xs font-bold ${isFuture ? 'bg-white shadow' : ''}`}>2027</button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-6 mb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="hidden lg:block lg:col-span-4">
            <VehicleChecker isFuture={isFuture} isResident={isResident} onLabelCalculated={setCurrentBadge} />
          </div>

          <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="hidden lg:block bg-white rounded-3xl p-6 shadow-sm border">
              <StreetSearch
                isResident={isResident}
                isFuture={isFuture}
                userLabel={currentBadge}
                onStreetSelected={(coords, address) => setSearchedLocation({ coords, address })}
              />
            </div>

            <div className="bg-white rounded-4xl p-2 shadow-xl border overflow-hidden">
              <div className="relative h-[65vh] lg:h-150 z-0">
                <ZbeMap isFuture={isFuture} userLabel={currentBadge} isResident={isResident} externalSearch={searchedLocation} />
              </div>
            </div>
          </div>
        </div>
      </main>

      <MobileBottomSheet isOpen={isSheetOpen} setOpen={setIsSheetOpen}>
        <div className="space-y-8">
          <section>
             <h3 className="text-sm font-black text-slate-400 uppercase mb-4 tracking-widest">
               1. {t('vehicleData')}
             </h3>
             <VehicleChecker
                isFuture={isFuture}
                isResident={isResident}
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
                setSearchedLocation({ coords, address });
                setTimeout(() => setIsSheetOpen(false), 800);
              }}
            />
            {searchedLocation && currentRule && (
                <div className="mt-4 p-5 rounded-2xl border-l-4 bg-slate-50 shadow-inner" style={{ borderColor: currentRule.color }}>
                  <p className="text-base font-bold" style={{ color: currentRule.color }}>
                    {currentRule.icon} {t(currentRule.messageKey)}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-2 uppercase">{searchedLocation.address}</p>
                </div>
            )}
          </section>
        </div>
      </MobileBottomSheet>
    </div>
  );
}

export default App;