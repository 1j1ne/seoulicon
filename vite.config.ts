import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// three.js는 3D 섹션에서만 동적으로 불러옵니다(첫 화면 로딩에 포함되지 않음).
export default defineConfig({
  plugins: [react()],
  build: { chunkSizeWarningLimit: 1200 },
});
