---
alwaysApply: false
---

# Next-Intl Translations Rule

This rule outlines the standard patterns for using `next-intl` translations in the project based on render strategy.

## Configuration

### Files Structure

- `src/i18n/request.ts` - Server-side configuration for next-intl
- `public/messages/es.json` - Translation messages file (Spanish)
- `next.config.mjs` - Plugin configuration with `createNextIntlPlugin()`

### Root Layout Setup

The `NextIntlClientProvider` is configured in `src/app/layout.tsx` wrapping all children, making translations available throughout the app.

## Usage Patterns

### 1. Server Components (RSC) - Pages and Layouts

Use `getTranslations` from `next-intl/server` for async server components.

```typescript
import { getTranslations } from 'next-intl/server';

const MyPage = async () => {
  const t = await getTranslations('namespace');

  return <h1>{t('title')}</h1>;
};

export default MyPage;
```

**Key points:**

- Import: `import { getTranslations } from 'next-intl/server';`
- Function must be `async`
- Use `await getTranslations('namespace')` to get the translator
- Access nested keys with dot notation: `t('form.email.label')`

### 2. Client Components

Use `useTranslations` hook from `next-intl` for client components.

```typescript
'use client';

import { useTranslations } from 'next-intl';

const MyComponent = () => {
  const t = useTranslations('namespace');

  return <p>{t('message')}</p>;
};

export default MyComponent;
```

**Key points:**

- Must have `'use client';` directive at the top
- Import: `import { useTranslations } from 'next-intl';`
- Hook is synchronous (no `await`)
- For root-level access (no namespace): `useTranslations()`

### 3. Accessing Multiple Namespaces

```typescript
'use client';

import { useTranslations } from 'next-intl';

const MyComponent = () => {
  const t = useTranslations('loginPage.form'); // Specific namespace
  const tGlobal = useTranslations('global'); // Global namespace
  const tRoot = useTranslations(); // Root access

  return (
    <div>
      <p>{t('email.label')}</p>
      <p>{tGlobal('loading')}</p>
      <p>{tRoot('homePage.title')}</p>
    </div>
  );
};
```

## Translation File Structure (`public/messages/es.json`)

```json
{
  "namespace": {
    "key": "Value",
    "nested": {
      "key": "Nested value"
    }
  },
  "global": {
    "loading": "Cargando...",
    "backButton": "Volver"
  }
}
```

## Naming Conventions

### Namespaces

- **Pages**: Use page name in camelCase: `homePage`, `loginPage`, `feedPage`
- **Layouts**: Use `global.layoutName`: `global.loginLayout`
- **Components**: Use parent context or `header`, `footer`, etc.
- **Shared**: Use `global` for app-wide translations

### Keys

- Use camelCase for keys: `submitButton`, `forgotPasswordLink`
- Group related keys: `form.email.label`, `form.email.placeholder`
- Error messages: `form.email.errors.required`, `form.email.errors.invalid`

## Examples from Codebase

### Server Component (Page)

```typescript
// src/app/[user]/(login)/login/page.tsx
import { getTranslations } from 'next-intl/server';

const LoginPage = async ({ params }: LoginPageType) => {
  const t = await getTranslations('loginPage');

  return (
    <main>
      <p>{t('registerLink')}</p>
      <Button>{t('registerButton')}</Button>
    </main>
  );
};
```

### Client Component (Form)

```typescript
// src/app/[user]/(login)/login/components/LoginForm.tsx
'use client';

import { useTranslations } from 'next-intl';

const LoginForm = () => {
  const t = useTranslations('loginPage.form');
  const tForm = useTranslations(); // Root access for dynamic keys

  return (
    <form>
      <InputGroup
        label={t('email.label')}
        placeholder={t('email.placeholder')}
        error={errors.email?.message && tForm(errors.email?.message)}
      />
      <Button>{t('submitButton')}</Button>
    </form>
  );
};
```

## Common Patterns

### Dynamic Translation Keys

When translation keys come from variables (e.g., Zod validation):

```typescript
const tForm = useTranslations();
// errors.email?.message could be "global.zod.email.invalid"
const errorMessage = tForm(errors.email?.message);
```

### Conditional Translations

```typescript
const t = await getTranslations(isCompany ? 'iAmCompanyPage' : 'iAmUserPage');
```

### Translations with Parameters

```json
{
  "greeting": "Hello, {name}!"
}
```

```typescript
t('greeting', { name: 'John' }); // "Hello, John!"
```

## Quick Reference

| Context          | Import             | Function            | Async         |
| ---------------- | ------------------ | ------------------- | ------------- |
| Server Component | `next-intl/server` | `getTranslations()` | Yes (`await`) |
| Client Component | `next-intl`        | `useTranslations()` | No (hook)     |

## Checklist for New Pages/Components

1. ☐ Determine if component is Server or Client
2. ☐ Add appropriate import
3. ☐ Add translations to `public/messages/es.json`
4. ☐ Use correct namespace based on location
5. ☐ For client components, ensure `'use client';` directive
6. ☐ For server components, ensure function is `async`
