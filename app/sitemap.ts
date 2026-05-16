// Next
import type { MetadataRoute } from "next";

// Utils
import { routing } from "@/i18n/routing";

// Constants
const BASE_URL = "https://loanpayoff.info";

const sitemap = (): MetadataRoute.Sitemap =>
  routing.locales.map((locale) => ({
    url: `${BASE_URL}/${locale}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: locale === routing.defaultLocale ? 1 : 0.8,
    alternates: {
      languages: Object.fromEntries(
        routing.locales.map((l) => [l, `${BASE_URL}/${l}`])
      ),
    },
  }));

export default sitemap;
