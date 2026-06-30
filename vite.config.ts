import { defineConfig } from 'vite';

export default defineConfig({
  base: '/game/',
  root: '.',
  publicDir: 'public',
  build: {
    outDir: 'dist',
  },
});
