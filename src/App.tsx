import 'leaflet/dist/leaflet.css';
import { useState } from 'react';
import { VehicleChecker, type Badge } from './components/VehicleChecker';
import { ZbeMap } from './components/ZbeMap';

function App() {
  const [isFuture, setIsFuture] = useState(false);
  const [currentBadge, setCurrentBadge] = useState<Badge | null>(null);

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

          <a
            href="https://share.google/vwqs4NhY5conk1T0m"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-white/20 backdrop-blur px-5 py-2.5 rounded-full text-xs font-bold text-white uppercase tracking-wider hover:bg-white/30 transition"
          >
            📄 Normativa PDF
          </a>
        </div>
      </nav>

      {/* HERO */}
      <section className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-8">
        <div>
          <h2 className="text-4xl md:text-5xl font-black bg-linear-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Estado de la ZBE Málaga
          </h2>
          <p className="text-slate-600 mt-3 text-lg">
            Consulta si puedes circular y evita multas innecesarias 🚗
          </p>
        </div>

        {/* TOGGLE */}
        <div className="flex items-center gap-4 bg-white/70 backdrop-blur p-4 rounded-3xl border border-emerald-200 shadow-xl">
          <span className={`text-sm font-bold ${!isFuture ? 'text-emerald-600 scale-110' : 'text-slate-400'}`}>
            🌞 Hoy
          </span>

          <button
            onClick={() => setIsFuture(!isFuture)}
            className={`relative w-20 h-10 rounded-full transition-all duration-500 shadow-inner ${
              isFuture
                ? 'bg-linear-to-r from-blue-500 to-cyan-500'
                : 'bg-linear-to-r from-emerald-500 to-green-500'
            }`}
          >
            <div
              className={`absolute top-1 w-8 h-8 bg-white rounded-full shadow-lg transition-transform ${
                isFuture ? 'translate-x-11' : 'translate-x-1'
              } flex items-center justify-center`}
            >
              {isFuture ? '🔮' : '✅'}
            </div>
          </button>

          <span className={`text-sm font-bold ${isFuture ? 'text-blue-600 scale-110' : 'text-slate-400'}`}>
            🔮 2026+
          </span>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-6">
        {/* INFO */}
        <section
          className={`mb-10 p-8 rounded-3xl border-2 shadow-xl backdrop-blur transition ${
            isFuture
              ? 'bg-blue-500/10 border-blue-300'
              : 'bg-emerald-500/10 border-emerald-300'
          }`}
        >
          <h3 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2">
            {isFuture ? '📅 Prohibiciones Futuras' : '📅 Normativa Actual'}
          </h3>

          <div className="grid md:grid-cols-3 gap-6">
            {isFuture ? (
              <>
                <Card emoji="📆" title="Fase 2026" color="blue">
                  Etiqueta <b>B</b> solo podrá acceder si aparca en parking público.
                </Card>
                <Card emoji="🚫" title="Fase 2027" color="red">
                  Etiqueta <b>B</b> prohibida. Etiqueta <b>C</b> solo con parking.
                </Card>
                <Card emoji="🌱" title="Libre acceso" color="green">
                  Vehículos <b>ECO</b> y <b>CERO</b> sin restricciones.
                </Card>
              </>
            ) : (
              <>
                <Card emoji="✅" title="Con Etiqueta" color="green">
                  B, C, ECO y CERO pueden circular libremente.
                </Card>
                <Card emoji="⛔" title="Sin Etiqueta" color="red">
                  Prohibido el acceso si no eres residente.
                </Card>
                <Card emoji="⚠️" title="Avisos" color="orange">
                  Las multas automáticas comenzarán pronto.
                </Card>
              </>
            )}
          </div>
        </section>

        {/* MAP + CHECKER */}
        <div className="grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4 sticky top-32">
            <div className="bg-white/90 backdrop-blur rounded-3xl shadow-2xl border border-emerald-200 overflow-hidden">
              <div className="bg-linear-to-r from-emerald-600 to-green-600 text-white text-center font-black text-xs uppercase tracking-widest py-4">
                🔍 Verificador de vehículo
              </div>
              <div className="p-6">
                <VehicleChecker
                  isFuture={isFuture}
                  onLabelCalculated={(badge) => setCurrentBadge(badge)}
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-8">
            <ZbeMap isFuture={isFuture} userLabel={currentBadge} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;

/* COMPONENTE TARJETA */
function Card({
  emoji,
  title,
  color,
  children,
}: {
  emoji: string;
  title: string;
  color: 'green' | 'blue' | 'red' | 'orange';
  children: React.ReactNode;
}) {
  const colors: Record<string, string> = {
    green: 'text-emerald-600 border-emerald-200',
    blue: 'text-blue-600 border-blue-200',
    red: 'text-red-600 border-red-200',
    orange: 'text-orange-600 border-orange-200',
  };

  return (
    <div className={`bg-white/80 backdrop-blur p-6 rounded-2xl border shadow hover:scale-105 transition ${colors[color]}`}>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-2xl">{emoji}</span>
        <span className="font-black text-sm uppercase">{title}</span>
      </div>
      <p className="text-sm text-slate-700 leading-relaxed">{children}</p>
    </div>
  );
}
