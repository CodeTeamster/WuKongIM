import path from "node:path"

import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig, loadEnv } from "vite"

function resolveVitePort(rawPort: string | undefined, fallback: number) {
  const parsedPort = Number.parseInt(rawPort ?? "", 10)
  if (Number.isInteger(parsedPort) && parsedPort > 0) {
    return parsedPort
  }
  return fallback
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "")

  return {
    plugins: [react(), tailwindcss()],
    server: {
      host: true,
      port: resolveVitePort(env.VITE_DEV_PORT, 5173),
      strictPort: true,
    },
    preview: {
      host: true,
      port: resolveVitePort(env.VITE_DEV_PORT, 4173),
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  }
})
