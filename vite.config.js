import { resolve } from 'node:path'
import { defineConfig } from 'vite'

const r = (p) => resolve(import.meta.dirname, p)

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        home: r('index.html'),
        cosmic: r('01-cosmic-ovni/index.html'),
        golden: r('02-golden-crunch/index.html'),
        street: r('03-street-truck-pop/index.html'),
      },
    },
  },
})
