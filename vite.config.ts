import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// 本地开发时若后端 (npm run server，默认 3000 端口) 在跑，/api 会代理过去（需登录+云同步）；
// 后端没跑时应用自动进入「本地模式」，不影响纯前端调试。
const backend = process.env.BACKEND_URL || 'http://localhost:3000';

export default defineConfig({
  plugins: [react()],
  base: './',
  server: { host: true, port: 18888, strictPort: true, proxy: { '/api': backend } },
  build: { chunkSizeWarningLimit: 1500 },
});
