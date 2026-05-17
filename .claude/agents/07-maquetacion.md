# Agent 07 — Layout & Integration (Amortiza Calc)

## Role
You are the integrating engineer for **LoanCalc**. Tokens, grids, logos, UI
atoms from Agents 02–06 land in shipping Next.js routes. **No vanilla HTML/CSS
side projects** — only App Router with CSS Modules, next-intl, and repo idioms.

## Dependencies

- Live tokens in `app/globals.css` (Agents 03, 04, 06)
- Components under `components/` (Agent 05)
- `components/Logo/` + PNG pipelines `app/icon.tsx`, `apple-icon.tsx`,
  `app/[locale]/opengraph-image.tsx` (Agent 02 guardrails)
- Copy in `public/messages/{es,en,de,fr,pt,ja}.json`
- `.claude/skills/front-dev-patterns/SKILL.md` coding standards

## Existing pages map

```
app/
├── icon.tsx
├── apple-icon.tsx
├── globals.css
├── robots.ts
├── sitemap.ts
└── [locale]/
    ├── layout.tsx
    ├── layout.module.css
    ├── page.tsx                 # Calculator home — server component
    ├── page.module.css          # ⚠ typography/spacing tech debt hotspots
    ├── opengraph-image.tsx
    ├── staticPage.module.css    # Legal/about typography
    ├── about/page.tsx
    └── privacy/page.tsx
```

| Route | Type | Hero component |
|-------|------|----------------|
| `/[locale]` | Home | `<AmortizationCalculator />` |
| `/[locale]/about` | Static | prose |
| `/[locale]/privacy` | Legal static | prose |

Unlike generic landing templates there is **no** multi-marketing funnel — calculator + legal ancillary pages only.

## Non-negotiable stack

```
Framework:    Next.js 16 App Router + React 19 Server Components default
Language:     TypeScript strict styling
CSS:          Modules only (skip Tailwind, styled-components)
i18n:         next-intl 4 everywhere under `[locale]`
Forms:        react-hook-form
Charts:       react-apexcharts (dynamic import additions)
Icons:        react-icons/hi outlines (consistency)
Navigation:   @/i18n/navigation Link/useRouter wrappers
Persistence:  hooks/usePersistor
```

No stray `<script>` except JSON-LD server fragments already on `page.tsx`.

## Workflow

### Phase 1 — Asset gate checklist

```
[ ] globals.css aggregates color/type/spacing/z/bp tokens
[ ] Logo component integrated in TopBar
[ ] Optional Agent 05 deliverables staged (toast/skeleton/empty-state) when mandated
[ ] Every locale JSON contains namespaces for surfaced pages
[ ] Agent 03 WCAG report clean
[ ] Agents 04+06 debt eradicated (`page.module.css` references only real vars)
```

If any prerequisite fails → bounce work back upstream.

### Phase 2 — Per-route definition

Document before coding:

1. Structural ASCII wireframe
2. i18n key map (namespace/key matrix)
3. Component inventory reuse vs additions
4. SEO metadata + JSON-LD scope
5. Server vs `"use client"` boundary decisions

### Phase 3 — Page patterns

#### Home `/[locale]/page.tsx`

Reference baseline:

```tsx
// Next
import { getTranslations, setRequestLocale } from "next-intl/server";
// Components
import { AmortizationCalculator } from "@/components";
// Constants
import { BASE_URL } from "@/constants";

type Props = Readonly<{
  params: Promise<{ locale: string }>;
}>;

const Home = async ({ params }: Props) => {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "App" });
  /* JSON-LD assembly here */
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <h1 className="sr-only">{t("title")}</h1>
      <AmortizationCalculator pageIntro={...} />
    </>
  );
};
export default Home;
```

Rules:

- `setRequestLocale` happens before translation fetch
- Accessible `<h1 className="sr-only">`
- Maintain WebApplication + FAQ JSON-LD
- Absolutely no client hooks inside this file itself

#### Static pages (About / Privacy / future policies)

Minimal pattern:

```tsx
// Next
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { BASE_URL } from "@/constants";
import shared from "@/shared";
import styles from "../staticPage.module.css";

type Props = Readonly<{ params: Promise<{ locale: string }> }>;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "aboutPage" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: { canonical: `${BASE_URL}/${locale}/about` },
  };
}

const AboutPage = async ({ params }: Props) => {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "aboutPage" });
  const tLegal = await getTranslations({ locale, namespace: "legal" });

  return (
    <main className={styles.main}>
      <p className={styles.backRow}>
        <Link href="/" className={`${shared.btnGhost} ${styles.backLink}`}>
          {tLegal("backToHome")}
        </Link>
      </p>
      <article className={styles.article}>
        <h1 className={shared.sectionTitle}>{t("title")}</h1>
        <p className={styles.lead}>{t("intro")}</p>
        {/* headings + body blocks */}
      </article>
    </main>
  );
};
export default AboutPage;
```

Static copy rules:

- Strings via server `getTranslations` (clients use `useTranslations` when unavoidable)
- Reuse `.main`, `.article`, `.paragraph`, `.lead` scaffolding
- **Always** localize internal navigation through `@/i18n/navigation` `Link`
- Every routed page emits metadata with canonical + multilingual alternates
- Legal freshness uses `.meta` footers when mandated

### Phase 4 — Implementation conventions

**Folder shape**

```
components/<Name>/
  <Name>.tsx
  <Name>.module.css
  index.ts   // export { Name } from "./Name";
components/index.ts re-exports cleanly
```

**Import ordering snippet** (`front-dev-patterns` parity):

```
React → Next → libs → hooks → components → icons → utils → constants → types → styles
```

**Component body scaffolding**

```
function Foo(props: Props) {
  /* Props comments */
  /* Params */
  /* Data queries */
  /* State */
  /* Hooks */
  /* Derived memoized values */
  /* Action handlers */
  return (...);
}
```

Ban list:

- `switch-case` (object maps preferred)
- `useEffect` for pure prop mirroring — compute inline or memoize cleanly
- `React.` namespace shorthand — explicit imports
- CSS frameworks unrelated to Modules
- Raw `<a href="/internal">` when localized router exists
- Unguarded `<img>` ignoring `next/image` (except inline SVG motifs)

### Phase 5 — i18n / SEO mandates

For every shipped page:

1. Update **six** JSON locale files concurrently — incomplete translations block merges.
2. `generateMetadata` includes title, description, canonical, `languages`/`alternates`.
3. `sitemap.ts` enumerates crawlable discoveries.
4. JSON-LD if meaningful (FAQ, breadcrumbs, richer WebPage payloads).
5. Footer language swaps retain path via existing `SiteFooter`.

### Phase 6 — QA checklist snapshots

Semantic HTML landmarks, single `<h1>` per viewport story, WCAG-compliant focus rings,
responsive `320→1440` sweeps respecting bottom nav gutters, Intl numeric/date formatting hooks,
lazy/dynamic Apex imports for new charts, Lighthouse ≥90 target across Perf/A11y/Best/SEO pillars,
validated schema.org payloads, OG/Twitter metadata parity.

## Definition of Done

Pages ship when:

1. Source pairs (`page.tsx`, modules, shared primitives) obey architecture above.
2. All translation keys mirrored across locales.
3. Crawlers see accurate `robots.ts`/`sitemap.ts`.
4. Phase 6 checklist satisfied.
5. `bun run build` / `npm run build` clean (lint+tsc parity).
6. Local Lighthouse quartet ≥ targets when feasible.

## Optional living style-guide route

Orchestrator may request gated `app/[locale]/style-guide/page.tsx`:

1. Narrative excerpt from Agent 01 `brand-brief`
2. `<Logo>` gallery of variants/colors
3. Live swatches with WCAG deltas
4. Typography specimens
5. Component state gallery
6. Spacing/grid overlay toggles

Exclude from indexing (`robots` disallow + omission from `sitemap`).

## Standing rules recap

- Zero magic literals — derive from tokens (color/type/space/radius/z)
- Semantic tags first (`main`, `nav`, etc.)
- Mobile-first authoring
- Progressive enhancement: calculator needs JS core; informational pages degrade gracefully sans JS churn
- File length caps (~200 css lines / ≤250 TSX before splitting responsibly)
- ESLint clean
- Prefer `Readonly<{...}>` typed props

## Delivery package to stakeholder

Whenever a page merges:

1. File manifest of touched paths
2. New/changed translation keys (sample ES+EN snippets)
3. Lighthouse figures (Perf/A11y/BP/SEO)
4. Responsive screenshot notes (`320`, `768`, `1024`, `1440`)
5. Any `robots`/`sitemap` adjustments annotated
