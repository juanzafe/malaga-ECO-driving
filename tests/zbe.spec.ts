import { test, expect, type Page } from '@playwright/test';

const APP_URL = process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:5173';

const badgeTitle = (page: Page, text: string) =>
  page.locator('.text-3xl.font-black').filter({ hasText: new RegExp(`^${text}$`) });

test.describe('VehicleChecker – badge calculation', () => {
  const cities = ['malaga', 'madrid', 'barcelona'];

  for (const city of cities) {
    test.describe(`City: ${city}`, () => {
      test.beforeEach(async ({ page }) => {
        await page.goto(`${APP_URL}/${city}`);
        await page.waitForSelector('select');
      });

      test('electric → CERO badge', async ({ page }) => {
        await page.locator('select').nth(0).selectOption('electric');
        await page.locator('select').nth(1).selectOption('2022');
        await page.locator('select').nth(2).selectOption('6');
        await page.getByRole('button', { name: /CALCULAR|calculate/i }).click({ force: true });

        await expect(badgeTitle(page, 'CERO')).toBeVisible();
      });

      test('hybrid → ECO badge', async ({ page }) => {
        await page.locator('select').nth(0).selectOption('hybrid');
        await page.locator('select').nth(1).selectOption('2020');
        await page.locator('select').nth(2).selectOption('3');
        await page.getByRole('button', { name: /CALCULAR|calculate/i }).click({ force: true });

        await expect(badgeTitle(page, 'ECO')).toBeVisible();
      });

      test('gasoline 2010 → C badge', async ({ page }) => {
        await page.locator('select').nth(0).selectOption('gasoline');
        await page.locator('select').nth(1).selectOption('2010');
        await page.locator('select').nth(2).selectOption('1');
        await page.getByRole('button', { name: /CALCULAR|calculate/i }).click({ force: true });

        await expect(badgeTitle(page, 'C')).toBeVisible();
      });

      test('gasoline 2004 → B badge', async ({ page }) => {
        await page.locator('select').nth(0).selectOption('gasoline');
        await page.locator('select').nth(1).selectOption('2004');
        await page.locator('select').nth(2).selectOption('6');
        await page.getByRole('button', { name: /CALCULAR|calculate/i }).click({ force: true });

        await expect(badgeTitle(page, 'B')).toBeVisible();
      });

      test('gasoline before 2001 → no badge (SIN)', async ({ page }) => {
        await page.locator('select').nth(0).selectOption('gasoline');
        await page.locator('select').nth(1).selectOption('1999');
        await page.locator('select').nth(2).selectOption('1');
        await page.getByRole('button', { name: /CALCULAR|calculate/i }).click({ force: true });

        await expect(badgeTitle(page, 'SIN')).toBeVisible();
      });

      test('diesel 2016 → C badge', async ({ page }) => {
        await page.locator('select').nth(0).selectOption('diesel');
        await page.locator('select').nth(1).selectOption('2016');
        await page.locator('select').nth(2).selectOption('1');
        await page.getByRole('button', { name: /CALCULAR|calculate/i }).click({ force: true });

        await expect(badgeTitle(page, 'C')).toBeVisible();
      });

      test('diesel 2010 → B badge', async ({ page }) => {
        await page.locator('select').nth(0).selectOption('diesel');
        await page.locator('select').nth(1).selectOption('2010');
        await page.locator('select').nth(2).selectOption('1');
        await page.getByRole('button', { name: /CALCULAR|calculate/i }).click({ force: true });

        await expect(badgeTitle(page, 'B')).toBeVisible();
      });

      test('diesel 2003 → no badge (SIN)', async ({ page }) => {
        await page.locator('select').nth(0).selectOption('diesel');
        await page.locator('select').nth(1).selectOption('2003');
        await page.locator('select').nth(2).selectOption('1');
        await page.getByRole('button', { name: /CALCULAR|calculate/i }).click({ force: true });

        await expect(badgeTitle(page, 'SIN')).toBeVisible();
      });
    });
  }
});

test.describe('Edge cases – cutoff dates', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${APP_URL}/malaga`);
    await page.waitForSelector('select');
  });

  test('diesel sep-2015 → C badge (exact cutoff)', async ({ page }) => {
    await page.locator('select').nth(0).selectOption('diesel');
    await page.locator('select').nth(1).selectOption('2015');
    await page.locator('select').nth(2).selectOption('9');
    await page.getByRole('button', { name: /CALCULAR|calculate/i }).click({ force: true });

    await expect(badgeTitle(page, 'C')).toBeVisible();
  });

  test('diesel aug-2015 → B badge (one month before cutoff)', async ({ page }) => {
    await page.locator('select').nth(0).selectOption('diesel');
    await page.locator('select').nth(1).selectOption('2015');
    await page.locator('select').nth(2).selectOption('8');
    await page.getByRole('button', { name: /CALCULAR|calculate/i }).click({ force: true });

    await expect(badgeTitle(page, 'B')).toBeVisible();
  });

  test('gasoline jan-2006 → C badge (exact cutoff)', async ({ page }) => {
    await page.locator('select').nth(0).selectOption('gasoline');
    await page.locator('select').nth(1).selectOption('2006');
    await page.locator('select').nth(2).selectOption('1');
    await page.getByRole('button', { name: /CALCULAR|calculate/i }).click({ force: true });

    await expect(badgeTitle(page, 'C')).toBeVisible();
  });
});

test.describe('Form validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${APP_URL}/malaga`);
    await page.waitForSelector('select');
  });

  test('submitting empty form shows error', async ({ page }) => {
    await page.getByRole('button', { name: /CALCULAR|calculate/i }).click({ force: true });

    await expect(page.locator('[class*="red"]').first()).toBeVisible({ timeout: 3000 });
  });

  test('submitting with only fuel selected shows error', async ({ page }) => {
    await page.locator('select').nth(0).selectOption('diesel');
    await page.getByRole('button', { name: /CALCULAR|calculate/i }).click({ force: true });

    await expect(page.locator('[class*="red"]').first()).toBeVisible({ timeout: 3000 });
  });

  test('error clears after a valid submission', async ({ page }) => {
    await page.getByRole('button', { name: /CALCULAR|calculate/i }).click({ force: true });
    await expect(page.locator('[class*="red"]').first()).toBeVisible({ timeout: 3000 });

    await page.locator('select').nth(0).selectOption('electric');
    await page.locator('select').nth(1).selectOption('2022');
    await page.locator('select').nth(2).selectOption('6');
    await page.getByRole('button', { name: /CALCULAR|calculate/i }).click({ force: true });

    await expect(badgeTitle(page, 'CERO')).toBeVisible();
    await expect(page.locator('[class*="red"]').first()).not.toBeVisible();
  });

  test('clear button resets the result', async ({ page }) => {
    await page.locator('select').nth(0).selectOption('electric');
    await page.locator('select').nth(1).selectOption('2022');
    await page.locator('select').nth(2).selectOption('6');
    await page.getByRole('button', { name: /CALCULAR|calculate/i }).click({ force: true });

    await expect(badgeTitle(page, 'CERO')).toBeVisible();

    await page.getByRole('button', { name: /limpiar|clear/i }).click();

    await expect(badgeTitle(page, 'CERO')).not.toBeVisible();
  });
});

test.describe('BadgeResult – zone display', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${APP_URL}/malaga`);
    await page.waitForSelector('select');
  });

  const calculate = async (page: Page, fuel: string, year: string, month: string) => {
    await page.locator('select').nth(0).selectOption(fuel);
    await page.locator('select').nth(1).selectOption(year);
    await page.locator('select').nth(2).selectOption(month);
    await page.getByRole('button', { name: /CALCULAR|calculate/i }).click({ force: true });
    await page.waitForTimeout(300);
  };

  test('CERO/ECO → both zones shown in green', async ({ page }) => {
    await calculate(page, 'electric', '2022', '1');

    await expect(badgeTitle(page, 'CERO')).toBeVisible();
    await expect(page.locator('[class*="emerald"]').first()).toBeVisible();
  });

  test('B badge → forbidden indicator shown', async ({ page }) => {
    await calculate(page, 'gasoline', '2004', '1');

    await expect(badgeTitle(page, 'B')).toBeVisible();
    await expect(page.locator('[class*="red"]').first()).toBeVisible();
  });

  test('C badge → parking zone indicator shown', async ({ page }) => {
    await calculate(page, 'gasoline', '2010', '1');

    await expect(badgeTitle(page, 'C')).toBeVisible();
    await expect(page.locator('[class*="yellow"]').first()).toBeVisible();
  });

  test('SIN badge → all zones forbidden', async ({ page }) => {
    await calculate(page, 'diesel', '2003', '1');

    await expect(badgeTitle(page, 'SIN')).toBeVisible();
    await expect(page.locator('[class*="red"]').first()).toBeVisible();
  });
});

test.describe('Leaflet map', () => {
  for (const city of ['malaga', 'madrid', 'barcelona']) {
    test(`${city} – map container loads`, async ({ page }) => {
      await page.goto(`${APP_URL}/${city}`);
      await page.waitForSelector('.leaflet-container', { timeout: 10000 });

      await expect(page.locator('.leaflet-container')).toBeVisible();
    });

    test(`${city} – interactive polygons are rendered`, async ({ page }) => {
      await page.goto(`${APP_URL}/${city}`);
      await page.waitForSelector('.leaflet-interactive', { timeout: 10000 });

      await expect(page.locator('.leaflet-interactive').first()).toBeVisible();
    });
  }

  test('polygon fill color changes between electric and no-badge vehicles', async ({ page }) => {
    await page.goto(`${APP_URL}/malaga`);
    await page.waitForSelector('.leaflet-container', { timeout: 10000 });

    const polygon = page.locator('.leaflet-interactive').first();

    await page.locator('select').nth(0).selectOption('electric');
    await page.locator('select').nth(1).selectOption('2022');
    await page.locator('select').nth(2).selectOption('6');
    await page.getByRole('button', { name: /CALCULAR|calculate/i }).click({ force: true });
    await page.waitForTimeout(500);
    const fillElectric = await polygon.getAttribute('fill');

    await page.locator('select').nth(0).selectOption('diesel');
    await page.locator('select').nth(1).selectOption('2003');
    await page.locator('select').nth(2).selectOption('1');
    await page.getByRole('button', { name: /CALCULAR|calculate/i }).click({ force: true });
    await page.waitForTimeout(500);
    const fillSin = await polygon.getAttribute('fill');

    expect(fillElectric).not.toBe(fillSin);
  });
});

test.describe('City routing', () => {
  test('app loads at /malaga', async ({ page }) => {
    await page.goto(`${APP_URL}/malaga`);
    await expect(page).toHaveURL(/malaga/);
    await page.waitForSelector('select');
  });

  test('app loads at /madrid', async ({ page }) => {
    await page.goto(`${APP_URL}/madrid`);
    await expect(page).toHaveURL(/madrid/);
    await page.waitForSelector('select');
  });

  test('app loads at /barcelona', async ({ page }) => {
    await page.goto(`${APP_URL}/barcelona`);
    await expect(page).toHaveURL(/barcelona/);
    await page.waitForSelector('select');
  });
});

test.describe('Basic accessibility', () => {
  test('page title is not empty', async ({ page }) => {
    await page.goto(`${APP_URL}/malaga`);
    const title = await page.title();
    expect(title.length).toBeGreaterThan(0);
  });

  test('all selects have options', async ({ page }) => {
    await page.goto(`${APP_URL}/malaga`);
    await page.waitForSelector('select');

    const fuelOptions = await page.locator('select').nth(0).locator('option').count();
    expect(fuelOptions).toBeGreaterThan(1);

    const yearOptions = await page.locator('select').nth(1).locator('option').count();
    expect(yearOptions).toBeGreaterThan(1);

    const monthOptions = await page.locator('select').nth(2).locator('option').count();
    expect(monthOptions).toBeGreaterThan(1);
  });

  test('calculate button is enabled on load', async ({ page }) => {
    await page.goto(`${APP_URL}/malaga`);
    await page.waitForSelector('select');

    await expect(page.getByRole('button', { name: /CALCULAR|calculate/i })).toBeEnabled();
  });
});