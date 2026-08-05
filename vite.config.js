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
        default: resolve(rootDirectory, 'default/index.html'),
        guest: resolve(rootDirectory, 'guest/index.html'),
        invitation: resolve(rootDirectory, 'invitation/index.html'),
      },
    },
  },
})
