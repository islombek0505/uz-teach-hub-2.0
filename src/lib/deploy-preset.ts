/**
 * Resolves the Nitro deployment preset from CI/hosting environment variables.
 * Override anytime with NITRO_PRESET (e.g. netlify, vercel, cloudflare-module, node-server).
 */
export function resolveNitroPreset(): string {
  const explicit = process.env.NITRO_PRESET?.trim();
  if (explicit) return explicit;

  // Netlify sets NETLIFY=true during builds (and CONTEXT for preview/production).
  if (process.env.NETLIFY === "true" || process.env.NETLIFY) return "netlify";

  if (process.env.VERCEL) return "vercel";

  if (process.env.CF_PAGES || process.env.CLOUDFLARE_PAGES) return "cloudflare-pages";

  if (process.env.RAILWAY_ENVIRONMENT || process.env.RAILWAY_PROJECT_ID) return "node-server";

  // Sensible default for Docker/VPS/Render/Fly.io etc.
  return "node-server";
}
