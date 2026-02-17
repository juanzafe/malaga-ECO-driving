import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { LanguageToggle } from './LanguageToggle';

export const CitySelector = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [particles] = useState(() => 
    Array.from({ length: 20 }, () => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: 15 + Math.random() * 10,
      delay: Math.random() * 5
    }))
  );

  const cities = [
    {
      id: 'malaga',
      name: 'Málaga',
      icon: '🌴',
      gradient: 'from-emerald-500 via-teal-500 to-cyan-500',
      image: 'https://images.unsplash.com/photo-1601042879364-f3947d3f9c16?w=800&q=80',
      description: t('citySelector.malagaDesc'),
      stats: t('citySelector.malagaStats')
    },
    {
      id: 'madrid',
      name: 'Madrid',
      icon: '🏛️',
      gradient: 'from-blue-500 via-indigo-500 to-purple-500',
      image: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800&q=80',
      description: t('citySelector.madridDesc'),
      stats: t('citySelector.madridStats')
    },
    {
      id: 'barcelona',
      name: 'Barcelona',
      icon: '🏖️',
      gradient: 'from-pink-500 via-rose-500 to-red-500',
      image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800&q=80',
      description: t('citySelector.barcelonaDesc'),
      stats: t('citySelector.barcelonaStats')
    }
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">

      <LanguageToggle variant="dark" />
      
      <div className="fixed inset-0 opacity-10">
        <div className="absolute inset-0" 
             style={{
               backgroundImage: `radial-gradient(circle at 25% 25%, rgba(16, 185, 129, 0.4) 0%, transparent 50%), 
                                radial-gradient(circle at 75% 75%, rgba(59, 130, 246, 0.4) 0%, transparent 50%)`
             }} />
      </div>

      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full opacity-20"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              animation: `float ${particle.duration}s ease-in-out infinite`,
              animationDelay: `${particle.delay}s`
            }}
          />
        ))}
      </div>

      <header className="bg-white/5 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="text-center space-y-3">
            <h1 className="text-5xl lg:text-6xl font-black tracking-tight bg-clip-text text-transparent bg-linear-to-r from-emerald-400 via-teal-400 to-blue-400">
              {t('citySelector.title')}
            </h1>
            <p className="text-sm text-slate-300 font-semibold tracking-widest uppercase">
              {t('subtitle')}
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-20">
        
        <div className="text-center mb-20 space-y-6">
          
          <h2 className="text-4xl lg:text-3xl font-black text-white leading-tight">
            {t('heroDescription')}
          </h2>

        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-24">
          {cities.map((city, idx) => (
            <button
              key={city.id}
              onClick={() => navigate(`/${city.id}`)}
              style={{ animationDelay: `${idx * 200}ms` }}
              className="group relative rounded-3xl overflow-hidden
                         transition-all duration-700 hover:scale-105
                         animate-[fadeInUp_0.8s_ease-out_forwards] opacity-0
                         shadow-2xl hover:shadow-emerald-500/20"
            >
              <div className="absolute inset-0">
                <img 
                  src={city.image} 
                  alt={city.name}
                  className="w-full h-full object-cover opacity-40 group-hover:opacity-60 
                           transition-opacity duration-700 group-hover:scale-110 transform"
                />
                <div className={`absolute inset-0 bg-linear-to-br ${city.gradient} opacity-60 
                               group-hover:opacity-80 transition-opacity duration-700`} />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent" />
              </div>

              <div className="relative z-10 p-10 h-80 flex flex-col justify-between">
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-7xl transform group-hover:scale-125 group-hover:rotate-12 
                                  transition-all duration-500">
                      {city.icon}
                    </div>
                    <div className="text-left">
                      <h3 className="text-4xl font-black text-white mb-1 
                                   group-hover:text-emerald-300 transition-colors duration-500">
                        {city.name}
                      </h3>
                      <p className="text-white/80 font-medium text-sm">
                        {city.description}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-full 
                                   bg-white/20 backdrop-blur-md border border-white/30
                                   text-white font-black text-sm uppercase tracking-widest
                                   shadow-lg group-hover:bg-white/30 transition-all duration-500`}>
                      <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-lg shadow-emerald-400/50"></span>
                      {city.stats}
                    </div>

                    <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20
                                  flex items-center justify-center
                                  transform group-hover:bg-white/20 group-hover:translate-x-2 
                                  transition-all duration-500">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} 
                              d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </div>
                  </div>

                  <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                    <div className={`h-full bg-linear-to-r ${city.gradient} 
                                   transform origin-left scale-x-0 group-hover:scale-x-100 
                                   transition-transform duration-1000`} />
                  </div>
                </div>
              </div>

              <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700
                             bg-linear-to-r ${city.gradient} blur-3xl -z-10`} />
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { 
              icon: '🚙', 
              title: t('citySelector.vehicleTitle'), 
              desc: t('citySelector.vehicleDesc'),
              color: 'from-emerald-500 to-teal-500'
            },
            { 
              icon: '📍', 
              title: t('citySelector.searchTitle'), 
              desc: t('citySelector.searchDesc'),
              color: 'from-blue-500 to-cyan-500'
            },
            { 
              icon: '🅿️', 
              title: t('citySelector.parkingTitle'), 
              desc: t('citySelector.parkingDesc'),
              color: 'from-purple-500 to-pink-500'
            }
          ].map((item, idx) => (
            <div 
              key={idx}
              style={{ animationDelay: `${(idx * 100) + 600}ms` }}
              className="group bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10
                       hover:bg-white/10 hover:border-white/20 transition-all duration-500
                       hover:scale-105 hover:shadow-2xl
                       animate-[fadeInUp_0.8s_ease-out_forwards] opacity-0"
            >
              <div className={`w-16 h-16 rounded-2xl bg-linear-to-br ${item.color} 
                             flex items-center justify-center text-3xl mb-5
                             transform group-hover:scale-110 group-hover:rotate-6 
                             transition-all duration-500 shadow-lg`}>
                {item.icon}
              </div>
              <h4 className="font-black text-white mb-3 text-xl">
                {item.title}
              </h4>
              <p className="text-slate-300 leading-relaxed text-sm">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </main>

      <footer className="mt-32 pb-16 text-center">
        <div className="inline-block px-8 py-4 bg-white/5 backdrop-blur-xl rounded-full 
                      border border-white/10">
          <p className="text-sm text-slate-300 font-medium">
            ✨ {t('citySelector.footer')}
          </p>
        </div>
      </footer>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
      `}</style>
    </div>
  );
};