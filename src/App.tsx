import 'leaflet/dist/leaflet.css';
import { useState } from 'react';
import { VehicleChecker } from './components/VehicleChecker';
import { ZbeMap } from './components/ZbeMap';
import { StreetSearch } from './components/StreetSearch';
import type { Badge } from './data/ZbeRules';

function App() {
  const [isFuture, setIsFuture] = useState(false);
  const [isResident, setIsResident] = useState(false); // Control de empadronamiento
  const [currentBadge, setCurrentBadge] = useState<Badge>(null);
  const [searchedLocation, setSearchedLocation] = useState<{
    coords: [number, number];
    address: string;
  } | null>(null);

  return (
    <div className="min-h-screen bg-linear-to-br from-emerald-50 via-teal-50 to-cyan-50 font-['Inter',sans-serif] text-slate-900 pb-24">

      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 bg-linear-to-r from-emerald-600 via-green-600 to-teal-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 backdrop-blur p-3 rounded-2xl shadow-md">
              <span className="text-2xl">🌿</span>
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-white">
                Málaga<span className="text-emerald-200">Eco</span>
              </h1>
              <span className="text-[10px] text-white/80 uppercase tracking-widest font-semibold">
                Zona de Bajas Emisiones
              </span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            {/* SWITCH RESIDENTE (EMPADRONADO) */}
            <label className="flex items-center cursor-pointer gap-3 bg-white/10 px-4 py-2 rounded-full hover:bg-white/20 transition border border-white/10 shadow-inner">
              <span className="text-[10px] font-black text-white uppercase tracking-wider">
                🏠 ¿Empadronado en Málaga?
              </span>
              <div className="relative">
                <input 
                  type="checkbox" 
                  className="sr-only" 
                  checked={isResident} 
                  onChange={() => setIsResident(!isResident)} 
                />
                <div className={`block w-10 h-6 rounded-full transition ${isResident ? 'bg-emerald-400' : 'bg-white/30'}`}></div>
                <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${isResident ? 'translate-x-4' : ''}`}></div>
              </div>
            </label>

            {/* TOGGLE AÑO (SIMULACIÓN) */}
            <div className="flex items-center gap-3 bg-black/20 backdrop-blur px-4 py-2.5 rounded-full border border-white/20">
              <span className={`text-xs font-bold transition ${!isFuture ? 'text-white' : 'text-white/50'}`}>
                2026
              </span>
              <button
                onClick={() => setIsFuture(!isFuture)}
                className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
                  isFuture ? 'bg-blue-400' : 'bg-white/40'
                }`}
              >
                <div
                  className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
                    isFuture ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                />
              </button>
              <span className={`text-xs font-bold transition ${isFuture ? 'text-white' : 'text-white/50'}`}>
                2027
              </span>
            </div>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-12 text-center md:text-left">
        <h2 className="text-4xl md:text-5xl font-black bg-linear-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent">
          Verificador de Acceso ZBE
        </h2>
        <p className="text-slate-600 mt-3 text-lg max-w-2xl font-medium">
          {isResident 
            ? "Modo Residente activo: Tienes acceso total a las zonas restringidas de Málaga Capital. 🏠" 
            : "Consulta las restricciones actuales y futuras para evitar sanciones de 200€. 🚗"}
        </p>
      </section>

      <main className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-12 gap-10">
          
          {/* COLUMNA IZQUIERDA: BUSCADOR Y RESULTADOS */}
          <div className="lg:col-span-4 space-y-6">
            <div className="sticky top-32">
              <VehicleChecker
                isFuture={isFuture}
                isResident={isResident} // Se pasa para la lógica de mensajes
                onLabelCalculated={(badge) => setCurrentBadge(badge)}
              />
              
              <div className="mt-8 bg-white/60 backdrop-blur p-4 rounded-2xl border border-slate-200">
                <h4 className="text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Información Oficial</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Las restricciones de la ZBE de Málaga se aplican de lunes a viernes (07:00 a 20:00). Los festivos están exentos de regulación por ahora.
                </p>
              </div>
            </div>
          </div>

          {/* COLUMNA DERECHA: MAPA Y BÚSQUEDA DE CALLES */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-[2.5rem] p-2 shadow-2xl border border-white">
              <ZbeMap
                isFuture={isFuture}
                userLabel={currentBadge}
                isResident={isResident} // Se pasa para la lógica de colores del mapa
                externalSearch={searchedLocation}
              />
            </div>

            <div className="bg-white/90 backdrop-blur rounded-3xl shadow-xl border border-emerald-100 p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="p-2 bg-emerald-100 rounded-lg text-emerald-600">📍</span>
                <h4 className="text-xs font-black uppercase tracking-widest text-slate-700">
                  Comprobar una dirección específica
                </h4>
              </div>

              <StreetSearch
                isFuture={isFuture}
                userLabel={currentBadge}
                onStreetSelected={(coords, address) =>
                  setSearchedLocation({ coords, address })
                }
              />
            </div>
          </div>

        </div>
      </main>
      
      {/* FOOTER / INFO CARDS (Opcional, al final) */}
      <footer className="max-w-7xl mx-auto px-6 mt-16 grid md:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <span className="text-2xl mb-2 block">📋</span>
            <h5 className="font-bold text-sm mb-1 uppercase tracking-tight">Registro de Matrículas</h5>
            <p className="text-xs text-slate-500">Si eres residente, asegúrate de que tu coche esté registrado en el padrón municipal para evitar multas automáticas.</p>
          </div>
          <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <span className="text-2xl mb-2 block">🅿️</span>
            <h5 className="font-bold text-sm mb-1 uppercase tracking-tight">Parkings Municipales</h5>
            <p className="text-xs text-slate-500">Los coches con etiqueta C pueden acceder al centro siempre que el destino final sea un parking público concertado.</p>
          </div>
          <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <span className="text-2xl mb-2 block">🚨</span>
            <h5 className="font-bold text-sm mb-1 uppercase tracking-tight">Sanciones</h5>
            <p className="text-xs text-slate-500">El acceso no autorizado a las zonas restringidas conlleva una sanción grave de 200 euros.</p>
          </div>
      </footer>
    </div>
  );
}

export default App;