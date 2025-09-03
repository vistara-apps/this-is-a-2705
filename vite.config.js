import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 2000, // Increase the warning limit to 2000kb
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Create chunks for major libraries
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
              return 'vendor-react';
            }
            if (id.includes('@rainbow-me/rainbowkit')) {
              return 'vendor-ui';
            }
            if (id.includes('wagmi') || id.includes('viem')) {
              return 'vendor-blockchain';
            }
            if (id.includes('@supabase/supabase-js')) {
              return 'vendor-supabase';
            }
            // Group other node_modules into a separate chunk
            return 'vendor-other';
          }
        }
      }
    }
  }
})
