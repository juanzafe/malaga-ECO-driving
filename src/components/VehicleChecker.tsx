import { useState } from "react";
import { BadgeForm } from "./BadgeForm";
import { BadgeResult } from "./BadgeResult";

// Definimos el tipo de etiqueta para que sea consistente en toda la app
export type Badge = 'ECO' | 'CERO' | 'C' | 'B' | 'SIN' | null;

interface VehicleCheckerProps {
  isFuture: boolean;
  // Añadimos esta función para comunicar el resultado al App.tsx y de ahí al Mapa
  onLabelCalculated: (badge: Badge) => void;
}

export const VehicleChecker = ({ isFuture, onLabelCalculated }: VehicleCheckerProps) => {
  const [badge, setBadge] = useState<Badge>(null);
  const [fuel, setFuel] = useState('');
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');

  const calculateBadge = () => {
    const y = parseInt(year);
    const m = parseInt(month);

    if (!fuel || !year || !month) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    let result: Badge = null;

    if (fuel === 'electric') {
      result = 'CERO';
    } else if (fuel === 'hybrid') {
      result = 'ECO';
    } else if (fuel === 'gasoline') {
      if (y > 2006 || (y === 2006 && m >= 1)) {
        result = 'C';
      } else if (y > 2001 || (y === 2001 && m >= 1)) {
        result = 'B';
      } else {
        result = 'SIN';
      }
    } else if (fuel === 'diesel') {
      if (y > 2015 || (y === 2015 && m >= 9)) {
        result = 'C';
      } else if (y > 2006 || (y === 2006 && m >= 1)) {
        result = 'B';
      } else {
        result = 'SIN';
      }
    }

    // Guardamos localmente para mostrar el BadgeResult
    setBadge(result);
    // ENVIAMOS AL MAPA (vía App.tsx)
    onLabelCalculated(result);
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow-xl max-w-md mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Buscador de Distintivo</h2>
        {badge && (
           <button 
             onClick={() => { setBadge(null); onLabelCalculated(null); }}
             className="text-xs text-slate-400 underline"
           >
             Limpiar
           </button>
        )}
      </div>

      {isFuture && (
        <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 mb-4 animate-pulse">
          <p className="text-xs text-blue-700 font-bold">
            🔍 MODO SIMULACIÓN: RESTRICCIONES 2027
          </p>
        </div>
      )}

      <BadgeForm 
        onFuelChange={setFuel} 
        onYearChange={setYear} 
        onMonthChange={setMonth} 
        onCalculate={calculateBadge} 
      />
      
      <div className="mt-6 border-t pt-6">
        <BadgeResult badge={badge} isFuture={isFuture} />
      </div>
    </div>
  );
};