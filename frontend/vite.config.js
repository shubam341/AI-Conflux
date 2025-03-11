import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  server:{
   headers:{
    "Cross-Origin-Embedder-Policy": "require-corp",
"Cross-Origin-Opener-Policy": "same-origin"
   },
   proxy: {
    '/cdn': {
      target: 'https://unpkg.com',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/cdn/, '')
    }
  }
}
})