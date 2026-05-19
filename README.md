# Lumi

Lumi is a localized Next.js App Router site for a wellbeing nonprofit. The app
combines a polished landing experience with route-level content pages, modal
detail views, localized dictionaries, strict security headers, and Sentry
instrumentation.

Production URL: https://lumi.zezulka.me

## Stack

- Next.js 16 App Router with React 19 and TypeScript
- Tailwind CSS 4 for styling
- Framer Motion and Lenis for motion and smooth scrolling
- next-themes for light and dark mode
- Sentry for observability, with Vercel Analytics and Speed Insights available
  as dependencies
- Vitest, Playwright, Storybook, ESLint, and Lighthouse CI for quality checks

## Project Structure

- `app/[lang]/` contains localized App Router pages for `en` and `cs`.
- `app/[lang]/@modal/` contains intercepted modal routes for selected content
  pages.
- `app/api/` contains route handlers for CSP reports, Sentry examples, and team
  Gravatar profiles.
- `components/` contains the landing page sections, navigation, providers, and
  shared UI components.
- `dictionaries/` stores English and Czech copy.
- `lib/` contains dictionaries, team data, utilities, hooks, focus management,
  and scroll helpers.
- `proxy.ts` handles locale redirects, CSP nonce creation, and security response
  headers that require request context.
- `next.config.ts`, `sentry.*.config.ts`, `instrumentation*.ts`,
  `netlify.toml`, and `lighthouserc.json` define framework, monitoring,
  deployment, and audit configuration.
- `e2e/`, `tests/`, `*.test.ts`, and `*.test.tsx` contain browser, React, and
  node-oriented tests.

## Local Development

Use Node.js `>=20.9.0`.

```bash
npm install
npm run dev
```

Open http://localhost:3000. Requests without a locale prefix are redirected by
`proxy.ts`; the main local entry points are:

- http://localhost:3000/en
- http://localhost:3000/cs

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Next.js development server. |
| `npm run build` | Build the production app. |
| `npm run start` | Serve the production build. |
| `npm run lint` | Run ESLint. |
| `npm run test` | Run the default Vitest suite. |
| `npm run test:node` | Run Vitest with the node-specific config. |
| `npm run test:e2e` | Run Playwright against a local Next dev server. |
| `npm run storybook` | Start Storybook on port 6006. |
| `npm run build-storybook` | Build the static Storybook output. |
| `npm run sentry:sourcemaps` | Inject and optionally upload Sentry source maps. |
| `npm run format` | Format source, config, JSON, CSS, and Markdown files. |

## Content And Routing

Supported locales are `en` and `cs`. Copy lives in `dictionaries/en.json` and
`dictionaries/cs.json`, then flows through `lib/dictionary.ts` and
`DictionaryProvider`.

The root `proxy.ts` file follows the Next.js 16 Proxy convention. It redirects
unprefixed paths to the best locale from the `locale` cookie, `Accept-Language`,
or the English fallback. It also creates the per-request CSP nonce used by the
App Router layout.

Primary public routes:

- `/en` and `/cs`
- `/[lang]/features`
- `/[lang]/developer`
- `/[lang]/vision`
- `/[lang]/privacy`

## Security And Observability

Security headers are split between request-aware logic in `proxy.ts` and static
headers in `next.config.ts`. The proxy sets the CSP, nonce, and cache policy;
the Next config sets frame, content type, referrer, permissions, and HSTS
headers.

Sentry is wired through `instrumentation.ts`, `instrumentation-client.ts`,
`sentry.server.config.ts`, `sentry.edge.config.ts`, and the `withSentryConfig`
wrapper in `next.config.ts`. Set `SENTRY_AUTH_TOKEN` when uploading source maps;
without it, `npm run sentry:sourcemaps` only injects them and skips upload.

## Deployment

The production build is generated with:

```bash
npm run build
```

`netlify.toml` configures Netlify to run the build and publish `.next` with
`@netlify/plugin-nextjs`. The codebase also includes Vercel analytics packages
and metadata using `https://lumi.zezulka.me` as the canonical base URL.

For Lighthouse CI, build and serve the app, then run the LHCI workflow against
the URLs configured in `lighthouserc.json`.
