import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages(https://1j1ne.github.io/seoulicon/)에 올릴 때는 하위 경로가 필요합니다.
// three.js는 3D 섹션에서만 동적으로 불러옵니다(첫 화면 로딩에 포함되지 않음).
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/seoulicon/' : '/',
  plugins: [react()],
  build: { chunkSizeWarningLimit: 1200 },
}));
