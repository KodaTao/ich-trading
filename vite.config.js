import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ command }) => ({
  plugins: [vue()],
  // 开发环境用 /，生产构建用 /ich-trading/
  base: command === 'serve' ? '/' : '/ich-trading/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
  server: {
    fs: {
      allow: ['.'],
    },
  },
}))
