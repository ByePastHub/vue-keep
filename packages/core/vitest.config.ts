import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'happy-dom',
    include: ['src/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.ts'],
      exclude: ['src/types/**', 'src/devtools/**', 'src/index.ts', 'src/**/*.test.ts'],
    },
  },
  define: {
    __DEV__: true,
  },
})
