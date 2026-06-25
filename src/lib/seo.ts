// Centralised SEO config + a small helper that produces the `meta` array
// TanStack Start expects from a route `head()`. Keeping it in one place means
// the brand name, default copy and social image are consistent everywhere and
// trivially changeable.

/** Public origin, no trailing slash. Set VITE_SITE_URL in production. */
export const SITE_URL = (import.meta.env.VITE_SITE_URL || "https://onlinetalim.uz").replace(
  /\/+$/,
  "",
);

export const SITE_NAME = "OnlineTalim";

export const DEFAULT_TITLE = "OnlineTalim — Onlayn video kurslar va darsliklar";

export const DEFAULT_DESCRIPTION =
  "OnlineTalim — sifatli onlayn video darslar, interaktiv testlar va sertifikatlar bilan yangi kasb va ko‘nikmalarni o‘rganing. Istalgan vaqtda, istalgan joydan biling.";

export const DEFAULT_KEYWORDS =
  "onlayn kurslar, online ta'lim, video darslik, ta'lim platformasi, masofaviy ta'lim, dasturlash kurslari, onlayn test, sertifikat, OnlineTalim, o'quv platformasi";

/** Absolute social-share image (1200×630). Lives in /public. */
export const OG_IMAGE = `${SITE_URL}/og-image.png`;

type SeoArgs = {
  title?: string;
  description?: string;
  /** Path beginning with "/" — used for canonical + og:url. */
  path?: string;
  image?: string;
  /** Set true on private pages (app/admin) to keep them out of search. */
  noindex?: boolean;
  keywords?: string;
};

/**
 * Build a complete meta tag set (title, description, Open Graph, Twitter,
 * canonical, robots). Spread the result into a route head's `meta`/`links`.
 */
export function seo(args: SeoArgs = {}) {
  const title = args.title ? `${args.title} · ${SITE_NAME}` : DEFAULT_TITLE;
  const description = args.description ?? DEFAULT_DESCRIPTION;
  const image = args.image ?? OG_IMAGE;
  const url = args.path ? `${SITE_URL}${args.path}` : SITE_URL;

  const meta = [
    { title },
    { name: "description", content: description },
    { name: "keywords", content: args.keywords ?? DEFAULT_KEYWORDS },
    {
      name: "robots",
      content: args.noindex
        ? "noindex, nofollow"
        : "index, follow, max-image-preview:large, max-snippet:-1",
    },

    // Open Graph
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { property: "og:url", content: url },
    { property: "og:site_name", content: SITE_NAME },
    { property: "og:locale", content: "uz_UZ" },
    { property: "og:image", content: image },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { property: "og:image:alt", content: SITE_NAME },

    // Twitter / X
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: image },
  ];

  return { meta, links: [{ rel: "canonical", href: url }] };
}
