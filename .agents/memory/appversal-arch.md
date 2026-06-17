---
name: AppVersal architecture
description: Key patterns, constraints, and decisions for the AppVersal growth platform
---

## Brand
- Name: **AppVersal**, monogram: **AV**. Never use AppGrowth or AG.

## Orval naming collision rule
Operations with BOTH path params AND query params generate a duplicate `Params` type — fixed by removing query params from any operation that also has path params. Never add query params to operations that have path params.

**Why:** Orval generates a `*Params` type for both path and query params; two operations in the same file can collide.

## Timestamp handling
DB returns `createdAt` as `Date` objects from Drizzle — must call `.toISOString()` before returning in JSON, or Zod will reject them. Applied in orders route and dashboard route.

**Why:** Drizzle returns native `Date`; Zod `z.string()` for date fields expects a string.

## Routing structure
- API at `/api` (port 8080), frontend at `/` (Vite dev server). Proxy handles routing by path.
- Never add Vite proxy configs — the shared monorepo proxy already handles cross-service routing.
- Orders hooks: `useListOrders`, `useCreateOrder`, `useDeleteOrder`, `useUpdateOrder`; query key helper: `getListOrdersQueryKey`.

## Page/route map
- `/order/ratings` — 3-step ratings order flow
- `/order/aso-installs` — 3-step ASO keyword installs flow
- `/order/videos` — portfolio + AI/Non-AI pricing + order form
- `/orders` — My Orders with status tabs, restart/copy/delete per row
- `/marketing` — Meta Ads + Apple Search Ads tabs, interest form

## Constants file
`artifacts/appgrowth/src/constants.ts` — COUNTRIES, RATING_PRICE (0.89), ASO_INSTALL_PRICE (0.12), AI_VIDEO_PRICE (10), NON_AI_VIDEO_PRICE (30), RATING_QUANTITIES, ASO_INSTALL_QUANTITIES, SERVICE_LABELS, STATUS_COLORS.

## Payments
Skipped — show "Payments coming soon — your order will be confirmed manually" on all order forms.
