import {fileURLToPath, URL} from 'node:url'

import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import viteCompression from 'vite-plugin-compression';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    build: {
        rollupOptions: {
            output: {
                assetFileNames: 'assets/[hash][extname]',
                chunkFileNames: 'chunks/[hash].js',
                entryFileNames: 'entries/[hash].js',
                manualChunks: {
                    vue: ['vue', 'vue-router'],
                    antdv: ['ant-design-vue'],
                    antdv_icon: ['@ant-design/icons-vue']
                },
                sourcemap: false,
            }
        }
    }
})
