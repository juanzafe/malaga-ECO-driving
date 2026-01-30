interface Props {
  onFuelChange: (val: string) => void;
  onYearChange: (val: string) => void;
  onMonthChange: (val: string) => void;
  onCalculate: () => void;
}

export const BadgeForm = ({ onFuelChange, onYearChange, onMonthChange, onCalculate }: Props) => {
  const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  
  // Generamos el array de años: [2026, 2025, ..., 1980]
  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - 1980 + 1 }, 
    (_, i) => currentYear - i
  );

  return (
    <div className="space-y-5">
      {/* Selector de Motor */}
      <div>
        <label className="block text-sm font-semibold text-gray-600 mb-1">Tipo de Motor</label>
        <select 
          onChange={(e) => onFuelChange(e.target.value)}
          className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all"
        >
          <option value="">Selecciona motor...</option>
          <option value="gasoline">Gasolina</option>
          <option value="diesel">Diésel</option>
          <option value="hybrid">Híbrido / Gas</option>
          <option value="electric">Eléctrico</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Selector de AÑO (Actualizado) */}
        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-1">Año</label>
          <select 
            onChange={(e) => onYearChange(e.target.value)}
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
          >
            <option value="">Año...</option>
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        {/* Selector de MES */}
        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-1">Mes</label>
          <select 
            onChange={(e) => onMonthChange(e.target.value)}
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
          >
            <option value="">Mes...</option>
            {months.map((m, i) => (
              <option key={m} value={i + 1}>{m}</option>
            ))}
          </select>
        </div>
      </div>

      <button 
        onClick={onCalculate}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl shadow-md shadow-green-200 transition-all active:scale-95"
      >
        Calcular Etiqueta
      </button>
    </div>
  );
};