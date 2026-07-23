import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  resolve: {
    // tsconfig の "@/*": ["./*"] に合わせる
    alias: {
      "@": fileURLToPath(new URL("./", import.meta.url)),
    },
  },
});
