# SEO Expert Memory — loanpayoff.info / LoanCalc

## Project Vitals

- Domain: https://loanpayoff.info | Stack: Next.js 16 App Router + next-intl 4
- Locales: en (default), es, de, fr, pt, ja
- Schema types: WebApplication (FinanceApplication) + FAQPage per locale
- BASE_URL constant: `constants/index.ts`
- metadataBase: set in `app/[locale]/layout.tsx` → `new URL(BASE_URL)`

## Brand Tokens (sync app/globals.css)

- `--color-primary: #000000` (FRAME)
- `--color-secondary: #006c49` (URL_FG green)
- `--color-secondary-container: #6cf8bb` (ACCENT mint)
- `--color-surface: #f7f9fb` (OG image background)
- `--color-on-surface: #191c1e` (TEXT_PRIMARY)
- `--color-on-surface-variant: #45464d` (TEXT_SECONDARY)

## Icon / Favicon Architecture (as of May 2026)

- `app/icon.tsx` → PNG 32×32 at `/icon` (black frame + mint bars logo)
- `app/apple-icon.tsx` → PNG 180×180 at `/apple-icon`
- `app/[locale]/opengraph-image.tsx` → PNG 1200×630 per locale, system-ui font, fully localized
- NO favicon.ico static file (MISSING — critical gap)
- NO manifest.json (MISSING — needed for PWA/Android)
- NO SVG favicon (medium priority)

## Middleware Matcher (fixed)

Pattern: `/((?!_next|_vercel|icon|apple-icon|.*\\..*).*)` — correctly excludes icon routes from locale redirect. If manifest.ts is added, also add `manifest` to the exclusion group.

## Known Gaps (audited May 2026)

1. Missing `export const alt` in opengraph-image.tsx → no og:image:alt / twitter:image:alt
2. Missing static favicon.ico
3. twitter/openGraph images in generateMetadata not declaring alt text explicitly
4. Missing appleWebApp.title in Viewport/Metadata
5. Missing manifest.ts (Web App Manifest)
6. WebApplication JSON-LD missing `image` field
7. No Organization schema with logo for Knowledge Graph

## WCAG Contrast (OG Image) — All Pass

- Title #191c1e on #f7f9fb: ~20.5:1 AAA ✓
- Description #45464d on #f7f9fb: ~14.6:1 AAA ✓
- URL chip #006c49 on #e6faf0: ~5.3:1 AA ✓

## Patterns Confirmed

- `generateMetadata` in layout.tsx is async Server Component — use getTranslations directly
- opengraph-image.tsx supports static `export const alt` or dynamic `generateImageMetadata` for localized alt text
- Organization JSON-LD should only be emitted for defaultLocale (en) to avoid duplicates
- system-ui font in OG images is pragmatic tradeoff (no fetch overhead vs Manrope inconsistency)
