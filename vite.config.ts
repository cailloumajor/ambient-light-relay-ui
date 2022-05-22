import { URL, fileURLToPath } from "url"

import vue from "@vitejs/plugin-vue"
import { presetAttributify, presetUno, presetWebFonts } from "unocss"
import Unocss from "unocss/vite"
import { defineConfig } from "vite"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Unocss({
      presets: [
        presetAttributify(),
        presetUno(),
        presetWebFonts({ fonts: { sans: "Roboto" } }),
      ],
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
})
