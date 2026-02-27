import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/test/',          // ← ВОТ ЭТО ДОБАВЛЯЕШЬ
  plugins: [react()],
  server: {
    port: 3000
  }
});
