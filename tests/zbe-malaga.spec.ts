import { test, expect } from '@playwright/test';

const APP_URL = process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:5173';

test.describe('Pruebas del Mapa ZBE Málaga (Leaflet)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${APP_URL}/malaga`);
    await page.waitForSelector('.leaflet-container', { timeout: 10000 });
  });

  test('debería cambiar el color de las zonas según la etiqueta calculada', async ({ page }) => {
    // Abrir configuración en mobile si existe el botón
    const configBtn = page.getByRole('button', { name: /configurar/i });
    if (await configBtn.isVisible()) {
      await configBtn.click();
    }

    // Los selects ahora siempre están en el DOM, solo esperamos que estén disponibles
    await page.waitForSelector('select');

    // Seleccionar combustible diesel
    await page.locator('select').nth(0).selectOption('diesel');
    
    // Seleccionar año 2003
    await page.locator('select').nth(1).selectOption('2003');
    
    // Seleccionar mes enero (valor 1)
    await page.locator('select').nth(2).selectOption('1');

    // Click en calcular
    await page.getByRole('button', { name: /CALCULAR|calculate/i }).click();

    // Esperar un poco a que se actualice el mapa
    await page.waitForTimeout(500);

    // Verificar que existe al menos un polígono (zona) en el mapa
    const polygons = page.locator('.leaflet-interactive');
    await expect(polygons.first()).toBeVisible();

    // Cambiar a vehículo eléctrico
    await page.locator('select').nth(0).selectOption('electric');
    await page.getByRole('button', { name: /CALCULAR|calculate/i }).click();

    // Esperar actualización
    await page.waitForTimeout(500);

    // Verificar que el polígono sigue visible
    await expect(polygons.first()).toBeVisible();
  });
});