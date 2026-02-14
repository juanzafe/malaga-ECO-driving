import { type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  isOpen: boolean;
  setOpen: (open: boolean) => void;
}

export function MobileBottomSheet({ children, isOpen, setOpen }: Props) {
  return (
    <>
      {/* Overlay */}
      <div
        className={`lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setOpen(false)}
      />

      {/* Bottom Sheet */}
      <div
        className={`lg:hidden fixed inset-x-0 bottom-0 z-50 
                   bg-linear-to-b from-slate-800 to-slate-900 
                   rounded-t-3xl shadow-2xl border-t border-white/10
                   transition-transform duration-500 ease-in-out ${
          isOpen ? 'translate-y-0' : 'translate-y-[calc(100%-100px)]'
        }`}
        style={{ height: '85vh' }} 
      >
        {/* Handle */}
        <div 
          onClick={() => setOpen(!isOpen)}
          className="w-full flex flex-col items-center pt-4 pb-6 cursor-pointer touch-none"
        >
          <div className="h-1.5 w-16 rounded-full bg-white/30 mb-3 
                        hover:bg-white/40 transition-colors" />
          {!isOpen && (
            <div className="flex items-center gap-2">
              <span className="text-emerald-400 text-lg">⚙️</span>
              <p className="text-xs font-black text-slate-300 uppercase tracking-wider">
                Configurar Vehículo y Búsqueda
              </p>
            </div>
          )}
        </div>

        {/* Content - Siempre renderizado en el DOM para tests, pero oculto visualmente */}
        <div 
          className="px-6 pb-10 h-[calc(85vh-85px)] overflow-y-auto 
                     scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent"
          style={{ 
            visibility: isOpen ? 'visible' : 'hidden',
            pointerEvents: isOpen ? 'auto' : 'none'
          }}
        >
          {children}
        </div>
      </div>
    </>
  );
}