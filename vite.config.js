import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react()],
  server: { port: 5173, open: true },
  build: isSsrBuild
    ? {}
    : {
        // three.js is big: its own chunk, loaded only for the 3D hero, so the page text comes first
        rollupOptions: { output: { manualChunks: { three: ['three', '@react-three/fiber'] } } },
        chunkSizeWarningLimit: 900,
      },
}));
