# GeoSAT Website: Current Architecture and System Flow

## Scope and Evidence

This report describes the code in the workspace at inspection time. It is based on source inspection of the App Router pages, components, route handlers, data modules, persisted JSON files, package manifest, and the one existing data-store test. No application code, data, dependencies, or database were changed. Runtime/build checks were not run; the existing test writes to the checked-in content JSON and is not isolated from it.

The worktree already had local changes in `package.json`, `package-lock.json`, `src/app/_components/sections/Hero.tsx`, `src/app/products/[slug]/page.tsx`, and untracked UI components. Those were not changed. Findings refer to the checked-out working tree, including those changes.

## 1. Project Overview

### Purpose

The project is a public GeoSAT Solutions marketing/catalogue website, with an in-app admin console for managing some content and navigation. The website describes surveying, LiDAR, GIS, monitoring, products, industries, company information, and consultation requests. There is no separate backend service or database layer in the repository; backend behavior is implemented in Next.js route handlers and server-side modules.

### Stack

- Next.js 16 App Router (`next` 16.3.7), React 19, TypeScript 5.
- Tailwind CSS 4 with project-specific global styles and reusable UI components.
- Framer Motion, GSAP, React Three Fiber/Three.js and OGL are dependencies; the website also has reusable animation/3D UI components. Their presence in the manifest does not make them part of the content-management backend.
- Nodemailer is used by the consultation route to send email through Gmail SMTP.
- JSON files and synchronous Node filesystem calls provide the only persistent content store implemented in application code.
- No MongoDB driver/ODM, SQL driver/ORM, payment SDK, or database configuration is present in `package.json`.

### Major folders

| Location | Responsibility |
| --- | --- |
| `src/app/` | App Router pages, route handlers, and route-specific templates. The homepage is assembled from fixed section components. |
| `src/app/api/` | Six HTTP route handlers for admin auth/content/tree, public content/nav reads, and consultation email submission. |
| `src/app/admin/` | Login and admin dashboard pages, client-side management components, and authentication helpers. |
| `src/app/[...slug]/` | Generic tree-driven pages and templates for solution/product/industry/company leaves not served by a more specific route. |
| `src/app/solutions/`, `products/`, `industries/`, `company/` | Separate catalogue, sector, and company pages; several of these use their own content modules rather than the CMS data. |
| `src/components/` | Shared layout and UI components, including the navbar, footer, dialogs, galleries, buttons, and optional visual components. |
| `src/lib/` | Shared content constants, JSON-file content and navigation stores, utility functions, and hooks. |
| `src/data/` | Checked-in runtime JSON files: `site-content.json` and `navigation-tree.json`. |
| `public/` | Static public assets, including team assets. |
| `scripts/` | A Node script for generating coastline assets; unrelated to CMS persistence. |

The root `src/app/layout.tsx` applies global metadata, fonts, Tailwind/global CSS, and the document shell. `next.config.ts` currently has no meaningful custom configuration. `tsconfig.json` enables strict TypeScript and the `@/*` alias to `src/*`.

## 2. Current Architecture

The application has four overlapping content/rendering paths rather than one unified CMS pipeline:

1. **Static marketing constants** in `src/lib/content.ts` drive the homepage sections, some company pages, fallback navigation, and footer defaults.
2. **Site content JSON** in `src/data/site-content.json`, accessed through `src/lib/data-store.ts`, drives admin lists, the catalogue index/detail getters, and the public content API.
3. **Navigation tree JSON** in `src/data/navigation-tree.json`, accessed through `src/lib/tree-store.ts`, drives the dynamic mega-menu, parts of the homepage industry UI, and the generic catch-all route.
4. **Separate route-local arrays** in `src/app/solutions/_lib/solutions.ts`, `products/_lib/products.ts`, `industries/_lib/industries.ts`, and `company/_lib/company-content.ts` provide defaults/fallbacks; company pages often import these arrays directly rather than their dynamic getters.

```mermaid
flowchart LR
  Admin[Admin browser UI] -->|POST with session cookie| ContentAPI[/api/admin/content]
  Admin -->|POST with session cookie| TreeAPI[/api/admin/tree]
  ContentAPI --> ContentStore[site-content.json via data-store.ts]
  TreeAPI --> TreeStore[navigation-tree.json via tree-store.ts]
  TreeAPI -->|leaf sync for solutions/products/industries| ContentStore
  Navbar[Navbar and Footer client fetches] -->|GET every 2.5s / once after mount| NavAPI[/api/content/nav]
  IndustryBand[Homepage industry section] -->|GET every 5s| NavAPI
  NavAPI --> TreeStore
  NavAPI --> ContentStore
  Catalogue[Solutions, Products, Industries routes] --> ContentStore
  CatchAll[Generic [...slug] pages] --> TreeStore
  CatchAll --> ContentStore
  HomeStatic[Static homepage sections and company pages] --> Constants[src/lib/content.ts and route-local arrays]
  Consultation[Consultation dialog] -->|POST| EmailAPI[/api/consultation]
  EmailAPI -->|SMTP only; no record created| Mailbox[Gmail recipient]
```

The filesystem stores are accessed only from server code. The navbar and homepage do not directly read JSON files; they read public API responses. Public catalogue pages read the site content from server-side helpers. The home page's principal marketing content is not assembled from the admin content document.

## 3. Complete Data Flow

### Admin login and session

1. `/admin/login` renders `SignInPage` unless `getAdminSessionServer()` accepts the cookie, in which case it redirects to `/admin`.
2. `SignInPage.handleSubmit()` posts email, password, and `rememberMe` to `POST /api/admin/auth`.
3. `validateAdminCredentials()` compares against `ADMIN_EMAIL` and `ADMIN_PASSWORD` from environment variables or their source-code fallbacks.
4. The route creates a token and sets `geosat_admin_session` as an HTTP-only cookie. The cookie is `secure` in production, `SameSite=Lax`, and lasts one day or 30 days according to `rememberMe`.
5. `/admin` checks the cookie server-side, reads both JSON stores, and passes their contents into `AdminDashboard` as initial props. Admin writes are checked again by the content/tree POST handlers.

### Site content edits

1. `SolutionsManager`, `ProductsManager`, `IndustriesManager`, and `CompanyManager` construct replacement arrays/objects in browser state.
2. `AdminDashboard.handleSaveSection()` posts `{ section, data }` to `POST /api/admin/content`.
3. The route checks the session, replaces the corresponding top-level section in `getSiteContent()`, and calls `saveSiteContent()` to synchronously write the whole JSON document.
4. The route calls `refreshContentPaths()`, which revalidates the root layout and paths derived from the navigation tree.
5. If the API response is successful, dashboard state is updated. Consumers of `site-content.json` may then use the saved values; consumers of constants or separate company arrays do not.

`POST /api/admin/content` also accepts `action: "update-all"` and `action: "reset"`. The admin UI currently uses section saves and the reset action; there is no per-record API, publish workflow, or update-all UI flow.

### Navigation/tree edits

1. `TreeCMSManager.apiCall()` posts actions to `POST /api/admin/tree`.
2. The route loads the whole tree, mutates tabs, columns, or items, then writes the full tree JSON.
3. Adding/editing a leaf under tabs with IDs `solutions`, `products`, or `industries` also calls `syncTreeItemWithSiteContent()`. That function finds the corresponding content record by title/normalized slug or appends a new one.
4. Deleting a leaf removes a title/slug-matched content entry. Deleting a tab or column does not remove associated content records from `site-content.json`.
5. The route revalidates the root layout and, for leaf changes, affected item paths. The navbar polls `/api/content/nav` every 2.5 seconds, the homepage Industries section polls it every 5 seconds, and the footer fetches it once after mount.

The tree editor UI edits tab labels/URLs/notes, column titles, and leaf title/URL/intro/description/outcomes. The API supports leaf `images` and `metadata`, but the current editor form does not expose or submit those fields.

### Public consultation

1. `ConsultationDialog` validates basic fields in the browser and posts to `POST /api/consultation`.
2. The handler validates the request, checks the requested interest against solution titles in `site-content.json`, applies length limits and a honeypot, escapes values for HTML email, and sends an email with Nodemailer if `GMAIL_CONSULT_USER` and `GMAIL_CONSULT_APP_PASSWORD` are configured.
3. The result is an email only. The request is not saved to the JSON store or a database, and the admin dashboard has no consultation inbox.

`ProductBuyDialog` does not submit to an API. It waits 500 ms in the browser, shows a successful quote-request state, and stores no request. It is not connected to the Orders table.

## 4. Data Storage Analysis

### File-backed content

`src/lib/data-store.ts` defines the TypeScript shapes and a large `DEFAULT_SITE_CONTENT` fallback. It reads/writes `src/data/site-content.json`, with the path constructed from `process.cwd()`.

| Entity | Current fields in the declared model |
| --- | --- |
| Solution | `title`, `group`, `intro`, `description`, `outcomes[]`, `images[]` (`src`, `alt`, `caption`) |
| Product | Same shape as Solution |
| Industry | `title`, `intro`, `description`, `items[]` |
| Leader | `name`, `role`, `division`, `bio` |
| Partner | `id`, `name`, `category`, `tier`, `description` |
| Insight/news article | `slug`, `title`, `date`, `category`, `excerpt`, `body[]` |
| Career role | `slug`, `title`, `category`, `location`, `summary`, `responsibilities[]`, `requirements[]` |

The top-level structure is `Solutions[]`, `Products[]`, `Industries[]`, and `Company` containing `Leadership[]`, `Partners[]`, `Insights[]`, and `Careers[]`. The primary content records mostly have no stable IDs; titles and generated slugs are used as identifiers in UI operations and matching logic.

`getSiteContent()` reads the JSON synchronously on each call. If the file is absent or parsing fails, it attempts to write `DEFAULT_SITE_CONTENT` and returns that default. `saveSiteContent()` synchronously overwrites the file and returns a boolean. The API handlers do not consistently check that boolean.

At inspection time, the persisted `site-content.json` began with two non-default-looking solution records titled `ydfbnh` and `Hello`; one contains the text `Calibrated LdsbsdgbAS/LAZ...`, and one image source is a generic Vecteezy page URL rather than an obvious image asset. This is evidence that arbitrary editor values can be persisted, not an assertion about how those entries were created.

### File-backed navigation

`src/lib/tree-store.ts` stores `NavigationTree` in `src/data/navigation-tree.json`:

- `tabs[]`: `id`, `label`, `slug`, `href`, `order`, optional `type`, `footerNote`, `catalogueCta`, and `columns[]`.
- `columns[]`: `id`, `title`, `slug`, `order`, and `items[]`.
- `items[]`: `id`, `title`, `slug`, optional `href`, `order`, `intro`, `description`, `outcomes[]`, `images[]`, and metadata fields.

This is both navigation and a second copy of some page content. The relationship between a tree leaf and a solution/product/industry record is resolved using title/normalized-slug comparisons, not a stable foreign key. Company tree items do not synchronize to the `Company` content subcollections.

### Hardcoded and non-persistent data

- `src/lib/content.ts` contains homepage copy, capabilities, projects, equipment, industry fallback content, navigation defaults, contact details, clients, partners, executive leads, and footer constants.
- Route-local content modules contain separate solutions/products/industries/company arrays. Some expose server-only dynamic getters, but several pages bypass them and import static arrays.
- `src/app/admin/_components/AdminPaymentsTable.tsx` contains seven fixed sample payment rows. They are not stored or fetched and do not represent a connected order system.
- Consultation submissions are email-only. Product quote submissions are browser-only. No application-level durable request, order, or payment record exists.
- Images are represented as URLs; there is no upload/media-management backend.

## 5. Admin Panel Workflow

### Implemented

- `/admin` is server-side gated by `getAdminSessionServer()` and redirects unauthenticated visitors to `/admin/login`.
- Credential sign-in, cookie-based session check (`GET /api/admin/auth`), and cookie deletion logout (`DELETE /api/admin/auth`) exist.
- The dashboard exposes Overview, Tree CMS, Solutions, Products, Industries, Company, Orders, and Live Preview views.
- Solutions, Products, Industries, and Company managers can create/edit/delete records in their local view and submit replacement data to the content endpoint.
- Tree CMS can add/edit/delete/reorder tabs, columns, and items through the tree endpoint.
- Reset sends two independent requests, one resetting content and one resetting the tree.
- Live Preview renders a local simulator from dashboard `content` props. Its “Open Live Route” link opens the public home page; the simulator itself is not an iframe or the actual public detail renderer.

### Partial or non-functional

- Company CRUD saves `Company` data to `site-content.json`, but the actual public leadership, partner, news, and career pages generally use hardcoded arrays, so their visible content is not updated by those saves.
- “Archive” actions in Solutions and Products only show a toast; no archive state is saved.
- The Orders view displays fixed examples only. There is no order creation, quote persistence, transaction API, or payment integration.
- Password reset and Google/GitHub SSO controls display placeholder alerts; no reset or SSO flow exists.
- Manager success toasts can appear even when the save request fails. `handleSaveSection()` catches errors internally and resolves rather than rethrowing, while callers show success after awaiting it. The dashboard may also show a separate failure toast.
- The reset UI does not treat non-2xx responses as exceptions in both requests, so it can report “Defaults Restored” even if one reset endpoint failed.
- The admin UI describes content as instantly live, but only the consumers of the changed backing store can reflect it; static pages and constants do not.

## 6. API and Backend Analysis

There are six route handlers and no independent API server.

| Route | Methods | Current behavior and access |
| --- | --- | --- |
| `/api/admin/auth` | `POST`, `GET`, `DELETE` | Credential validation and session cookie creation, current-session check, and logout cookie deletion. |
| `/api/admin/content` | `GET`, `POST` | GET returns all content or a section and is unauthenticated. POST requires an admin session; supports reset, update-all, and top-level section replacement. |
| `/api/admin/tree` | `GET`, `POST` | GET returns the tree without authentication. POST requires an admin session and supports tree reset/save plus tab/column/item CRUD and reordering. |
| `/api/content` | `GET` | Public read of solutions, products, industries, and company content. Marked `force-dynamic`. No internal browser consumer was found during source search. |
| `/api/content/nav` | `GET` | Public read combining the tree, nav groups, industry cards derived from tree columns, and solution/product content. Marked `force-dynamic`. |
| `/api/consultation` | `POST` | Node runtime; request validation and Gmail SMTP email delivery. Includes origin comparison, body-length check, honeypot, input length caps, and HTML escaping. Does not persist requests. |

Admin content/tree writes require a valid cookie session. GET access is public, which is consistent with much of this data being rendered publicly, but the endpoints return the complete documents, including any content not otherwise shown on public pages. The admin write handlers accept broad JSON objects without runtime schema validation, authorization scopes, or request-body size caps.

`saveSiteContent()` can report failure, but `/api/admin/content` ignores its return value and still responds with success. `saveNavigationTree()` catches filesystem errors internally and returns no success result, so `/api/admin/tree` can also return success after a failed write. Tree mutation is read-modify-write of the whole document; there is no transaction, revision check, audit log, or conflict handling.

The consultation endpoint is the only workflow with a server-side external side effect. It requires Gmail environment variables and returns 503 if they are absent. It does not create a lead record that an admin can review.

## 7. Frontend Rendering and Update Visibility

### Homepage (`src/app/page.tsx`)

The home page renders `Hero`, `Capabilities`, `Approach`, `Equipment`, `Projects`, `Industries`, and `CtaBand` directly. Most copy and list data come from `src/lib/content.ts`. There is no call to `/api/content` to render these sections.

Exceptions:

- `Navbar` fetches `/api/content/nav` after mount and every 2.5 seconds; before a successful response it uses `NAV` constants as a fallback.
- The home `Industries` section fetches `/api/content/nav` after mount and every 5 seconds. Its industry cards are derived from the navigation tree, not from `site-content.json`'s `Industries[]`.
- `Footer` fetches navigation once after mount and builds some footer links from the tree; static footer constants remain its initial/failure fallback.

Therefore, editing the site-content `Industries[]` in the Industries Manager does not by itself update the homepage industry cards; those are built from tree columns/items. Editing projects, capabilities, equipment, hero, CTA copy, clients, partners, or executive leads in the homepage constants has no admin editing workflow.

### Catalogue pages

- `/solutions`, `/products`, and `/industries` call `getDynamicSolutions()`, `getDynamicProducts()`, or `getDynamicIndustries()`. On the server these attempt to load the corresponding `site-content.json` section and fall back to module constants when that section is empty or unavailable.
- `/solutions/[slug]`, `/products/[slug]`, and `/industries/[slug]` use the same getters for detail content and generate static params from the current getter result; `dynamicParams = true` permits additional slugs. The static constants are also used as fallback when no JSON record matches a slug.
- Since the dynamic getters use `site-content.json`, content-manager saves can affect these server-rendered index/detail paths after the relevant route cache has been refreshed. A deleted default record may still resolve from the module-level fallback on its detail route.

### Generic tree pages

`src/app/[...slug]/page.tsx` resolves slugs using `getTreeItem()` and obtains matching content with `getPageContentForTreeItem()`. `generateStaticParams()` derives paths from tree leaves and `dynamicParams = true` allows other paths. It selects a template based on tab ID: Solutions, Products, Industries, Company, or fallback.

The route's resolved values prioritize fields already present on the tree item over values in `site-content.json`. Thus, saving only a product/solution through its section manager can leave a multi-segment generic route showing old tree fields. Conversely, tree-editor leaf edits synchronize both stores for the three recognized tab IDs.

### Company pages

The explicit company routes use static exports in `company-content.ts` or `lib/content.ts`:

- News listing/detail import `NEWS_ITEMS` directly.
- Career listing/detail import `CAREER_ROLES` directly.
- Executive/technical leads import `EXECUTIVE_LEADS` directly.
- Partner/client page imports the static `partners` and `clients` string arrays.
- Downloads/resources are also separate static content.

Although `company-content.ts` defines `getDynamicNewsItems()` and `getDynamicCareerRoles()`, these explicit listing and detail pages do not call them. Admin company edits therefore affect the JSON document and admin preview/API output, but do not update these explicit public pages.

### Request and product dialogs

- Consultation submission calls `/api/consultation`, but the form's `DEFAULT_SOLUTIONS` list is hardcoded separately from the server's allowed values, which are titles from `site-content.json`. In the inspected data, most displayed choices do not exactly match stored titles; only `Drone Photogrammetry` matches among those named options. Selecting a mismatched option is rejected by the API with “Choose a valid area of interest.”
- Product quote submission does not call any route. The UI displays a success state after a local delay, despite making no network request.

## 8. Current Limitations and Flaws

### Data consistency and propagation

- Three parallel sources exist for catalogue data: `lib/content.ts`, `site-content.json`, and route-local solution/product/industry arrays. The merge/fallback behavior differs by route.
- The tree and content document duplicate leaf fields and are joined by title/slug normalization. Renaming titles, changing slugs, duplicate titles, or deleting a tree branch can leave stale/orphaned entries or mismatched links.
- `syncTreeItemWithSiteContent()` uses one generic record shape for solutions/products/industries. For an `industries` leaf it writes fields such as `group`, `outcomes`, and `images`, but not the declared `IndustryItem.items[]` field. This can create an invalid industry document entry for code that expects `items` to be an array.
- Tree tab/column deletion leaves related site-content records intact. Content-manager deletion leaves navigation entries intact. The two workflows can therefore disagree about visibility and URL validity.
- Company manager data is not joined to the static company page arrays. Leadership schemas also differ: CMS `LeaderItem` uses `division`/`bio`, while public `ExecutiveLead` uses `description`/`image`.
- The site-content file currently contains atypical entries, and the editor/API enforce no content schema or uniqueness constraints.
- Filesystem writes replace the entire JSON file. Concurrent admin edits can overwrite each other; the operation has no locking or revision check.
- The checked-in `data-store.sync.test.ts` invokes `syncTreeItemWithSiteContent()`, which writes to the real `src/data/site-content.json`; the test has no temporary fixture/restore. Running it can alter project content. There is no `test` script in `package.json`.

### Persistence and scaling

- `process.cwd()/src/data/*.json` is local filesystem persistence. It is suitable only for a single writable runtime with a durable shared disk. On serverless/immutable/container deployments, writes may be ephemeral, unavailable, or isolated per instance; deployment platform was not verifiable from this repository.
- Synchronous `readFileSync`/`writeFileSync` and whole-document writes block the Node event loop and scale poorly as documents or request concurrency grow.
- There is no database, migration mechanism, backup/version history, audit trail, draft/publish state, or recovery workflow beyond restoring hardcoded defaults and some client-side Undo toasts.
- The default initializer can replace unreadable/corrupt content with defaults on a later read, risking loss of persisted edits.

### Authentication and security

- `admin-auth.ts` contains source fallbacks for `admin@geosatsoln.com`, the password `GeoSatAdmin2026!Secure`, and a fixed session secret. Environment values can override them, but the application does not require those values to be configured. The login UI says the account is configured in `.env` but does not itself prove that secure environment values are set.
- The session “signature” is not a cryptographic MAC. It is computed as `base64url(encodedPayload + secret).slice(0, 32)`. Because the payload string precedes the secret and the compared prefix is only 32 output characters, the appended secret does not influence that prefix for normal session payload sizes. A caller can reproduce the signature from a chosen encoded payload without knowing the configured secret, making session-cookie validation forgeable. `verifySessionToken()` checks expiry but does not validate role/email shape beyond parsing.
- There is no password hashing/user table, rate limiting, login lockout, server-side session revocation, or real password-reset/SSO flow. Logout only removes the browser cookie; a copied token remains usable until expiry.
- The cookie has useful `HttpOnly`, `SameSite=Lax`, and production `Secure` flags, but there is no explicit CSRF token or origin check on admin mutation routes. This is a missing defense-in-depth measure; the current cookie and JSON request behavior reduce common browser CSRF paths.
- Admin-authenticated strings can be embedded in JSON-LD via `dangerouslySetInnerHTML` and `JSON.stringify()` in the generic catch-all page. JSON serialization does not by itself escape a literal `</script>` sequence for HTML script context, so stored content can become an XSS vector if untrusted content reaches those fields.
- The admin content and tree GET endpoints are unauthenticated and return full JSON documents. Any future private/draft fields must not be placed in those documents without access control.
- Admin write APIs do not validate schemas, field lengths, allowed section shapes, or request sizes. Consultation has such limits, but content/tree endpoints do not.

### User-facing behavior and configuration

- The Products “Buy” UI claims a request was sent without sending or persisting it. The admin Orders/Payments table is only seven static examples.
- Consultation requests are emailed, not stored, and the hardcoded form options mostly fail exact server validation against current solution titles.
- Admin save feedback can be misleading because section-save errors are swallowed before the editor manager resolves successfully.
- SSO and password reset controls are placeholders. No user management exists.
- The site uses both `geosatsoln.com` and `geosat.co` in canonical URLs and structured data across routes, resulting in inconsistent SEO identity.
- `src/lib/content.ts` explicitly marks footer contact details as placeholders; the homepage organization schema also has a separately hardcoded phone number.

## 9. Database Readiness

There is no database integration to adapt directly. The migration source is the combination of `src/data/site-content.json`, `src/data/navigation-tree.json`, `DEFAULT_SITE_CONTENT`, `DEFAULT_NAVIGATION_TREE`, and static constants/route-local arrays. These sources must be reconciled before importing; treating one as unquestionably authoritative would lose content or preserve duplicates.

### Existing logical entities and relationships

1. **Solution** and **Product** have the same shape but are kept in separate arrays; each belongs to a group and may have outcomes and image references.
2. **Industry** has a description and list of focus items. Separately, the tree represents an industry tab with columns and leaf items. They do not have a consistent one-to-one relation today.
3. **Company content** contains leaders, partners, news/insight articles, and career roles. Public pages also have separate static representations of several of these records.
4. **Navigation** is hierarchical: tab -> column -> item. Some leaf items correspond to solution/product/industry records; company leaves mostly act as links and are not synchronized with company records.
5. **Admin identity/session** currently consists of one environment/source-level credential pair and a stateless cookie. There are no stored users or sessions.
6. **Consultation request** exists only as a transient request and outgoing email. **Product quote/order/payment** has no real entity; the displayed payment rows are fixtures and must not be imported as transactions.
7. **Media** is only external URL data; there is no upload or asset record model.

### Changes required for a MongoDB-backed design

- Choose and document one canonical source of truth for public content. Replace implicit title/slug joins with immutable IDs and explicit references from navigation leaves to content records.
- Define collection/document validation, required fields, slug uniqueness, timestamps, status/publication semantics, and ownership/category rules. Preserve optional embedded arrays where they are true value objects (outcomes/images), but avoid duplicating editable page copy in both navigation and content documents.
- Reconcile static homepage constants and route-local arrays with the persisted document. Decide which homepage modules become editable; leave intentionally fixed design copy as code only by explicit product decision.
- Import both checked-in JSON files and decide how to merge them with defaults. Normalize the atypical/duplicate records, fix invalid field shapes, generate stable IDs, and remap tree leaves before cutover.
- Move every relevant public route to the same repository/service layer, including homepage sections, company pages, listing/detail routes, the generic tree route, navbar, and footer. Establish cache invalidation/revalidation after database writes instead of client polling as the primary update mechanism.
- Add durable models and endpoints for consultation and quote requests if they must appear in admin. Do not treat the current payment fixture rows as real historical transactions.
- Replace fallback credentials and the custom token construction with validated environment configuration and established password hashing/session signing or an identity provider. Define session revocation/expiry and protect admin APIs consistently.
- Add migration/seed scripts, backups, indexes, concurrency handling, audit history, and tests that use isolated databases or fixtures. Do not run the current sync test against production content.
- Define media storage separately (for example, object storage plus metadata records) rather than storing arbitrary third-party image URLs as the only asset strategy.

## 10. Improvement Opportunities and Status

| Area | Status | What currently works / what remains |
| --- | --- | --- |
| Public site and route rendering | Implemented, split-source | Next pages and templates render; data ownership is fragmented across constants, JSON, and route-local arrays. |
| Admin access gate | Partially implemented; critical security flaw | Login cookie checks protect `/admin` and write APIs, but source fallbacks and forgeable token signature make this unsuitable as persistent production authentication. |
| Content CRUD | Partially implemented | Editors write JSON for solutions, products, industries, and company. Public propagation varies by page; errors/validation and IDs are weak. |
| Navigation CMS | Implemented for tree operations | Tabs/columns/items can be changed and the client nav refreshes. Tree/content duplication and missing cross-delete synchronization remain. |
| Public dynamic nav | Implemented | Public API and polling update navbar, footer, and homepage industry cards from tree content; polling is duplicated and not the same source as all other industry pages. |
| Consultation | Partially implemented | Email can be sent with configured Gmail credentials and the API validates input; dropdown values are mostly incompatible and requests are not retained for admin. |
| Product quote/order | Missing backend | Dialog shows a local success state only; no request, order, or payment is created. |
| News/careers/company publishing | Partially implemented in admin, not connected to explicit public routes | Content can be saved, but public pages still read static arrays. |
| Orders/payments | Missing | Admin UI is a static table of examples; no API or payment provider is connected. |
| Database persistence | Missing | Local JSON files are the only runtime data store; no MongoDB/other database configuration or migration exists. |
| Automated tests | Minimal | One `node:test` sync test exists and mutates the checked-in JSON file; package scripts define no test command. |

The highest-impact architectural work before adding MongoDB is not only replacing file I/O: it is establishing a canonical data model and making every route and UI consume it. Otherwise a database would become another parallel source while the existing hardcoded and file-backed behavior continued to diverge.