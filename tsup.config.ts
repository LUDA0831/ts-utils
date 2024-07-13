import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['./src/index.ts'],
  format: ['esm'],
  dts: {
    resolve: true,
  },
  external: ['vue', 'lodash-es'],
})
