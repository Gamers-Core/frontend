<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

## Project workflow

- Use Node.js 22.18.0, then run `npm install`.
- Start development with `npm run dev`.
- Run `npm run test` before handing off changes; it runs TypeScript, ESLint, and Prettier checks. There is no unit-test runner configured.
- Run `npm run build` for production-build validation. CI runs the quality gate and build; see [.github/workflows/ci.yml](.github/workflows/ci.yml).
- Keep changes consistent with [README.md](README.md), [eslint.config.mjs](eslint.config.mjs), and [.prettierrc](.prettierrc).

## Architecture

- This is a Next.js 16 App Router application. Locale routes live under `src/app/[locale]`; supported locales and navigation are defined in `src/i18n`.
- Server pages prefetch TanStack Query data and pass it through `HydrationBoundary`. Reuse query hooks from `src/hooks` when adding server prefetching or client data access.
- Keep backend schemas/types and the Axios client in `src/api/backend`, query and mutation hooks in `src/hooks`, browser/session state in `src/stores`, and reusable UI in `src/components`.
- Global providers belong in `src/components/Providers.tsx`; cross-page client synchronization belongs in `src/components/QueryProviders.tsx`.
- Authentication and route policy are enforced through `src/proxy.ts` and `src/proxy/routes.ts`. Update route policy and its middleware assumptions together when adding routes.

## Conventions and pitfalls

- TypeScript is strict and uses the `@/*` alias for `src/*`; preserve existing server/client component boundaries and add `'use client'` when browser APIs, persisted Zustand state, effects, or event handlers require it.
- Use `next-intl` helpers from `src/i18n/navigation.ts` for localized navigation where applicable. Preserve locale propagation and server cookie forwarding when calling the backend.
- Forms use React Hook Form and Zod, with translated validation messages. Follow the existing checkout form/schema pattern in `src/components/checkout` and `src/api/backend/schemas`.
- Tailwind CSS v4 uses CSS variables; use `cn()` from `src/lib/utils.ts` for class merging. The configured component/icon conventions are documented in [components.json](components.json).
- Preserve hydration boundaries when changing server-prefetched queries, and account for server/client hydration when changing the persisted cart store in `src/stores/cart`.
- `.env` must provide `NEXT_PUBLIC_BACKEND_URL` for backend access. Do not commit environment files or secrets.
