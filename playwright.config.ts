import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  /* Ejecuta tests en paralelo */
  fullyParallel: true,
  /* Falla en CI si olvidas un test.only */
  forbidOnly: !!process.env.CI,
  /* Reintenta solo en CI */
  retries: process.env.CI ? 2 : 0,
  /* Número de hilos de ejecución */
  workers: process.env.CI ? 1 : undefined,
  /* Reporte en HTML */
  reporter: 'html',
  
  /* Configuración compartida */
  use: {
    /* URL base para evitar escribirla en cada test. 
       Usamos 127.0.0.1 para evitar problemas de resolución de 'localhost' en Node */
    baseURL: 'http://127.0.0.1:5173',

    /* Graba trazas para depurar fallos */
    trace: 'on-first-retry',
    
    /* Captura de pantalla si falla un test */
    screenshot: 'only-on-failure',
  },

  /* Navegadores a probar */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // Si solo quieres probar rápido, puedes comentar firefox y webkit
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],

  /* Configuración del servidor local: Playwright lo arrancará por ti */
  webServer: {
    command: 'npm run dev',        // Comando para arrancar tu app de Málaga
    url: 'http://127.0.0.1:5173',  // URL a esperar antes de empezar los tests
    reuseExistingServer: !process.env.CI, // En local, usa el servidor si ya está abierto
    stdout: 'ignore',
    stderr: 'pipe',
  },
});