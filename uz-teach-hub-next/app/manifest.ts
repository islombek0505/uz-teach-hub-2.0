import type { MetadataRoute } from "next"
import { SITE_NAME, DEFAULT_DESCRIPTION } from "@/lib/seo"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME} — Onlayn video kurslar`,
    short_name: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#0f2733",
    theme_color: "#0f2733",
    lang: "uz",
    dir: "ltr",
    categories: ["education", "productivity"],
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
      { src: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  }
}
