import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

const coreRoot = resolve(__dirname, '../../packages/core')

export default defineConfig({
  plugins: [vue()],
  define: {
    __DEV__: true,
  },
  server: {
    port: 4200,
    host: true,
  },
  resolve: {
    alias: {
      '@bye_past/vue-keep/animations.css': resolve(coreRoot, 'src/animation/presets.css'),
      '@bye_past/vue-keep': resolve(coreRoot, 'src/index.ts'),
    },
  },
})
