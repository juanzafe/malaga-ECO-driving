# 🚗 ZBE Spain Checker: Smart Zone Navigator
A practical, interactive tool designed to help drivers navigate the Low Emission Zones (ZBE) across Spanish cities. This app translates complex environmental legislation into a simple, location-based interactive experience to help users avoid fines.
<p align="center">
  <img src="src/assets/Animationzbe2.gif" alt="ZBE España Demo" width="600">
</p>

---

## 🌟 The Problem & The Solution
Low Emission Zones are confusing. Drivers often don't know which "Label" they have, nor do they want to read through official government PDFs to find out if they can enter a specific street.
**ZBE Spain Checker** provides immediate clarity. By simply entering a vehicle's year and fuel type, the app gives you a "Yes/No" answer based on your exact location and the current (or future) laws.

### 🚀 Core Features
* **Multi-City Support:** The app now covers three major Spanish cities — **Málaga**, **Madrid**, and **Barcelona** — each with their own zone polygons, specific restriction rules, and city-specific parking data. The architecture is designed to make adding new cities straightforward.
* **Smart Label Calculator:** Don't know your label? No problem. Enter your car's registration year and fuel type, and the app automatically determines your environmental sticker and the specific rules that apply to you. Results are displayed as a **visual zone-by-zone access breakdown** (Zone 1 / Zone 2) with clear allowed/parking-only/forbidden indicators.
* **Interactive Map & Geolocation:** Visualize the exact boundaries of each city's zones. Using your phone's GPS, the app can tell you in real-time if your current location or a specific destination is restricted. Map polygons include **hover tooltips** showing live access status based on your vehicle.
* **Future-Proof Planning (2026/2027):** Rules change over time. The app includes a "Future Mode" to see how restrictions will tighten in 2026 and 2027, specifically handling the different rules for **residents**.
* **Smart Parking Finder:** If access is restricted for your vehicle, the app automatically queries the **OpenStreetMap (Overpass) API** to find the nearest public parking lots. When no address is selected, a contextual hint guides the user to search first.
* **Bilingual Support:** Fully accessible in **English and Spanish**, with a persistent language toggle available on every screen including the city selector landing page.
* **Responsive Layout:** Optimised two-column layout on desktop with the map as the dominant element, sticky alongside a scrollable left panel. On mobile, a bottom sheet keeps the interface clean with the map always visible.
* **CI/CD Pipeline:** Automated build, type-check, lint and deploy to **Firebase Hosting** on every push to main via GitHub Actions.

---

## 🧪 Reliability & Testing (Vitest + Playwright)
Because traffic fines are at stake, accuracy is non-negotiable. The project uses two testing layers:
* **Vitest** for unit tests on the restriction algorithms, ensuring that the complex logic involving vehicle age, fuel types, residency status, city-specific rules, and current/future dates is accurate and bug-free.
* **Playwright** for end-to-end tests covering the full user flow across browsers (Chrome, Firefox, WebKit).

---

## 🛠️ Tech Stack
* **Frontend:** `React 19`, `TypeScript`, `Tailwind CSS`.
* **Maps:** `Leaflet` & `React-Leaflet` for polygon rendering.
* **Routing:** `React Router v6` for multi-city navigation.
* **Testing:** `Vitest` + `Playwright` for logic verification and E2E coverage.
* **Data Sources:** `Overpass API` (OpenStreetMap) for live parking data, `Nominatim` for address search.
* **Localization:** `i18next` with full ES/EN support.
* **CI/CD:** `GitHub Actions` + `Firebase Hosting`.

---

## ⚙️ Installation & Setup
1. **Clone the repository:**
   ```bash
   git clone https://github.com/juanzafe/zbe-malaga-checker.git
2. **Install dependencies:** `npm install`
3. **Run Logic test:** `npm run test`
4. **Run Development Mode:** `npm run dev`

**Developed by Juan Zamudio – Real solutions for everyday professional problems.**
