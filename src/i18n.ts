import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
  resources: {
    es: {
      translation: {
        appName: 'Málaga Eco',
        subtitle: 'Zona de Bajas Emisiones',
        resident: 'Residente',
        nonResident: 'No residente',
        year2026: '2026',
        year2027: '2027',
        configure: 'Configurar vehículo',
        
        citySelector: {
          title: 'Calculadora ZBE',
          selectCity: 'Volver',
          malagaDesc: 'Costa del Sol',
          malagaStats: '2 zonas ZBE activas',
          madridDesc: 'Capital de España',
          madridStats: 'Madrid Central + ZBE',
          barcelonaDesc: 'Ciudad Condal',
          barcelonaStats: 'ZBE Rondas + Zona Especial',
          valenciaDesc: 'Ciudad de las Artes',
          valenciaStats: 'ZBE + APR Ciutat Vella',
          vehicleTitle: 'Tu vehículo',
          vehicleDesc: 'Calcula la etiqueta ambiental según año y combustible',
          searchTitle: 'Busca calles',
          searchDesc: 'Comprueba si puedes acceder a una dirección específica',
          parkingTitle: 'Parkings',
          parkingDesc: 'Encuentra parkings públicos cercanos a tu destino',
          footer: 'Información actualizada según normativas 2025-2027'
        },
        
        months: {
          january: "Enero", february: "Febrero", march: "Marzo", april: "Abril",
          may: "Mayo", june: "Junio", july: "Julio", august: "Agosto",
          september: "Septiembre", october: "Octubre", november: "Noviembre", december: "Diciembre"
        },
        location: {
          useCurrent: "Usar mi ubicación actual",
          currentPosition: "Tu ubicación actual",
          permissionDenied: "No se ha podido acceder a tu ubicación",
          notSupported: "Tu navegador no soporta geolocalización"
        },
        heroTitle: 'Verificador de Acceso ZBE',
        heroDescription: 'Consulta las restricciones actuales y futuras para evitar sanciones.',
        historicCenter: 'Centro Histórico',
        outerRing: 'Anillo Exterior',
        outsideZbe: 'Fuera de la ZBE',
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

        selectBadge: 'Selecciona una etiqueta para verificar el acceso',
        freeAccess: 'Acceso libre sin restricciones',
        parkingRequiredAll: 'Parking obligatorio en toda la ZBE',
        parkingCenterOnly: 'Parking obligatorio en el Centro',
        forbiddenCenterB: 'Prohibido acceder al Centro',
        forbiddenEverywhere: 'Acceso prohibido a la ZBE',

        badgeResult: {
          accessByZone: 'Acceso por zona',
          zone1: 'Zona 1 · Centro',
          zone2: 'Zona 2 · Exterior',
          statusAllowed: 'Acceso libre',
          statusParking: 'Solo con parking',
          statusForbidden: 'Prohibido',
        },
        
        mapTooltip: {
          zone1: 'ZONA 1 - CENTRO',
          zone2: 'ZONA 2',
          selectVehicle: 'Selecciona tu vehículo',
          accessAllowed: '✅ Acceso permitido',
          parkingRequired: '🅿️ Parking obligatorio',
          accessForbidden: '⛔ Acceso prohibido',
          outsideZone: '🌍 Fuera de ZBE',
          seeRestrictions: 'Ver restricciones'
        },
        
        residentAccess: 'Acceso permitido por ser residente empadronado.',
        noResidentForbidden: 'Acceso prohibido para no residentes con esta etiqueta.',
        parkingCenter: 'Acceso libre al Anillo, pero parking obligatorio en el Centro.',
        freeOuterRing: 'Acceso libre al Anillo Exterior.',

        residentBadgeDesc: "✅ Al estar empadronado, tienes permiso para circular por toda la ZBE sin restricciones.",
        ecoBadgeDesc: "Puedes circular y aparcar en cualquier zona sin restricciones.",
        cBadgeTodayDesc: "✅ HOY: Acceso libre al Anillo, pero en el Centro es obligatorio aparcar en parking público.",
        cBadgeFutureDesc: "🅿️ EN 2027: Solo podrás entrar a la ZBE si vas directamente a un parking público.",
        bBadgeTodayDesc: "🚫 ACCESO RESTRINGIDO: Si no eres residente, ya no puedes circular por la ZBE con etiqueta B.",
        bBadgeFutureDesc: "🚫 PROHIBIDO: En 2027 los vehículos B de no residentes tienen prohibido el acceso total.",
        sinBadgeDesc: "🚫 ACCESO DENEGADO: Vehículos sin etiqueta tienen prohibida la entrada. Multa: 200€.",

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
        directions: "Cómo llegar",
        fillAllFields: "Por favor, completa todos los campos",
        appTagline: "Comprueba si tu vehículo puede acceder a una zona ZBE",
        configuration: 'Configurar vehículo y búsqueda',
        freeArea: 'Área libre de restricciones',
        parkingHint: {
          title: '¿Necesitas aparcar cerca?',
          desc: 'Introduce una dirección en el buscador y te mostraremos los parkings públicos más cercanos a tu destino.',
        },
        parking: {
          publicParking: 'Parking público',
        },
        privacy: {
          title: 'Mensaje de privacidad',
          description: 'Usamos cookies para recordar tus preferencias y mejorar tu experiencia.',
          accept: 'Aceptar y continuar',
          reject: 'Rechazar',
          learnMore: 'Ver política de privacidad',
          note: 'No cargaremos el contenido hasta que aceptes las cookies.',
        },
      },
    },
    en: {
      translation: {
        appName: 'Malaga Eco',
        subtitle: 'Low Emission Zone',
        resident: 'Resident',
        nonResident: 'Non-resident',
        year2026: '2026',
        year2027: '2027',
        configure: 'Configure vehicle',
        
        citySelector: {
          title: 'LEZ Calculator',
          selectCity: 'Go Back',
          malagaDesc: 'Costa del Sol',
          malagaStats: '2 active LEZ zones',
          madridDesc: 'Capital of Spain',
          madridStats: 'Madrid Central + LEZ',
          barcelonaDesc: 'Catalan Capital',
          barcelonaStats: 'Rondas LEZ + Special Zone',
          valenciaDesc: 'City of Arts & Sciences',
          valenciaStats: 'LEZ + APR Ciutat Vella',
          vehicleTitle: 'Your vehicle',
          vehicleDesc: 'Calculate environmental badge based on year and fuel',
          searchTitle: 'Search streets',
          searchDesc: 'Check if you can access a specific address',
          parkingTitle: 'Parking',
          parkingDesc: 'Find public parking near your destination',
          footer: 'Information updated according to 2025-2027 regulations'
        },
        
        months: {
          january: "January", february: "February", march: "March", april: "April",
          may: "May", june: "June", july: "July", august: "August",
          september: "September", october: "October", november: "November", december: "December"
        },
        location: {
          useCurrent: "Use my current location",
          currentPosition: "Your current location",
          permissionDenied: "We couldn't access your location",
          notSupported: "Your browser doesn't support geolocation"
        },

        heroTitle: 'LEZ Access Checker',
        heroDescription: 'Check current and future restrictions to avoid fines.',
        historicCenter: 'Historic Center',
        outerRing: 'Outer Ring',
        outsideZbe: 'Outside LEZ',
        checkAddress: 'Check an address',
        searchPlaceholder: 'Enter a street',
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

        selectBadge: 'Select a badge to verify access',
        freeAccess: 'Free access without restrictions',
        parkingRequiredAll: 'Mandatory parking required in entire LEZ',
        parkingCenterOnly: 'Mandatory parking in Center',
        forbiddenCenterB: 'Forbidden in Center',
        forbiddenEverywhere: 'Access forbidden to LEZ',

        badgeResult: {
          accessByZone: 'Access by zone',
          zone1: 'Zone 1 · Center',
          zone2: 'Zone 2 · Outer ring',
          statusAllowed: 'Free access',
          statusParking: 'Parking only',
          statusForbidden: 'Forbidden',
        },

        mapTooltip: {
          zone1: 'ZONE 1 - CENTER',
          zone2: 'ZONE 2',
          selectVehicle: 'Select your vehicle',
          accessAllowed: '✅ Access allowed',
          parkingRequired: '🅿️ Parking required',
          accessForbidden: '⛔ Access forbidden',
          outsideZone: '🌍 Outside LEZ',
          seeRestrictions: 'See restrictions'
        },

        residentAccess: 'Access allowed as a registered resident.',
        noResidentForbidden: 'Access forbidden for non-residents with this badge.',
        parkingCenter: 'Free access to the Ring, but mandatory parking in the Center.',
        freeOuterRing: 'Free access to the Outer Ring.',

        residentBadgeDesc: "✅ As a registered resident, you have permission to drive through the entire LEZ without restrictions.",
        ecoBadgeDesc: "You can drive and park in any area without restrictions.",
        cBadgeTodayDesc: "✅ TODAY: Free access to the Outer Ring, but in the Historic Center, public parking is mandatory.",
        cBadgeFutureDesc: "🅿️ IN 2027: You can only enter the LEZ if you go directly to a public car park.",
        bBadgeTodayDesc: "🚫 RESTRICTED ACCESS: If you are not a resident, you can no longer drive in the LEZ with a B label.",
        bBadgeFutureDesc: "🚫 FORBIDDEN: In 2027, non-resident B vehicles are completely banned.",
        sinBadgeDesc: "🚫 ACCESS DENIED: Vehicles without a label are prohibited from entering. Fine: €200.",

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
        directions: "Get Directions",
        fillAllFields: "Please fill in all fields",
        appTagline: "Check if your vehicle can access a low-emission zone",
        configuration: "Vehicle & Search Settings",
        freeArea: 'Free access area',
        parkingHint: {
          title: 'Need to park nearby?',
          desc: 'Enter an address in the search bar and we\'ll show you the nearest public car parks to your destination.',
        },
        parking: {
          publicParking: 'Public parking',
        },
        privacy: {
          title: 'Privacy notice',
          description: 'We use cookies to remember your preferences and improve your experience.',
          accept: 'Accept and continue',
          reject: 'Reject',
          learnMore: 'View privacy policy',
          note: 'We will not load the content until you accept the cookies.',
        },
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