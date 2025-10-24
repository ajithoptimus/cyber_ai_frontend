import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // <-- FIX: Import the plugin

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss() // <-- FIX: Add the plugin to the array
  ],
  
  // Your server proxy block is correct and is being kept.
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000', 
        changeOrigin: true,
        secure: false,
      }
    }
  }
})