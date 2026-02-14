import { test, expect } from '@playwright/test';

const APP_URL = 'http://127.0.0.1:5173';

test.describe('Pruebas del Mapa ZBE Málaga (Leaflet)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${APP_URL}/malaga`);
    await page.waitForSelector('.leaflet-container', { timeout: 10000 });
  });
 test('debería cambiar el color de las zonas según la etiqueta calculada', async ({ page }) => {
  await page.goto('/');
  const configBtn = page.getByRole('button', { name: /configurar/i });
  if (await configBtn.isVisible()) {
    await configBtn.click();
  }
  await page.locator('select').nth(0).selectOption('diesel');
  await page.locator('select').nth(1).selectOption('2003');
  await page.locator('select').nth(2).selectOption('1');
  await page.getByRole('button', { name: /CALCULAR|calculate/i }).click();
  const zona1 = page.locator('.zona-centro-historico');
  await expect(zona1).toHaveAttribute('fill', '#dc2626', { timeout: 5000 });
  await page.locator('select').nth(0).selectOption('electric');
  await page.getByRole('button', { name: /CALCULAR|calculate/i }).click();
  await expect(zona1).toHaveAttribute('fill', '#16a34a');
});})