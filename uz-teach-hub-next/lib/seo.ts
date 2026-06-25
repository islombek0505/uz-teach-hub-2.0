import type { Metadata } from "next"

/**
 * Centralised SEO config + a Next.js Metadata builder.
 * Keeping brand, copy and social image in one place means they're consistent
 * everywhere and trivially changeable. Ported from the old TanStack `seo()`.
 */

/** Public origin, no trailing slash. Set NEXT_PUBLIC_SITE_URL in production. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://onlinetalim.uz").replace(
  /\/+$/,
  ""
)

export const SITE_NAME = "OnlineTalim"

export const DEFAULT_TITLE = "OnlineTalim — Onlayn video kurslar va darsliklar"

export const DEFAULT_DESCRIPTION =
  "OnlineTalim — sifatli onlayn video darslar, interaktiv testlar va sertifikatlar bilan yangi kasb va ko'nikmalarni o'rganing. Istalgan vaqtda, istalgan joydan biling."

export const DEFAULT_KEYWORDS = [
  "onlayn kurslar",
  "online ta'lim",
  "video darslik",
  "ta'lim platformasi",
  "masofaviy ta'lim",
  "dasturlash kurslari",
  "onlayn test",
  "sertifikat",
  "OnlineTalim",
]

/** Absolute social-share image (1200×630). Lives in /public. */
export const OG_IMAGE = `${SITE_URL}/og-image.png`

type SeoArgs = {
  title?: string
  description?: string
  /** Path beginning with "/" — used for canonical + og:url. */
  path?: string
  image?: string
  /** Set true on private pages (app/admin) to keep them out of search. */
  noindex?: boolean
  keywords?: string[]
}

/** Build a complete Next.js Metadata object (title, OG, Twitter, canonical, robots). */
export function buildMetadata(args: SeoArgs = {}): Metadata {
  const title = args.title ?? DEFAULT_TITLE
  const description = args.description ?? DEFAULT_DESCRIPTION
  const image = args.image ?? OG_IMAGE
  const url = args.path ? `${SITE_URL}${args.path}` : SITE_URL

  return {
    title,
    description,
    keywords: args.keywords ?? DEFAULT_KEYWORDS,
    alternates: { canonical: url },
    robots: args.noindex
      ? { index: false, follow: false }
      : { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
    openGraph: {
      title,
      description,
      type: "website",
      url,
      siteName: SITE_NAME,
      locale: "uz_UZ",
      images: [{ url: image, width: 1200, height: 630, alt: SITE_NAME }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  }
}

/** JSON-LD structured data for the organisation + website (rich results). */
export const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "EducationalOrganization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      logo: OG_IMAGE,
      image: OG_IMAGE,
      description: DEFAULT_DESCRIPTION,
      sameAs: [],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      description: DEFAULT_DESCRIPTION,
      inLanguage: "uz",
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
  ],
}
