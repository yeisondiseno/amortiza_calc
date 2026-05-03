---
alwaysApply: false
---

## 1. SSR — Server Components

In async Server Components (pages, layouts), call actions with `await`. No React Query.

**Reference**: `src/app/(authenticated)/(completeLayout)/my-profile/page.tsx`

```tsx
// Server Component (no 'use client')
const MyProfilePage = async () => {
  const t = await getTranslations('profilePage');
  const session = await auth();

  // Data: await server actions
  const portfolio = await getUserPortfolioAction();
  const { data } = portfolio;
  const {
    profilePhotoUrl,
    cognitiveBio,
    academicFormation,
    specializations,
    thematicInterests,
  } = data ?? {};

  const score = await getUserPortfolioMyScoreAction();
  const { data: scoreData } = score ?? {};

  return <main>{/* use data */}</main>;
};
```

**Conventions:**

- Actions return `{ status, data?, error? }`. Destructure `data` with nullish coalescing: `data ?? {}`.
- Run multiple fetches in parallel when independent: `const [a, b] = await Promise.all([getA(), getB()]);`

---

## 2. CSR — Single fetch (React Query `useQuery`)

For Client Components with a one-off or dependency-driven fetch, use `useQuery`. The `queryFn` calls the server action.

**Reference**: `src/components/molecules/Reactions/Reactions.tsx`

```tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import { getFeedCommentsAction } from '@services/actions/index';

const Reactions = ({ feedId }: { feedId?: number }) => {
  const { data: result, isLoading } = useQuery({
    queryKey: ['feedComments', feedId, PAGE_NUMBER],
    queryFn: () =>
      getFeedCommentsAction({
        feedId: feedId!,
        pageSize: PAGE_SIZE,
        pageNumber: PAGE_NUMBER,
      }),
    enabled: feedId != null,
  });

  const comments =
    result?.status === 200 && Array.isArray(result?.data?.items)
      ? result.data.items
      : [];

  if (isLoading) return <Loading />;
  return <CommentList comments={comments} />;
};
```

**Conventions:**

- `queryKey`: Include identifiers (e.g. `feedId`, `pageNumber`) so each resource is cached separately.
- `enabled`: Use when the query depends on props/state (e.g. `enabled: feedId != null`).
- Response: Check `result.status === 200` and `result.data` before using.

---

## 3. CSR — Paginated / infinite list (`useInfiniteQuery`)

For infinite scroll or paginated lists, use `useInfiniteQuery`.

**Reference**: `src/app/(authenticated)/(completeLayout)/feed/components/FeedBase.tsx`

```tsx
'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { getFeedAction } from '@services/actions/index';

const PAGE_SIZE = 10;

export const FeedBase = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: ['feed', tab],
    queryFn: async ({ pageParam }) => {
      const result = await getFeedAction({
        feedType,
        pageSize: PAGE_SIZE,
        pageNumber: pageParam,
      });
      return result;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.status !== 200) return undefined;
      const items = lastPage.data?.items;
      if (!Array.isArray(items) || items.length < PAGE_SIZE) {
        return undefined;
      }
      return allPages.length + 1;
    },
  });

  const items = data?.pages.flatMap((page) => page.data?.items ?? []) ?? [];

  // IntersectionObserver calls fetchNextPage when sentinel enters viewport
};
```

**Conventions:**

- **Pagination**: API uses 1-based `pageNumber`. `initialPageParam: 1`.
- **getNextPageParam**: Return `undefined` when no more pages. For 1-based APIs: `return allPages.length + 1` when there are more items.
- **Stop condition**: No more pages when `items.length < PAGE_SIZE` or `!Array.isArray(items)`.
- **Flatten pages**: `data?.pages.flatMap((page) => page.data?.items ?? []) ?? []`.
- Handle `isLoading`, `isError`, and empty `items` in the UI.

---

## Summary

| Scenario                       | Pattern                                  | Import                                       |
| ------------------------------ | ---------------------------------------- | -------------------------------------------- |
| Server Component (page/layout) | `await getXAction()`                     | `@services/actions`                          |
| Client: single fetch           | `useQuery` + action as `queryFn`         | `@tanstack/react-query`, `@services/actions` |
| Client: infinite list          | `useInfiniteQuery` + action as `queryFn` | `@tanstack/react-query`, `@services/actions` |

Actions and fetchers: `.cursor/rules/services.mdc`. DTOs: `.cursor/rules/dtos.md`.
