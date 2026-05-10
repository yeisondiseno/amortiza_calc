import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["es", "en", "de", "fr", "pt", "ja"],
  defaultLocale: "en",
});
