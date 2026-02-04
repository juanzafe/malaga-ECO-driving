import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      // Actualizado para incluir tus archivos reales
      includeAssets: ['favicon.png', 'pwa-192x192.png', 'pwa-512x512.png'], 
      manifest: {
        name: 'Málaga ZBE Eco',
        short_name: 'ZBE Málaga',
        description: 'Consulta las restricciones de la Zona de Bajas Emisiones en Málaga',
        theme_color: '#3b82f6',
        background_color: '#ffffff', // Este es el fondo de tu Splash Screen en Android
        display: 'standalone',
        orientation: 'portrait', // Fuerza a que la app se abra en vertical
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
})