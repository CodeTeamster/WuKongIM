import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

function resolveVitePort(rawPort: string | undefined, fallback: number) {
  const parsedPort = Number.parseInt(rawPort ?? "", 10)
  if (Number.isInteger(parsedPort) && parsedPort > 0) {
    return parsedPort
  }
  return fallback
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "")

  return {
    plugins: [vue()],
    base: '/chatdemo',
    server: {
      host: true,
      port: resolveVitePort(env.VITE_DEV_PORT, 5173),
      strictPort: true,
      fs: {
        strict: false
      }
    },
    preview: {
      host: true,
      port: resolveVitePort(env.VITE_DEV_PORT, 4173),
    }
  }
})
