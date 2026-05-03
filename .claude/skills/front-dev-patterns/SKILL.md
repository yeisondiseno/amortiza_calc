---
name: giftediq-patterns
description: >
  Reference for GiftedIQ Frontend code patterns (Next.js / React / TypeScript).
  Use when reviewing a file against project conventions, writing new components,
  or consulting a specific pattern with full examples.
---

# GiftedIQ Frontend — Code Patterns

> The active rules (concise enforcement) live in `.cursor/rules/code-patterns.mdc`.
> Read that file first to get the current canonical rules. This skill provides
> the full examples and rationale for each one.

---

## React imports — named types and hooks

Import from `react` by name. Do **not** use `React.X` namespace for types or hooks.

```typescript
// ✅
import { ReactNode, useState } from 'react';

// ❌
import React from 'react';
type Props = { children: React.ReactNode };
```

---

## Import order (top of file)

11 groups, each with a short `// GroupName` comment. Skip unused groups.

```typescript
// React
import { useCallback, useMemo, useState } from 'react';
// Next
import Link from 'next/link';
// Libraries
import { useTranslations } from 'next-intl';
import { useQuery } from '@tanstack/react-query';
// Hooks
import { useMyCustomHook } from '@hooks/useMyCustomHook';
// Components
import { Avatar } from '@components/index';
// Icons
import { MoreHorizonIcon } from '@icons/index';
// Utils
import { encryptPostUrl } from '@utils/index';
// Constants
import { FEED_LIMIT } from '@constants/feed';
// Services
import { getFeedAction } from '@services/actions/index';
// Types
import type { UserDTO } from '@services/dto/index';
// Styles
import './Card.scss';
```

After imports, label file-level sections: `// Constants` then `// Types (module-local)`.

---

## File length

| Lines | Action |
|-------|--------|
| ≤ 200 | No action. |
| 200–250 | Optional split: subcomponent, local hook, `*.utils.ts`, `*.constants.ts`, `*.types.ts`. |
| > 250 | **Required split** before merging. |

---

## Component body order

```typescript
function MyComponent({ id }: Props) {
  // Props
  const { id } = props;

  // Params
  const searchParams = useSearchParams();
  const ref = useRef<HTMLDivElement>(null);

  // Queries / Data
  const tab = searchParams.get('tab') ?? 'default';

  // State
  const [isOpen, setIsOpen] = useState(false);

  // Hooks
  const t = useTranslations('myComponent');
  const { data, isLoading } = useQuery({ ... });

  // Values
  const items = data?.pages.flatMap((p) => p.items) ?? [];

  // Actions
  const handleClick = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  useEffect(() => {
    // sync with external system only
  }, []);

  return (/* ... */);
}
```

---

## No switch-case — use mapping objects

```typescript
// ❌
switch (documentType) {
  case 'DNI': return '[0-9]{8}[A-Za-z]';
  case 'NIE': return '[XYZxyz][0-9]{7}[A-Za-z]';
  default: return undefined;
}

// ✅
const DOCUMENT_PATTERNS = {
  DNI: '[0-9]{8}[A-Za-z]',
  NIE: '[XYZxyz][0-9]{7}[A-Za-z]',
  Pasaporte: '[A-Za-z0-9]{6,20}',
};

return DOCUMENT_PATTERNS[documentType as keyof typeof DOCUMENT_PATTERNS] ?? '';
```

Valid exceptions: cases with complex multi-line logic, fall-through, or non-mappable logic.

---

## Multiple equality checks — use `includes`

```typescript
// ❌
const isOpen = panel === 'settings' || panel === 'myData' || panel === 'portfolio';

// ✅
const SETTINGS_PANELS: MyProfileSlidePanel[] = ['settings', 'myData', 'portfolio'];
const isOpen = SETTINGS_PANELS.includes(panel);
```

---

## JSX in a variable — use `useMemo`

```typescript
// ✅ — guards first (early return), happy path last
const threadSection = useMemo(() => {
  if (!shouldShow) return null;
  if (items.length === 0) return null;
  if (!onLoadMore) return null;

  return (
    <ThreadPanel items={items} onLoadMore={onLoadMore} />
  );
}, [shouldShow, items, onLoadMore]);
```

Place in the **Hooks** step of the body order, before `return`.

---

## State management rules

- **No `useEffect` to sync data or derive/transform props.**
- Prefer: derived values during render · event handlers · React Query / SWR for API calls · `useMemo` for expensive computations.
- `useEffect` is only for external system sync (WebSockets, third-party DOM APIs, timers).
- Every `useEffect` introduced must be justified: explain why render logic or events cannot handle it.
