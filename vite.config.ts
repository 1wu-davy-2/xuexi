import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './',
  server: { host: true, port: 5266, strictPort: true },
  build: { chunkSizeWarningLimit: 1500 },
});
