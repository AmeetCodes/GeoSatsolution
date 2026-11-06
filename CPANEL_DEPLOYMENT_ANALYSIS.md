# GeoSAT Next.js cPanel Deployment Analysis

**Scope:** Read-only inspection of the repository as found on 2026-11-06. This report records project evidence separately from deployment recommendations. No build was run, and no environment values are reproduced.

## Project Overview

GeoSAT is a private Next.js App Router website with public company, product, industry, solution and project pages, plus an admin CMS. It has server-side API routes, MongoDB persistence through Mongoose, admin session authentication, database-backed media/document uploads and email handling through Gmail SMTP/Nodemailer.

The repository has `package-lock.json` (lockfile v3), so npm is the package manager directly evidenced by the project. `package.json` has no `engines` field. Next's installed lockfile metadata declares Node `>=20.9.0`; that is the verified minimum from the locked Next package. `Node.js 22.23.4` satisfies that declared minimum, but actual cPanel runtime support and a successful build on that host were not verified.

## Project Structure

```text
.
├── public/                  Static logos, icons, partner/team artwork
├── scripts/                 Admin account and session-secret setup tools
├── src/
│   ├── app/                  App Router pages, layouts, route handlers and UI
│   │   ├── api/              HTTP API endpoints
│   │   ├── admin/            Admin login, dashboard and CMS interface
│   │   ├── [..]/             Public site pages and route templates
│   │   └── ...               Company, products, solutions, industries, etc.
│   ├── components/           Shared layout and reusable UI components
│   └── lib/                  Auth, DB, models, services, validation, content
├── .env.example              Environment variable names and placeholders
├── next.config.ts            Next.js configuration
├── package.json              Scripts and dependency ranges
├── package-lock.json         npm dependency lockfile
├── tsconfig.json             TypeScript configuration
├── eslint.config.mjs         ESLint configuration
└── postcss.config.mjs        Tailwind PostCSS plugin configuration
```

Important subdirectories: `src/app/api` contains server endpoints; `src/lib/db` contains the connection, repositories and database services; `src/lib/models` contains Mongoose schemas/models; `src/lib/auth` implements admin session/password handling; `src/app/admin` is the CMS UI; `public` contains static site assets. No `dist` directory or custom server entry file is present in the tracked project inventory. `node_modules` and `.next` are generated/excluded directories, not source directories.

## Technology Stack

| Area | Verified project evidence |
|---|---|
| Next.js | `16.4.3` in lockfile; package range `^16.4.3` |
| React / React DOM | `19.3.1` in lockfile; package range `^19.3.1` |
| Node | No `engines` field in package.json. Locked Next declares `>=20.9.0`. |
| TypeScript | `5.9.3` in lockfile; package range `^5` |
| Database / ODM | MongoDB using Mongoose `9.10.4` |
| Authentication | Custom admin login/session cookies; bcryptjs password hashing; MongoDB sessions and login-attempt records. No third-party auth framework dependency is listed. |
| Styling/UI | Tailwind CSS 4, `@tailwindcss/postcss`, `tw-animate-css`, Base UI React, local UI components and shadcn tooling. |
| Other notable libraries | Nodemailer, Zod, Three.js / React Three Fiber / Drei / OGL, Framer Motion and Motion, GSAP, Lucide and Hugeicons, `bcryptjs`, `canvas-confetti`. |

## Package Scripts and Dependencies

Available scripts from `package.json`:

| Script | Command | Purpose |
|---|---|---|
| `dev` | `next dev --turbopack` | Development server |
| `build` | `next build --webpack` | Production build using webpack |
| `start` | `next start` | Standard Next.js production server |
| `lint` | `eslint` | Lint project |
| `typecheck` | `tsc --noEmit` | Type-check without emitting JS |
| `auth:setup` | `tsx scripts/setup-admin-session-secret.ts` | Sets up the admin session secret in local env configuration; writes a file when run. |
| `admin:create` | `tsx --env-file-if-exists=.env.local --env-file-if-exists=.env scripts/create-admin.ts` | Interactive admin account create/update against configured MongoDB. |

`npm run build` and `npm start` are the production build and start commands. No other deployment-specific script, migration script, or cron script is declared. Dependencies and development dependencies are listed in `package.json`; the exact resolved versions are recorded by `package-lock.json`. Production dependencies include Next/React, Mongoose, Nodemailer, bcryptjs, Zod, animation/3D and UI packages. Development dependencies include TypeScript, ESLint, Tailwind/PostCSS tooling, `tsx` and type packages.

## Next.js Configuration

- The configuration is `next.config.ts`.
- `output: "standalone"` is **not** set.
- `images.remotePatterns` permits HTTPS images from `images.unsplash.com`. No custom image loader or `unoptimized` setting is present. Image optimization therefore uses Next's runtime image optimizer when used through `next/image` and standard `next start`.
- `experimental.useTypeScriptCli` is set to `false`.
- No custom server, `serverExternalPackages`, base path, rewrites, redirects, or explicit port/host settings are configured in `next.config.ts`.
- Environment variables referenced by application code: `MONGODB_URI`, `ADMIN_SESSION_SECRET`, `GMAIL_BUY_USER`, `GMAIL_BUY_APP_PASSWORD`, `GMAIL_CONSULT_USER`, `GMAIL_CONSULT_APP_PASSWORD`, `NEXT_PUBLIC_APP_URL`, and built-in `NODE_ENV`.
- `src/proxy.ts` implements the Next 16 Proxy convention for `/admin/:path*`; it checks the admin cookie/session and redirects unauthenticated requests to `/admin/login`. `next start` supports this Next feature. It is not a separate network proxy configuration.
- No `middleware.ts` file is present. No application cron/scheduler configuration is present.

## Backend and API Routes

Verified route-handler files and purposes (HTTP verbs are visible in their source):

| Route | Function |
|---|---|
| `/api/admin/auth`, `/api/admin/auth/login`, `/api/admin/auth/logout`, `/api/admin/auth/refresh`, `/api/admin/auth/session` | Admin authentication, logout, renewal and session status |
| `/api/admin/content` | Admin CMS content read/write |
| `/api/admin/district-projects` | Admin district project management |
| `/api/admin/documents` | Admin document/image upload into MongoDB |
| `/api/admin/inquiries` | Admin inquiry listing/status updates |
| `/api/admin/media` | Admin image upload into MongoDB |
| `/api/admin/projects` | Admin project operations |
| `/api/admin/tree` | Admin navigation/content tree operations |
| `/api/buy` | Product purchase inquiry and email handling |
| `/api/consultation` | Consultation inquiry and email handling |
| `/api/content/nav` | Public navigation payload |
| `/api/industries`, `/api/industries/[slug]` | Public reads and CMS mutations for industries |
| `/api/media/[id]` | Serves stored media from MongoDB |
| `/api/products`, `/api/products/[slug]` | Product listing/details and mutations |
| `/api/projects/district-counts` | Project district-count data |
| `/api/solutions`, `/api/solutions/[slug]` | Solution listing/details and mutations |

Server-side behavior includes Mongoose reads/writes, path/tag cache revalidation, Zod validation, password/session verification, file byte storage and SMTP email. File uploads are database-backed rather than saved to a project upload folder: image route enforces a 5 MiB file limit and document route a 20 MiB limit in source. No cron job or scheduled server task was found. External integrations verified: MongoDB via configured URI, Gmail SMTP via Nodemailer, and browser/build-time Google font fetching (`next/font/google` uses DM Sans and Outfit). Static image remote configuration also names Unsplash.

## Authentication

Admin authentication is custom. The code uses bcryptjs for password hash checking/creation, an `ADMIN_SESSION_SECRET` to sign/verify the session token, an HttpOnly cookie named `geosat_admin_session`, and MongoDB Admin, AdminSession and AdminLoginAttempt models/services. Session policy constants indicate a 12-hour absolute lifetime, 30-minute inactivity lifetime, and a five-attempt/15-minute login rate-limit policy. `src/proxy.ts` protects `/admin/:path*`; API handlers also use admin authorization checks. Admin creation is interactive through `npm run admin:create` and requires a working database connection. This setup command must be run from a TTY to enter a password securely.

## MongoDB Configuration

- Connection helper: `src/lib/db/connection.ts`. It requires `MONGODB_URI`, caches the connection in `globalThis`, sets `maxPoolSize: 10`, and uses a 10-second server selection timeout.
- ODM: Mongoose. A database name is not hardcoded in connection source. `.env.example` shows only a placeholder URI with a `geosat_cms` database path; this is an example/default suggestion, not proof of the deployed database name. Runtime database name depends on the configured URI.
- Models defined in `src/lib/models`: Admin, AdminLoginAttempt, AdminSession, Article, Consultation, ContentMigration, Industry, Media, MediaAsset, Navigation, Resource, Client, DistrictProject, Equipment, Leader, Partner, Product, Project and Solution. Mongoose derives collection names from these model names unless overridden; no explicit `collection:` options were found in the listed model definitions.
- Uploaded media and documents are stored as binary data in `MediaAsset` MongoDB records and served from `/api/media/[id]`. This makes MongoDB capacity and backup policy important for uploads.
- The example URI uses MongoDB SRV syntax (`mongodb+srv`), suggesting Atlas-style connectivity in the template. There is no source-level proof the production cluster is MongoDB Atlas. If Atlas is used, its network access list must allow connections from the cPanel host's outbound IP(s); the actual host/IP and Atlas settings are outside this repository.
- No separate database initialization job or schema migration command is declared. `admin:create` upserts an admin record; Mongoose models/services handle application records at runtime. `ContentMigration` exists as a model, but an independently run deployment migration requirement was not established from the inspected scripts.

## Environment Variables

Names are taken from `.env.example` and source references. No values are reproduced.

| Variable | Used for | Production status |
|---|---|---|
| `MONGODB_URI` | MongoDB connection, CMS data, admin accounts/sessions, inquiries and uploaded binary assets | Required for database-backed pages, API, admin login and uploads. |
| `ADMIN_SESSION_SECRET` | Signs/verifies admin session token | Required for admin authentication/session operation. Setup script can generate/populate it in local env files; on cPanel set a strong secret in the application environment. |
| `GMAIL_BUY_USER` | Gmail SMTP account for purchase inquiry email | Required for that email path to send; code returns no configured account if missing. |
| `GMAIL_BUY_APP_PASSWORD` | Gmail SMTP credential for purchase inquiry email | Required with the corresponding user for that email path. |
| `GMAIL_CONSULT_USER` | Gmail SMTP account for consultation email | Required for that email path to send; code returns no configured account if missing. |
| `GMAIL_CONSULT_APP_PASSWORD` | Gmail SMTP credential for consultation email | Required with the corresponding user for that email path. |
| `NEXT_PUBLIC_APP_URL` | Canonical metadata, sitemap and robots base URL | Optional in source: fallback is the project's public site URL. Set it to the production canonical URL for correct metadata. Its `NEXT_PUBLIC_` value is embedded at build time. |
| `NODE_ENV` | Cookie secure flag; provided by Node/Next runtime | Next production runtime conventionally sets `production`; do not treat as an application secret. |

`.env.example` is an example, not a secret store. Set real credentials using cPanel's Node app environment controls. The report intentionally does not reproduce its placeholder URI string or any environment values.

## Build Configuration

- `package-lock.json` is present, making `npm ci` the reproducible install recommendation. No evidence requires Yarn, pnpm or Bun.
- The configured build step is `npm run build` (`next build --webpack`). No additional code-generation or asset-build script is configured.
- The standard Next production server is provided by `npm start` (`next start`). A custom Next server is not currently required by application configuration.
- Full `src` source and project config, `public/`, `package.json`, lockfile and installed runtime dependencies are needed when building on the cPanel host. For a prebuilt deployment, `.next/` and compatible runtime dependencies are also needed. A static export is not suitable: the project has server routes, MongoDB access, authentication/proxy and upload behavior.
- `.next/` is generated by `next build`; it contains compiled server/client bundles, route/build manifests, generated types and static assets/cache data used by Next. It is not a `dist` directory. There is no configured `dist` output.
- Standalone output is not enabled. Enabling it would be a project change and would require validating the resulting `standalone` server artifact and static/public asset placement for this app.

## cPanel Compatibility

**Verified:** Next's package engine minimum is Node `>=20.9.0`; 22.23.4 meets that semver floor. API handlers explicitly request Node runtime where relevant for Mongoose, Buffer/media and Nodemailer operations. The app requires a persistent Node process and writable filesystem access for normal Next runtime/cache behavior. `next start` is the configured server.

**Not verified from repository:** Whether the target cPanel provider offers Node 22.23.4, Passenger/Setup Node.js App support for Next 16, sufficient memory/disk/process limits, permitted bind/port behavior, outbound MongoDB/Gmail connectivity, or a suitable reverse-proxy setup. Confirm these with the host/provider.

No project `app.js` or Passenger configuration exists. If cPanel's interface starts an npm script, configure it to run the production `start` script and let Next bind to the provider's assigned port if supported. If the provider strictly requires a startup file, a small `app.js` launcher may be necessary to start Next on `process.env.PORT`; its precise form depends on the Passenger contract of that host and would be a code change. Do not assume a bare `next start` ignores the required host port: verify provider behavior and ensure the process binds to the port cPanel injects. Avoid introducing a custom server unless cPanel cannot launch the standard Next server.

Passenger can host Node apps, but Next compatibility is not proven solely by this repository. Validate Next 16 behavior, `/admin` Proxy, route handlers, image optimizer, streaming and restart handling on the actual cPanel plan. `npm run build` should be the intended build command based on scripts, but this report does not claim it succeeded.

## Deployment Risks

- **Memory and build limits:** Next production builds, TypeScript checking, webpack and 3D client bundles can be memory-intensive. Shared hosting may cap memory, CPU, build duration, disk or process count. Build locally/CI and transfer a compatible production build if host limits prevent on-server builds; keep Node and platform compatibility aligned.
- **Runtime RAM / native packages:** No explicit native Node addon is listed in the direct dependencies inspected; `bcryptjs` is pure JavaScript. Next's image optimizer may use its optional `sharp` package depending on install/platform; check the actual production install and host architecture. Next docs note image optimization runs at runtime and may need memory tuning on glibc systems.
- **Image optimization:** `next/image` optimization requires the Node server and available runtime resources. The only configured remote image host is `images.unsplash.com`. Ensure host can fetch remote images. Do not use static-only hosting as a replacement.
- **Persistent storage / permissions:** Next runtime may write cache/build-related files under `.next`; the application also requires `public` files and local font files. Ensure the app account can read deployment files and write to required Next cache/runtime directories. MongoDB stores CMS uploads, so the filesystem does not hold uploaded user files according to inspected upload handlers.
- **Uploads and request limits:** App-level limits are 5 MiB for images and 20 MiB for documents; Apache/Passenger/provider request body limits may be lower. MongoDB document size limits and memory use for file buffering also apply. Validate upload round trips on the host.
- **Email/network egress:** Gmail SMTP may be blocked or restricted on shared hosting. Verify outbound SMTP and MongoDB TLS/SRV DNS connectivity; the project repository cannot establish provider firewall policy.
- **MongoDB Atlas access:** If deployment uses Atlas, authorize the actual cPanel outbound IP address(es) in Atlas network access. Shared hosting IPs can be fixed or change by provider; confirm before launch.
- **Background jobs:** None are configured in project. Don't rely on an in-process timer for scheduled work; no scheduled work is identified as required.
- **Build-time public URL:** `NEXT_PUBLIC_APP_URL` is build-inlined by Next. Set the production URL before running the production build, then rebuild if it changes.
- **Build/start separation:** `npm start` expects a successful `.next` production build. Keep the matching project source, package lock/dependencies and build output together.

## Recommended Deployment Workflow

The recommendations below assume cPanel Setup Node.js App exposes a supported Node version and a Passenger startup mechanism compatible with a long-running Next server. Confirm provider specifics before deploying.

1. **Application root:** Use a private application directory under the cPanel account, such as `~/geosat-app`, outside the public document root where possible. Configure the domain/subdomain through cPanel to route to the Node app. Keep secrets outside public static directories and set file permissions appropriately.
2. **Node setting:** Select Node `22.23.4` only if the host actually offers it and supports Next 16 under Passenger. The repository-verified Next engine minimum is `>=20.9.0`.
3. **Environment:** Set `MONGODB_URI`, `ADMIN_SESSION_SECRET`, `NEXT_PUBLIC_APP_URL`, and the four Gmail variables in cPanel app environment settings. Gmail variables are necessary only if the corresponding purchase/consultation email functions must send. The two database/admin variables are necessary for CMS/database features. Set `NEXT_PUBLIC_APP_URL` before build.
4. **Install:** `npm ci`
5. **Build:** `npm run build`
6. **Initialize admin:** `npm run admin:create` from an interactive SSH TTY after setting `MONGODB_URI`; provide admin credentials at prompts. `npm run auth:setup` is a local-env-file helper that writes to `.env.local` and is not the mechanism for configuring cPanel environment variables.
7. **Start:** `npm start` where the cPanel integration allows an npm start command and passes its assigned port. If the cPanel UI requires an app startup file, add a host-appropriate launcher such as `app.js` that invokes the standard Next production server on `process.env.PORT`. This is a possible necessary change, not an existing file or verified cPanel-specific recipe.
8. **Restart and smoke-check:** Restart via cPanel after install/build/environment setup. Check public pages, dynamic DB content, `/api` handlers, admin login/session, media/document upload, image optimization and email delivery. Review cPanel application logs for failures.

No standalone output setting is active, so do not copy only `.next/standalone` as if it already existed. Preserve `public/`, `src/app/fonts/`, configuration and the standard production runtime dependencies. There is no `dist` folder expected.

## Final Conclusion

**Recommended method:** Deploy as a persistent Node.js application under cPanel Setup Node.js App / Passenger, running the standard Next.js production server after `npm ci` and `npm run build`. This is the closest fit to the repository's configured `next start` workflow and its server-dependent API, database, authentication and media functionality.

**Recommended cPanel settings:** Node 22.23.4 if offered and provider-supported; application root at a private directory such as `~/geosat-app`; production environment; domain mapped through the Node app; startup command `npm start`, with the provider-assigned port propagated. If the interface mandates a startup filename, `app.js` is not present today and may need to launch Next using the cPanel port.

**Required/conditional environment names:** `MONGODB_URI`, `ADMIN_SESSION_SECRET`, `NEXT_PUBLIC_APP_URL`; `GMAIL_BUY_USER`, `GMAIL_BUY_APP_PASSWORD`, `GMAIL_CONSULT_USER`, `GMAIL_CONSULT_APP_PASSWORD` for their respective email workflows. No actual values are included here.

**Exact core commands:**

```bash
npm ci
npm run build
npm run admin:create
npm start
```

Run `admin:create` only once database environment is configured and from an interactive SSH terminal. For future deployment updates, repeat installation/build and restart using cPanel. The exact Passenger startup file contract, host limits, MongoDB reachability and successful Node 22.23.4 build remain external validation items. No project files were altered except this requested report; an existing modified state for `.env.example` was observed and left as-is.
