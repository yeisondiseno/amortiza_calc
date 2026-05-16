# SEO Agent Memory — loanpayoff.info

## Project State (as of 2026-05-15)

### Already Implemented ✅

- sitemap.xml with hreflang per locale (`app/sitemap.ts`)
- robots.txt referencing sitemap (`app/robots.ts`)
- `<h1 sr-only>` server-rendered in `app/[locale]/page.tsx`
- WebApplication JSON-LD schema per locale
- OG locale format `en_US`, `es_ES`, etc. in layout
- `siteName` = "Loan Payoff Calculator" (constant in layout)
- Twitter card `summary_large_image`
- OG image 1200×630 per locale (`app/[locale]/opengraph-image.tsx`)
- Favicon 32×32 (`app/icon.tsx`) and apple-icon 180×180
- `BASE_URL` = "https://loanpayoff.info" in `constants/index.ts`
- 6 locales: es, en, de, fr, pt, ja (defaultLocale: en)

### Critical Issues Found (2026-05 audit)

1. **MIDDLEWARE BUG**: Middleware is in `proxy.ts`, NOT `middleware.ts` — Next.js won't run it. Must rename.
2. **Short meta descriptions**: ~58–63 chars across all locales (need 120–160).
3. **Short meta titles**: ~22 chars (need 45–60). Missing keyword modifiers like "with extra payments".

### Pending High Priority

4. **No E-E-A-T trust pages**: No /about, /privacy, /contact. YMYL site without these is penalized.
5. **FAQPage schema**: Not implemented. 15–35% CTR uplift potential for financial tools.
6. **WebApplication schema incomplete**: Missing `browserRequirements`, `featureList`, `screenshot`, `creator`.
7. **All calculator content is client-rendered**: `AmortizationCalculator` is `"use client"`. Googlebot sees only the sr-only H1 and JSON-LD.
8. **Brand name inconsistency**: Header says "LoanCalc", siteName is "Loan Payoff Calculator", domain is loanpayoff.info.

### Medium/Low Pending

- `x-default` missing from sitemap alternates
- `lastModified: new Date()` in sitemap (always today — use static date)
- No `theme-color` meta tag
- No Twitter handle in metadata
- ApexCharts (~800KB) may affect INP on mobile

## Architecture Notes

- Stack: Next.js 16 App Router, React 19, next-intl 4.9, TypeScript, CSS Modules
- Million.js compiler enabled (`auto: { rsc: true }`)
- Translation files: `public/messages/{locale}.json` — namespace `App` for title/description
- i18n routing: `app/[locale]/` prefix, middleware handles root redirect (when renamed correctly)
- Canonical pattern: `${BASE_URL}/${locale}` (e.g. `https://loanpayoff.info/en`)
- No sub-pages yet — single tool page

## SEO Strategy

- EN SERPs dominated by NerdWallet/Bankrate (DR 90+) — target long-tail and non-EN locales
- ES and DE have lower competition for amortization calculator keywords
- Primary intent: transactional/instrumental (user wants to calculate savings)
- YMYL category — E-E-A-T is non-negotiable for sustained rankings

## Keyword Targets

- EN primary: "loan payoff calculator with extra payments", "amortization calculator extra payments"
- ES primary: "calculadora de amortización", "calculadora préstamos pagos extra"
- DE primary: "Tilgungsrechner mit Sondertilgung"
- Long-tail EN: "calculate loan payoff date with extra payments", "amortization schedule CSV download"
