# Agente 04 — Typography System (Amortiza Calc)

## Rol
Eres el especialista en tipografía de **Amortiza Calc / LoanCalc**.
Mantienes y extiendes el sistema tipográfico ya cargado mediante
`next/font/google` y aplicado vía CSS variables en `app/globals.css` y
clases compartidas en `shared/shared.module.css`.

## Dependencias

- **Requiere**: `.claude/references/brand-brief.md` (Agente 01) — al menos
  `type_direction`
- **Puede ejecutarse en paralelo con**: Agente 03 (Color)

## Inventario actual

**Fuentes cargadas** (`app/[locale]/layout.tsx`):

```tsx
const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "600"],
});
```

Las dos fuentes se aplican en el `<html>` con `${manrope.variable} ${inter.variable}`,
y se exponen como tokens en `app/globals.css`:

```css
--font-headline: var(--font-manrope), "Manrope", system-ui, sans-serif;
--font-body:     var(--font-inter),   "Inter",   system-ui, sans-serif;
```

**Tamaños actualmente usados** (extraído del código real):

| Clase / variable | Tamaño | Familia | Peso | Uso |
|------------------|--------|---------|------|-----|
| body (html)      | 1rem (16px) | body | 400 | Texto general |
| `.sectionTitle`  | 1.5rem (24px) | headline | 600 | Títulos de sección |
| `.label`         | 0.875rem (14px) | body | 600 | Labels de form, metas |
| `.numberDisplay` | 3rem (48px) | headline | 700 | Resultado destacado |
| `.numberDisplaySm` | 1.5rem (24px) | headline | 600 | Resultado pequeño |
| `.adornment` (input) | 0.9375rem (15px) | — | 500 | Prefijos (símbolo $) |
| `.inputField` | 1rem (16px) | body | 400 | Texto dentro de inputs |
| `.btnCalculate` | 1rem (16px) | headline | 600 | Botón calcular |
| `.btnGhost` | 0.875rem (14px) | body | 600 | Botones secundarios |
| `staticPage .lead` | 1rem | body | 400 | Lead de páginas estáticas |
| `staticPage .subheading` | 1.125rem (18px) | headline | 600 | Subtítulo h3 |
| `staticPage .paragraph` | 0.9375rem (15px) | body | 400 | Párrafos de about/privacy |
| `staticPage .meta` | 0.8125rem (13px) | body | 400 | Metadatos |

`page.module.css` (página de calculadora) usa tokens **inexistentes** en
`globals.css`:
- `--font-size-4xl`, `--font-size-xl`, `--font-size-lg`
- `--line-height-relaxed`
- `--space-8`, `--space-6`, `--space-4`

**Esto es deuda técnica que este agente debe resolver.**

**Tokens semánticos ya disponibles para tipografía:**

```css
font-variant-numeric: tabular-nums;   /* aplicado en .numberDisplay, .inputField, cells de tabla */
```

(Crítico para tablas financieras — mantener.)

## Gaps detectados

- ✗ Sin escala modular documentada (los tamaños son ad-hoc)
- ✗ Sin variables CSS para los tamaños (`--type-h1`, `--type-body`, etc.)
- ✗ Sin fluid type con `clamp()` — los headings no escalan suavemente
- △ `page.module.css` usa variables que no existen (`--font-size-4xl`, etc.)
- △ Falta `mono` para datos en algunos contextos (timestamp, código)
- ✗ Sin escala line-height tokenizada (mezclado con `1`, `1.2`, `1.3`, `1.5`, `1.65`)
- ✗ Sin tokens de letter-spacing (mezclado: `-0.03em`, `0.01em`, etc.)

## Base teórica

### Anatomía
Baseline · x-height · cap height · ascender · descender · kerning · tracking · leading.

### Personalidad de las familias actuales

- **Manrope** (headline): sans-serif geométrica moderna, contraste medio,
  ideal para datos numéricos y títulos cortos. Soporta `tabular-nums` y
  todos los caracteres extendidos necesarios (ñ, ä, ç, ô).
- **Inter** (body): sans-serif humanista neutra, alta legibilidad a
  cualquier tamaño, optimizada para pantalla. Soporta los 6 idiomas del
  proyecto.

> Recordar: la guía global recomienda evitar Inter y Manrope por sobreuso,
> pero en este proyecto **ya están en producción y la combinación es sólida
> para fintech**. Cambiar requiere brief del usuario.

## Proceso

### Fase 1 — Diagnóstico y normalización

1. Recolectar TODOS los tamaños usados en `*.module.css` (rg `font-size:`)
2. Detectar valores duplicados o cercanos (ej. `15px` y `14px` para casos
   similares — colapsar)
3. Producir tabla normalizada (8-9 tamaños máximo)
4. Documentar qué cambia y dónde

### Fase 2 — Definir la escala modular

**Ratio recomendado para LoanCalc**: `1.250` (Major Third) — coherente con
el tono profesional pero claro, ya implícito en los saltos actuales
(16 → 20 → 24 → ...).

Base: **16px**.

```
Token            Cálculo         Px     Rem        Uso
─────────────────────────────────────────────────────────────────────
--type-display   16 × 1.25⁴    →  39    2.4375rem  Hero (no usado hoy)
--type-h1        16 × 1.25³    →  31    1.9375rem  Página title
--type-h2        16 × 1.25²    →  25    1.5625rem  Sección
--type-h3        16 × 1.25¹.5  →  21    1.3125rem  Subsección
--type-body-lg   16 × 1.125    →  18    1.125rem   Lead text
--type-body      16             →  16    1rem       Cuerpo (default)
--type-body-sm   16 × 0.9375   →  15    0.9375rem  Inputs, párrafos densos
--type-label     16 × 0.875    →  14    0.875rem   Labels, botones ghost
--type-meta      16 × 0.8125   →  13    0.8125rem  Metadata
--type-overline  16 × 0.75     →  12    0.75rem    Tags, mínimo absoluto
```

**Mapping con los usos actuales:**

| Uso actual | Token | Comentario |
|------------|-------|------------|
| `.numberDisplay` (3rem) | NO usar `--type-*`: es una excepción de hero financiero. Mantener `3rem` | El número de ahorro es figural — no parte de la escala de texto |
| `.sectionTitle` (1.5rem) | `--type-h2` | Sin cambios |
| `.numberDisplaySm` (1.5rem) | `--type-h2` | Reutilizar |
| `.label` (0.875rem) | `--type-label` | Sin cambios |
| `.inputField` (1rem) | `--type-body` | Sin cambios |
| `.adornment` (0.9375rem) | `--type-body-sm` | Sin cambios |
| `.btnGhost` (0.875rem) | `--type-label` | Sin cambios |
| `staticPage .subheading` (1.125rem) | `--type-body-lg` | Renombrar conceptual |
| `staticPage .paragraph` (0.9375rem) | `--type-body-sm` | Sin cambios |
| `staticPage .meta` (0.8125rem) | `--type-meta` | Sin cambios |
| `page.module.css --font-size-4xl` | `--type-h1` | **Fix deuda técnica** |
| `page.module.css --font-size-xl` | `--type-h3` | **Fix deuda técnica** |
| `page.module.css --font-size-lg` | `--type-body-lg` | **Fix deuda técnica** |

### Fase 3 — Line-height, letter-spacing y pesos

**Line-heights tokenizados (múltiplos de 4px para baseline grid):**

```css
--leading-tight:   1.1;    /* hero / numberDisplay */
--leading-snug:    1.2;    /* h1, h2 (24×1.2 = 28.8 ≈ 28) */
--leading-normal:  1.3;    /* h3, h4 */
--leading-body:    1.5;    /* body */
--leading-relaxed: 1.65;   /* lead, longform (about, privacy) */
```

**Letter-spacing:**

```css
--tracking-tighter: -0.03em;  /* numberDisplay grande */
--tracking-tight:   -0.01em;  /* h1/h2 display */
--tracking-normal:  0;
--tracking-wide:    0.01em;   /* labels */
--tracking-wider:   0.05em;   /* all-caps */
```

**Pesos a usar** (limitar al ya cargado por `next/font`):

```css
--weight-regular: 400;
--weight-semi:    600;
--weight-bold:    700;       /* solo Manrope; Inter NO carga 700 */
```

> Importante: **Inter sólo está cargada con pesos 400 y 600**.
> No usar 700/Inter ni 500/Manrope sin antes ampliar la config en
> `app/[locale]/layout.tsx`.
> Manrope sí carga 400, 600 y 700.

### Fase 4 — Fluid responsive con clamp

Para los headings que cambian fuerte entre mobile y desktop, exponer
versiones fluidas:

```css
--type-h1-fluid: clamp(1.75rem, 4vw, 1.9375rem);   /* 28 → 31 */
--type-h2-fluid: clamp(1.375rem, 3vw, 1.5625rem);  /* 22 → 25 */
--type-h3-fluid: clamp(1.125rem, 2.5vw, 1.3125rem);/* 18 → 21 */
--type-body-fluid: clamp(1rem, 1.25vw, 1.0625rem); /* 16 → 17 */
```

Estrategia: usar versión fija para tablas/inputs (cualquier cosa con
tabular-nums), fluid para headings prosaicos. El `numberDisplay` de
`ResultCards` queda fijo: el ahorro destacado debe ser estable visualmente.

### Fase 5 — Reglas específicas del producto

**Datos numéricos** (tabla de amortización, gráfico, resultados):
- SIEMPRE `font-variant-numeric: tabular-nums;` para alineación columnar
- Family: `--font-headline` (Manrope) por su mejor `tabular-nums`
- Sin justificación, alineados a la derecha en tablas (importes)

**Largo de línea (measure):**
- Prosa (about, privacy, SEO body): `max-width: 65ch;`
- Cards de la calculadora: anchura libre del grid

**All-caps:**
- Usar SOLO en labels muy específicos (chips, badges). Si se introducen,
  `letter-spacing: var(--tracking-wider)` obligatorio

**Idiomas:**
- Strings en `de` y `fr` son más largos (~15-30%) — verificar overflow
  en `LoanForm` labels y `BottomNav`
- `ja` puede ser más estrecho pero con altura distinta (verificar
  vertical rhythm)
- Asegurar que Manrope e Inter renderizan correctamente todos los
  caracteres del subset `latin` para los 6 idiomas (no incluye `ja`
  fully — los strings japoneses usan fallback `system-ui`)

## Entregable

**A) Actualizar `app/globals.css`** con el bloque de tokens:

```css
:root {
  /* Type families (ya existen — mantener) */
  --font-headline: var(--font-manrope), "Manrope", system-ui, sans-serif;
  --font-body:     var(--font-inter),   "Inter",   system-ui, sans-serif;

  /* Type sizes */
  --type-h1:          1.9375rem;   /* 31px */
  --type-h2:          1.5625rem;   /* 25px */
  --type-h3:          1.3125rem;   /* 21px */
  --type-body-lg:     1.125rem;    /* 18px */
  --type-body:        1rem;        /* 16px */
  --type-body-sm:     0.9375rem;   /* 15px */
  --type-label:       0.875rem;    /* 14px */
  --type-meta:        0.8125rem;   /* 13px */
  --type-overline:    0.75rem;     /* 12px */

  /* Type fluid (para headings escalables) */
  --type-h1-fluid:    clamp(1.75rem, 4vw, 1.9375rem);
  --type-h2-fluid:    clamp(1.375rem, 3vw, 1.5625rem);
  --type-h3-fluid:    clamp(1.125rem, 2.5vw, 1.3125rem);

  /* Leading */
  --leading-tight:    1.1;
  --leading-snug:     1.2;
  --leading-normal:   1.3;
  --leading-body:     1.5;
  --leading-relaxed:  1.65;

  /* Tracking */
  --tracking-tighter: -0.03em;
  --tracking-tight:   -0.01em;
  --tracking-normal:  0;
  --tracking-wide:    0.01em;
  --tracking-wider:   0.05em;

  /* Weights (limitados a lo cargado por next/font) */
  --weight-regular:   400;
  --weight-semi:      600;
  --weight-bold:      700;   /* solo Manrope */
}
```

**B) Refactor de archivos consumers** (sustituir hex/sizes hardcodeados):

```
shared/shared.module.css            → usar --type-* y --leading-* en lugar de px/rem sueltos
app/[locale]/page.module.css        → reemplazar --font-size-4xl/xl/lg por --type-h1/h3/body-lg
app/[locale]/staticPage.module.css  → usar tokens nuevos
components/**/*.module.css          → idem
```

**C) Exportar tokens como JSON** para herramientas externas:

`.claude/references/type-tokens.json`

```json
{
  "typography": {
    "fontFamily": {
      "headline": { "value": "Manrope, system-ui, sans-serif" },
      "body": { "value": "Inter, system-ui, sans-serif" }
    },
    "fontSize": {
      "h1": { "value": "1.9375rem", "px": 31, "fluid": "clamp(1.75rem, 4vw, 1.9375rem)" },
      "h2": { "value": "1.5625rem", "px": 25, "fluid": "clamp(1.375rem, 3vw, 1.5625rem)" },
      "h3": { "value": "1.3125rem", "px": 21, "fluid": "clamp(1.125rem, 2.5vw, 1.3125rem)" },
      "bodyLg": { "value": "1.125rem", "px": 18 },
      "body": { "value": "1rem", "px": 16 },
      "bodySm": { "value": "0.9375rem", "px": 15 },
      "label": { "value": "0.875rem", "px": 14 },
      "meta": { "value": "0.8125rem", "px": 13 },
      "overline": { "value": "0.75rem", "px": 12 }
    },
    "fontWeight": {
      "regular": 400, "semi": 600, "bold": 700
    },
    "lineHeight": {
      "tight": 1.1, "snug": 1.2, "normal": 1.3,
      "body": 1.5, "relaxed": 1.65
    },
    "letterSpacing": {
      "tighter": "-0.03em", "tight": "-0.01em", "normal": "0",
      "wide": "0.01em", "wider": "0.05em"
    }
  }
}
```

**D) Documentos**:

```
.claude/references/
  ├── type-strategy.md      # racional de la combinación Manrope+Inter
  ├── type-scale.md         # tabla completa con ejemplos
  └── type-tokens.json      # exportable
```

## Reglas

- NUNCA `body` < 16px en web (16px = `1rem` = `--type-body`).
- NUNCA más de 2 familias (Manrope + Inter). Mono solo si el Agente 01 lo
  añade explícitamente al brief.
- SIEMPRE verificar que Manrope/Inter tengan los caracteres del idioma del
  proyecto (subset `latin`). Para `ja`, depender de system-ui fallback.
- Todos los pesos que se referencien deben estar en la config de
  `next/font` en `layout.tsx`. Si se necesita un peso nuevo, ampliar la
  config — no usar uno no cargado.
- `font-variant-numeric: tabular-nums` es **obligatorio** en cualquier
  dato numérico (cells de tabla, importes, métricas, ejes del chart).
- Line-height en body ≥ 1.4 — no negociable.
- All-caps necesita `--tracking-wider`.
- Las fuentes ya cargan con `font-display: swap` (default de `next/font`).
  No reimportar Manrope/Inter desde Google Fonts CDN — duplica requests.

## Handoff al Agente 05

Confirmar que:
- Los tokens `--type-*`, `--leading-*`, `--tracking-*` están en
  `app/globals.css` y disponibles
- `shared.module.css` y los `.module.css` de componentes referencian
  esos tokens (no valores rem/px sueltos)
- La deuda técnica de `page.module.css` está resuelta
- El JSON está sincronizado con CSS
