import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDirectory = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  plugins: [react()],
  base: '/wedding-letter/',
  build: {
    rollupOptions: {
      input: {
        main: resolve(rootDirectory, 'index.html'),
        test1: resolve(rootDirectory, 'test1/index.html'),
        test2: resolve(rootDirectory, 'test2/index.html'),
        test3: resolve(rootDirectory, 'test3/index.html'),
      },
    },
  },
})
