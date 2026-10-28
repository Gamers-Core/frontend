# Gamers Core Storefront

The customer-facing storefront of [Gamers Core](https://gamers-core.net), a live bilingual (Arabic/English) gaming-accessories store in Egypt. Customers browse products and brands, search, keep a persistent cart, check out, and track their orders. Arabic users get a full right-to-left layout.

**Live site:** [gamers-core.net](https://gamers-core.net)

**Part of Gamers Core:** **Storefront (this repo)** · [Admin panel](https://github.com/Gamers-Core/admin) · [Backend API](https://github.com/Gamers-Core/backend)

<!-- Add screenshots to docs/screenshots/ (no real customer data):
![Home](docs/screenshots/home.png)
![Product page](docs/screenshots/product.png)
![Checkout](docs/screenshots/checkout.png)
![Arabic (RTL) layout](docs/screenshots/arabic.png) -->

## Highlights

- **Fast by design:** average search time cut from about 4s to about 1s, page size cut from 80KB+ to under 10KB, and page load reduced by about 3s by caching every page and running the frontend in the EU region, close to the database and backend.
- **Mobile first:** about 90% of real traffic is on mobile.
- **Fully bilingual:** English and Arabic routes with RTL/LTR switching, picked from the device language.
- **Complete purchase flow:** email OTP sign-in, saved addresses, shipping options, discounts, payment selection and order creation.
- **Persistent cart:** stored in `localStorage` and synchronized with the backend.
- **Analytics:** Vercel Analytics, Speed Insights and optional Meta Pixel tracking (purchases are tracked server-side by the backend).
- **Quality gate:** GitHub Actions runs type-check, lint, formatting and a production build on every push and pull request.

## Features

- Localized storefront with English (`en`) and Arabic (`ar`) routes.
- Product listing, product details, categories, brands, recommendations and search filters.
- Authentication through sign-in, one-time password verification and account setup.
- Checkout with shipping addresses, shipping options, discounts, payment selection and order creation.
- Profile management, saved addresses, order history, order details, FAQs and policies.
- Responsive UI with light/dark theme, accessible feedback states and mobile navigation.

**Stack:** Next.js (App Router), TypeScript, TanStack Query, Zustand, React Hook Form, Zod, Tailwind CSS v4, Radix-based UI, next-intl.

## Requirements

- Node.js `22.18.0` and npm
- A running Gamers Core backend, or another backend compatible with the API contract in `src/api/backend`

## Getting started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a local `.env` file in the project root (environment files are ignored by Git):

   ```dotenv
   NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
   # Optional: enables Meta Pixel page-view tracking when set.
   NEXT_PUBLIC_META_PIXEL_ID=your-pixel-id
   ```

   `NEXT_PUBLIC_BACKEND_URL` is required. The example assumes the backend runs locally with `PORT=8000`.

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000). The locale prefix is configured as-needed, so English is served at `/` and Arabic at `/ar`.

## Available commands

| Command         | Purpose                                                    |
| --------------- | ---------------------------------------------------------- |
| `npm run dev`   | Start the Next.js development server.                      |
| `npm run build` | Create a production build.                                 |
| `npm run start` | Serve the production build (run `npm run build` first).    |
| `npm run lint`  | Run ESLint.                                                |
| `npm run test`  | Run TypeScript checks, ESLint, and Prettier in check mode. |

There is no unit-test runner configured at present; `npm run test` is the quality gate.

## CI

GitHub Actions runs on every push and pull request for `dev`, `staging` and `master`. It runs `npm run test`, then `npm run build`. Run both locally before opening a pull request.

## Application routes

Routes live under `src/app/[locale]`:

| Area           | Routes                                                   |
| -------------- | -------------------------------------------------------- |
| Storefront     | `/`, `/products`, `/products/[id]`, `/brands`, `/search` |
| Customer help  | `/faqs`, `/policies/[policy]`                            |
| Authentication | `/signin`, `/verify-otp`, `/setup`                       |
| Account        | `/profile`, `/orders/[orderNumber]`                      |
| Purchasing     | `/checkout`                                              |

Access policy is enforced in `src/proxy.ts` and `src/proxy/routes.ts`: storefront and help pages are public, checkout and account pages require an authenticated session, and sign-in and OTP pages are guest-only.

## Architecture

```text
src/
├── app/[locale]/    App Router pages, layouts and global styles
├── api/backend/     Axios client, backend types, schemas and helpers
├── components/      Shared UI and domain components
├── hooks/           TanStack Query queries and mutations
├── i18n/            Locale configuration, navigation and message loading
├── lib/             General utilities and analytics integrations
├── stores/          Zustand auth, announcement and cart state
└── proxy/           Authentication and route-access policy
messages/
├── en.json          English translations
└── ar.json          Arabic translations
```

The project uses strict TypeScript and the `@/*` alias mapped to `src/*`.

### Data and state

- Backend requests go through the Axios client in `src/api/backend/api.ts`, which forwards the locale and, on the server, the incoming cookies.
- TanStack Query hooks in `src/hooks` own server data fetching, caching and mutations.
- Zustand stores in `src/stores` own browser/session state. The cart is persisted to `localStorage` and synchronized with the backend.
- Server-prefetched queries are hydrated through the provider setup; keep those hydration boundaries when adding server-rendered data.
- Forms use React Hook Form with Zod schemas from `src/api/backend/schemas`.

### Providers

`src/components/Providers.tsx` composes theme, internationalization, Query Client, tooltip, toast, analytics and development tooling. `src/components/QueryProviders.tsx` starts cart and authentication synchronization, the cart UI and page-view tracking.

## Localization

Supported locales are declared in `src/i18n/const.ts`: `en` (default, left-to-right) and `ar` (right-to-left). Update user-facing text in both `messages/en.json` and `messages/ar.json`, and use the helpers in `src/i18n/navigation.ts` so links keep the active locale.

## Styling and UI

Tailwind CSS v4 with CSS variables, Radix-based primitives and the conventions in `components.json`. Reusable primitives live in `src/components/ui`; domain components sit next to their feature. Typography uses Oxanium (Latin) and Cairo (Arabic) via `next/font`.

## Backend integration

API types, request schemas, endpoint constants, cookie helpers and response mapping live under `src/api/backend`. The client sends credentials and browser cookies, sends the locale through the `x-locale` header, and updates the locale cookie when the backend returns a locale header. When a backend contract changes, update the type or schema and the affected query or mutation hook together.

## Deployment

Set `NEXT_PUBLIC_BACKEND_URL` in the deployment environment, then run `npm run build` and `npm run start`. Do not commit `.env` files or secrets.

## Project conventions

- Keep backend schemas and API types in `src/api/backend`.
- Keep data access in hooks and browser/session state in stores.
- Preserve server/client component boundaries; add `'use client'` only where browser APIs, effects or event handlers need it.
- Keep route-access changes in `src/proxy/routes.ts` aligned with `src/proxy.ts`.
- Run `npm run test` after changes and `npm run build` for production-facing changes.
