import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'happy-dom',
    coverage: {
      reporter: ['text', 'json', 'html'],
    },
    include: ['src/**/*.test.{ts,tsx,vue}'],
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})
