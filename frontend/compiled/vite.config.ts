import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { libInjectCss } from 'vite-plugin-lib-inject-css';

const libEntryFile = path.resolve(__dirname, 'src/index.ts');
const libEntryFileDir = path.dirname(libEntryFile);

const libOutDir = path.resolve(__dirname, 'build-assets');
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    libInjectCss(),
    dts({
      rollupTypes: true,
      tsconfigPath: path.resolve(__dirname, 'tsconfig.build.json'),
      outDir: libOutDir,
    }),
  ],
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
  build: {
    minify: true,
    lib: {
      entry: libEntryFile,
      formats: ['es'],
      fileName() {
        return 'index.js';
      },
    },
    outDir: libOutDir,
    rollupOptions: {
      // external: ['react'],
      //  css tree shaking
      output: {
        assetFileNames: '[name]/index[extname]',
        chunkFileNames: (chunk) => {
          const entryModuleId = chunk.moduleIds[chunk.moduleIds.length - 1];
          if (
            path.basename(entryModuleId, path.extname(entryModuleId)) ===
            'index'
          ) {
            return '[name]/index.js';
          }
          return '[name].js';
        },
        manualChunks(id, { getModuleInfo }) {
          const entryModuleInfo = getModuleInfo(libEntryFile);
          const entryModuleImportedIds = entryModuleInfo?.importedIds;
          if (entryModuleImportedIds?.includes(id)) {
            const filenameWithoutExt = path.basename(id, path.extname(id));
            if (filenameWithoutExt === 'index') {
              return path.dirname(id).replace(libEntryFileDir + path.sep, '');
            } else {
              return filenameWithoutExt;
            }
          }
        },
      },
    },
  },
});
