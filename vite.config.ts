import process from "node:process";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { resolveNitroPreset } from "./src/lib/deploy-preset";

// Standalone TanStack Start config (independent of any hosted builder).
// Plugins are wired directly: Tailwind, tsconfig path aliases, TanStack Start
// (with the server entry pointing at our SSR wrapper), Nitro for production
// server output, and the React plugin.
export default defineConfig(({ command }) => ({
  plugins: [
    tailwindcss(),
    tsConfigPaths({ projects: ["./tsconfig.json"] }),
    tanstackStart({
      // Build the bundled server entry from src/server.ts (our SSR wrapper).
      server: { entry: "server" },
      // Prevent server-only modules from being imported into client code.
      importProtection: {
        behavior: "error",
        client: { files: ["**/server/**"], specifiers: ["server-only"] },
      },
    }),
    // Nitro produces the deployable server bundle. The preset is auto-detected
    // from the hosting env (Netlify/Vercel/Cloudflare/Node) — see deploy-preset.ts,
    // or override with NITRO_PRESET. Only needed for production builds.
    ...(command === "build" ? [nitro({ preset: resolveNitroPreset() })] : []),
    viteReact(),
  ],
  resolve: {
    alias: { "@": `${process.cwd()}/src` },
    // Ensure a single copy of React / React Query across the bundle.
    dedupe: [
      "react",
      "react-dom",
      "react/jsx-runtime",
      "react/jsx-dev-runtime",
      "@tanstack/react-query",
      "@tanstack/query-core",
    ],
  },
  server: { host: "::", port: 8080 },
}));
