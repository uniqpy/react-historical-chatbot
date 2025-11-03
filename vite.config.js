import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Proxy /api to the Express server so the client can call /api/* without CORS issues.
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: { '/api': 'http://localhost:5174' }
  }
});