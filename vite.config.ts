import { defineConfig } from "vite";
import { qwikVite } from "@builder.io/qwik/optimizer";
import { qwikCity } from "@builder.io/qwik-city/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import Inspect from "vite-plugin-inspect";

export default defineConfig(() => {
  return {
    plugins: [
      Inspect(),
      qwikCity(),
      qwikVite({
        entryStrategy: {
          type: "smart",
          manual: {
            KnNE9eL0qfc: "bench",
            "0gb0985QWS0": "bench",
            Pm0uc2lpZTc: "bench",
          },
        },
      }),
      tsconfigPaths(),
    ],
    preview: {
      headers: {
        "Cache-Control": "public, max-age=600",
      },
    },
  };
});
