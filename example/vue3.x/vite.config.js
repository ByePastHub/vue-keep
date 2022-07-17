import { resolve } from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import viteCompression from 'vite-plugin-compression';
import styleImport from 'vite-plugin-style-import';
import Components from 'unplugin-vue-components/vite';
import { VantResolver } from 'unplugin-vue-components/resolvers';
import { BASE } from './src/config/index';

// https://vitejs.dev/config/
export default defineConfig({
  input: './src/index.js',
  output: [
    { file: 'dist/vue-keep.cjs.js' },
    // { file: "dist/vue-keep.cjs.min.js", plugins: [terser()] },
    { file: 'dist/vue-keep.esm.js', format: 'esm' },
    { file: 'dist/vue-keep.umd.js', format: 'umd', name: 'index' }
  ],
  base: BASE,
  build: {
    sourcemap: true, // 输出.map文件
  },
  plugins: [
    vue(),
    Components({
      resolvers: [VantResolver()],
    }),
    styleImport({
      libs: [
        {
          libraryName: 'vant',
          esModule: true,
          resolveStyle: (name) => `vant/es/${name}/style`,
        },
      ],
    }),
    viteCompression(),
  ],
  server: {
    host: '0.0.0.0'
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
});
