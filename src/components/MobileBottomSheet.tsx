import { type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  isOpen: boolean;
  setOpen: (open: boolean) => void;
}

export function MobileBottomSheet({ children, isOpen, setOpen }: Props) {
  return (
    <>
      <div
        className={`lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setOpen(false)}
      />

      <div
        className={`lg:hidden fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-4xl shadow-[0_-8px_30px_rgba(0,0,0,0.15)] transition-transform duration-500 ease-in-out ${
          isOpen ? 'translate-y-0' : 'translate-y-[calc(100%-85px)]'
        }`}
        style={{ height: '80vh' }} 
      >
        <div 
          onClick={() => setOpen(!isOpen)}
          className="w-full flex flex-col items-center pt-3 pb-5 cursor-pointer touch-none"
        >
          <div className="h-1.5 w-12 rounded-full bg-slate-300 mb-2" />
          {!isOpen && (
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
              Configurar Vehículo y Búsqueda
            </p>
          )}
        </div>

        <div className="px-6 pb-10 h-[calc(80vh-70px)] overflow-y-auto">
          {children}
        </div>
      </div>
    </>
  );
}