import { mergeConfig } from "vite"
import type { ConfigEnv, UserConfig } from "vite"
import { defineConfig } from "vitest/config"

import viteConfig from "./vite.config"

const resolvedViteConfig = (viteConfig as (env: ConfigEnv) => UserConfig)({
  command: "serve",
  mode: "test",
  isSsrBuild: false,
  isPreview: false,
})

export default mergeConfig(
  resolvedViteConfig,
  defineConfig({
    test: {
      environment: "jsdom",
      globals: true,
      setupFiles: ["./src/test/setup.ts"],
    },
  }),
)
