import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
  resources: {
    es: {
      translation: {
        // App
        appName: 'Málaga Eco',
        subtitle: 'Zona de Bajas Emisiones',

        // Toggles
        resident: 'Residente',
        nonResident: 'No residente',
        year2026: '2026',
        year2027: '2027',

        months: {
          january: "Enero", february: "Febrero", march: "Marzo", april: "Abril",
          may: "Mayo", june: "Junio", july: "Julio", august: "Agosto",
          september: "Septiembre", october: "Octubre", november: "Noviembre", december: "Diciembre"
        },

        // Hero
        heroTitle: 'Verificador de Acceso ZBE',
        heroDescription: 'Consulta las restricciones actuales y futuras para evitar sanciones.',

        // Map
        historicCenter: 'Centro Histórico',
        outerRing: 'Anillo Exterior',
        outsideZbe: 'Fuera de la ZBE',

        // Search
        checkAddress: 'Comprobar una dirección',
        searchPlaceholder: 'Introduce una calle de Málaga',
        streetPlaceholder: "Ej: Larios, Constitución…",
        streetAllowed: "✅ Acceso permitido según la normativa vigente",
        streetForbidden: "⛔ Acceso prohibido según la normativa vigente",
        streetType: {
          residential: "Calle",
          pedestrian: "Calle peatonal",
          footway: "Pasaje",
          square: "Plaza",
          road: "Vía"
        },

        // --- Mensajes de la lógica checkAccess ---
        selectBadge: 'Selecciona una etiqueta para verificar el acceso',
        residentAccess: 'Acceso permitido por ser residente empadronado.',
        noResidentForbidden: 'Acceso prohibido para no residentes con esta etiqueta.',
        parkingRequiredAll: 'Aparcamiento obligatorio en toda la ZBE para acceder.',
        parkingCenter: 'Acceso libre al Anillo, pero parking obligatorio en el Centro.',
        freeOuterRing: 'Acceso libre al Anillo Exterior.',
        freeAccess: 'Acceso libre sin restricciones.',

        // Descripciones detalladas
        residentBadgeDesc: "✅ Al estar empadronado en Málaga, tienes permiso para circular por toda la ZBE sin restricciones.",
        ecoBadgeDesc: "Puedes circular y aparcar en cualquier zona de Málaga sin restricciones.",
        cBadgeTodayDesc: "✅ HOY: Acceso libre al Anillo, pero en el Centro es obligatorio aparcar en parking público.",
        cBadgeFutureDesc: "🅿️ EN 2027: Solo podrás entrar a la ZBE si vas directamente a un parking público.",
        bBadgeTodayDesc: "🚫 ACCESO RESTRINGIDO: Si no eres residente, ya no puedes circular por la ZBE con etiqueta B.",
        bBadgeFutureDesc: "🚫 PROHIBIDO: En 2027 los vehículos B de no residentes tienen prohibido el acceso total.",
        sinBadgeDesc: "🚫 ACCESO DENEGADO: Vehículos sin etiqueta tienen prohibida la entrada. Multa: 200€.",

        // Vehicle & Finder
        fuelType: "Tipo de Motor",
        selectFuel: "Selecciona motor...",
        engineGasoline: "Gasolina",
        engineDiesel: "Diésel",
        engineHybrid: "Híbrido / Gas",
        engineElectric: "Eléctrico",
        registrationYear: "Año de matriculación",
        selectYear: "Año...",
        registrationMonth: "Mes",
        selectMonth: "Mes...",
        calculate: "Calcular Etiqueta",
        vehicleData: 'Datos del vehículo',
        badgeFinder: "Buscador de distintivo",
        clear: "Limpiar",
        fillAllFields: "Por favor, completa todos los campos",

        // Misc
        freeArea: 'Área libre de restricciones',
      },
    },
    en: {
      translation: {
        // App
        appName: 'Malaga Eco',
        subtitle: 'Low Emission Zone',

        // Toggles
        resident: 'Resident',
        nonResident: 'Non-resident',
        year2026: '2026',
        year2027: '2027',

        months: {
          january: "January", february: "February", march: "March", april: "April",
          may: "May", june: "June", july: "July", august: "August",
          september: "September", october: "October", november: "November", december: "December"
        },

        // Hero
        heroTitle: 'LEZ Access Checker',
        heroDescription: 'Check current and future restrictions to avoid fines.',

        // Map
        historicCenter: 'Historic Center',
        outerRing: 'Outer Ring',
        outsideZbe: 'Outside LEZ',

        // Search
        checkAddress: 'Check an address',
        searchPlaceholder: 'Enter a street in Malaga',
        streetPlaceholder: "e.g., Larios, Constitucion...",
        streetAllowed: "✅ Access allowed according to current regulations",
        streetForbidden: "⛔ Access forbidden according to current regulations",
        streetType: {
          residential: "Street",
          pedestrian: "Pedestrian street",
          footway: "Passage",
          square: "Square",
          road: "Road"
        },

        // --- checkAccess Logic Messages ---
        selectBadge: 'Select a badge to verify access',
        residentAccess: 'Access allowed as a registered resident.',
        noResidentForbidden: 'Access forbidden for non-residents with this badge.',
        parkingRequiredAll: 'Mandatory parking required in the entire LEZ to enter.',
        parkingCenter: 'Free access to the Ring, but mandatory parking in the Center.',
        freeOuterRing: 'Free access to the Outer Ring.',
        freeAccess: 'Free access without restrictions.',

        // Detailed Descriptions
        residentBadgeDesc: "✅ As a registered resident in Malaga, you have permission to drive through the entire LEZ without restrictions.",
        ecoBadgeDesc: "You can drive and park in any area of Malaga without restrictions.",
        cBadgeTodayDesc: "✅ TODAY: Free access to the Outer Ring, but in the Historic Center, public parking is mandatory.",
        cBadgeFutureDesc: "🅿️ IN 2027: You can only enter the LEZ if you go directly to a public car park.",
        bBadgeTodayDesc: "🚫 RESTRICTED ACCESS: If you are not a resident, you can no longer drive in the LEZ with a B label.",
        bBadgeFutureDesc: "🚫 FORBIDDEN: In 2027, non-resident B vehicles are completely banned.",
        sinBadgeDesc: "🚫 ACCESS DENIED: Vehicles without a label are prohibited from entering. Fine: €200.",

        // Vehicle & Finder
        fuelType: "Engine Type",
        selectFuel: "Select engine...",
        engineGasoline: "Gasoline",
        engineDiesel: "Diesel",
        engineHybrid: "Hybrid / Gas",
        engineElectric: "Electric",
        registrationYear: "Registration Year",
        selectYear: "Year...",
        registrationMonth: "Month",
        selectMonth: "Month...",
        calculate: "Calculate Badge",
        vehicleData: 'Vehicle data',
        badgeFinder: "Badge finder",
        clear: "Clear",
        fillAllFields: "Please fill in all fields",

        // Misc
        freeArea: 'Free access area',
      },
    },
  },
  lng: localStorage.getItem('lang') || 'es',
  fallbackLng: 'es',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;