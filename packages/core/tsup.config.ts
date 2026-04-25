import { defineConfig } from 'tsup'
import { copyFileSync } from 'fs'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  tsconfig: 'tsconfig.build.json',
  dts: true,
  clean: true,
  treeshake: true,
  sourcemap: true,
  external: ['vue', 'vue-router', '@vue/devtools-api'],
  esbuildOptions(options) {
    options.banner = {
      js: '/* @bye_past/vue-keep v2.0.0 | MIT License */',
    }
  },
  onSuccess: async () => {
    copyFileSync('src/animation/presets.css', 'dist/animations.css')
  },
})
