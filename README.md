# ZBE Málaga Checker 🚗

Una herramienta interactiva para saber si puedes entrar con tu coche en las nuevas Zonas de Bajas Emisiones (ZBE) de Málaga.

El proyecto ayuda a los conductores a evitar multas consultando las restricciones actuales y las que entrarán en vigor en 2026 y 2027, dependiendo de su etiqueta ambiental y si son residentes.

## Lo que hace la App:

- **Mapa interactivo:** Visualiza los límites exactos de la ZONA 1 y ZONA 2 de Málaga mediante polígonos sobre el mapa.
- **Calculadora de acceso:** Dices qué etiqueta tienes y si eres residente, y la app te dice si tienes el paso permitido, restringido o prohibido.
- **Buscador de parkings:** Si buscas una dirección y no puedes entrar, la app consulta automáticamente la API de OpenStreetMap (Overpass) y te muestra los parkings públicos más cercanos.
- **Modo futuro:** Puedes ver cómo cambiarán las reglas en enero de 2026 para planificarte con antelación.
- **Diseño móvil:** Interfaz pensada para usarse cómodamente desde el móvil con paneles deslizables.

## Tecnologías que he usado:

- **React 18** y **TypeScript** para toda la estructura y lógica.
- **Leaflet** y **React-Leaflet** para la gestión del mapa y las zonas.
- **Tailwind CSS** para un diseño limpio y rápido.
- **i18next** para tener la app tanto en español como en inglés.
- **Overpass API** para obtener datos de parkings en tiempo real.

## Instalación:

Si quieres probarlo en local, solo tienes que clonar el repo y lanzarlo:

1. `git clone https://github.com/juanzafe/nombre-de-tu-repo.git`
2. `npm install`
3. `npm run dev`

---

Hecho por **Juan Zamudio** - Frontend Developer.
