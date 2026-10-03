# GeoSAT Solutions — Project Architecture & Structure Reference

> **Last updated:** 2026-10-03 after Scope-Based Architecture Refactoring + SSR/SEO Audit

---

## 1. Architectural Principles

### 1.1 Scope-Based (Feature-Colocated) App Router

All feature-specific code lives **inside** the route folder it belongs to, inside private Next.js directories (prefixed with `_`). Next.js ignores these folders as routes but TypeScript can import them normally.

- `_components/` → client components used only in this route scope
- `_lib/` → server-safe data helpers, types, and resolvers for this scope
- `_templates/` → layout templates (only in the `[...slug]` catch-all)

**Rule:** A private folder from scope A must **never** be imported by scope B. Cross-cutting utilities belong in `src/lib/` or `src/components/ui/`.

### 1.2 Server-Side Rendering (SSR) & SEO

- Every `page.tsx` is a **React Server Component (RSC)** — no `'use client'` at top level.
- Each page exports a `generateMetadata()` function with a canonical URL, title, description, keywords, and OpenGraph tags.
- Structured **JSON-LD** schemas are embedded into `<script type="application/ld+json">` inside SSR HTML for Google rich results.
- Schema types used: `Organization`, `Service`, `Product`, `JobPosting`, `NewsArticle`.

### 1.3 Dynamic Catch-All Routing

`src/app/[...slug]/page.tsx` is the universal fallback for any URL path created via the CMS (Navigation Tree). It reads the tree at request time and delegates rendering to the right template based on the content type.

---

## 2. Full Directory Tree (Current State)

```
GeoSatSoln/
│
├── public/                              # Static assets served at root URL
│
├── src/
│   │
│   ├── app/                             # Next.js App Router root
│   │   │
│   │   ├── layout.tsx                   # Root layout: fonts, dark theme, metadata template
│   │   ├── page.tsx                     # Home page (RSC) — Organization JSON-LD
│   │   ├── globals.css                  # Tailwind base + design tokens (CSS variables)
│   │   ├── favicon.ico
│   │   │
│   │   ├── _components/                 # ← Home page private scope
│   │   │   ├── sections/                # Single-use homepage section components
│   │   │   │   ├── Hero.tsx             # Full-screen hero with 3D WebGL Globe
│   │   │   │   ├── Capabilities.tsx     # 4 core geospatial disciplines with icons
│   │   │   │   ├── Approach.tsx         # Methodology & quality assurance standards
│   │   │   │   ├── Equipment.tsx        # Survey instruments & hardware previews
│   │   │   │   ├── Projects.tsx         # Major project portfolio showcase
│   │   │   │   ├── Industries.tsx       # Sector intelligence cards grid
│   │   │   │   └── CtaBand.tsx          # Contact CTA + consultation trigger band
│   │   │   └── three/                   # Interactive 3D Globe (React Three Fiber + WebGL)
│   │   │       ├── HeroGlobe.tsx        # Top-level globe orchestrator (R3F Canvas)
│   │   │       ├── GlobeCanvas.tsx      # R3F canvas wrapper with camera controls
│   │   │       ├── GlobeScene.tsx       # Scene graph: surface + plates + stars
│   │   │       ├── GlobeSurface.tsx     # Sphere mesh with custom shader material
│   │   │       ├── GlobePlate.tsx       # Animated tectonic-style surface divisions
│   │   │       ├── GlobeWebGL.tsx       # Raw WebGL fallback renderer
│   │   │       ├── Coastlines.tsx       # Vector coastline overlay (SVG path → WebGL)
│   │   │       ├── Graticule.tsx        # Latitude/longitude grid lines
│   │   │       ├── LandPoints.tsx       # Point-cloud land mass visualization
│   │   │       ├── StarField.tsx        # Procedural star background particle system
│   │   │       ├── framing.ts           # Camera framing math utilities
│   │   │       ├── globeShaders.ts      # GLSL vertex + fragment shader strings
│   │   │       └── palette.ts           # Globe color palette constants
│   │   │
│   │   ├── admin/                       # ← Admin Console scope
│   │   │   ├── page.tsx                 # Protected dashboard (RSC: redirects if no session)
│   │   │   ├── login/
│   │   │   │   └── page.tsx             # Admin sign-in page
│   │   │   ├── _components/             # Admin-only interactive UI (all 'use client')
│   │   │   │   ├── AdminDashboard.tsx   # Master tab container — routes to each manager
│   │   │   │   ├── AdminHeader.tsx      # Top bar: branding, session info, logout
│   │   │   │   ├── AdminOverview.tsx    # System health, analytics & quick-action cards
│   │   │   │   ├── AdminPaymentsTable.tsx # Transaction/consultation activity log
│   │   │   │   ├── SolutionsManager.tsx # CRUD editor for survey solutions content
│   │   │   │   ├── ProductsManager.tsx  # CRUD editor for hardware catalog content
│   │   │   │   ├── IndustriesManager.tsx # CRUD editor for industry sectors content
│   │   │   │   ├── CompanyManager.tsx   # Editor for news, careers, team & partners
│   │   │   │   ├── TreeCMSManager.tsx   # Drag-and-drop navigation tree hierarchy editor
│   │   │   │   ├── LivePreview.tsx      # Responsive iframe: desktop / tablet / mobile
│   │   │   │   └── SignInPage.tsx       # Admin login form with credentials
│   │   │   └── _lib/
│   │   │       └── admin-auth.ts        # HMAC token signing, cookie ops, session verify
│   │   │
│   │   ├── solutions/                   # ← Solutions scope
│   │   │   ├── page.tsx                 # Solutions directory listing (RSC) — Service JSON-LD
│   │   │   ├── [slug]/
│   │   │   │   └── page.tsx             # Solution detail page (RSC) — Service JSON-LD
│   │   │   ├── _components/             # ⚠️ STALE — originals now live in @/components/ui/
│   │   │   │   ├── ConsultationDialog.tsx  # (duplicate — canonical: @/components/ui/)
│   │   │   │   ├── SolutionFaq.tsx         # (duplicate — canonical: @/components/ui/)
│   │   │   │   └── SolutionGallery.tsx     # (duplicate — canonical: @/components/ui/)
│   │   │   └── _lib/
│   │   │       └── solutions.ts         # Solution types, slug generator, CMS resolvers
│   │   │
│   │   ├── products/                    # ← Products scope
│   │   │   ├── page.tsx                 # Hardware catalog listing (RSC) — Product JSON-LD
│   │   │   ├── [slug]/
│   │   │   │   └── page.tsx             # Product detail page (RSC) — Product JSON-LD
│   │   │   ├── _components/             # ⚠️ STALE — original now lives in @/components/ui/
│   │   │   │   └── ProductBuyDialog.tsx    # (duplicate — canonical: @/components/ui/)
│   │   │   └── _lib/
│   │   │       └── products.ts          # Product types, slug generator, CMS resolvers
│   │   │
│   │   ├── industries/                  # ← Industries scope
│   │   │   ├── page.tsx                 # Sectors directory listing (RSC) — Service JSON-LD
│   │   │   ├── [slug]/
│   │   │   │   └── page.tsx             # Industry detail page (RSC) — Service JSON-LD
│   │   │   └── _lib/
│   │   │       └── industries.ts        # Industry types, slug logic, CMS resolvers
│   │   │
│   │   ├── company/                     # ← Company & Insights scope
│   │   │   ├── about/
│   │   │   │   ├── executive-technical-leads/
│   │   │   │   │   └── page.tsx         # Leadership profiles with interactive accordion
│   │   │   │   └── geosat-partners/
│   │   │   │       └── page.tsx         # Partner firms and institutional clients
│   │   │   ├── careers/
│   │   │   │   ├── page.tsx             # Open roles directory (RSC) — JobPosting JSON-LD
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx         # Job posting detail (RSC) — JobPosting JSON-LD
│   │   │   ├── insights/
│   │   │   │   ├── downloads-technical-resources/
│   │   │   │   │   └── page.tsx         # Manuals, spec sheets, whitepapers download hub
│   │   │   │   └── news/
│   │   │   │       ├── page.tsx         # Field notes and press listing (RSC)
│   │   │   │       └── [slug]/
│   │   │   │           └── page.tsx     # Article reader (RSC) — NewsArticle JSON-LD
│   │   │   ├── _components/             # ⚠️ STALE — original now lives in @/components/ui/
│   │   │   │   ├── AccordionGallery.tsx    # (duplicate — canonical: @/components/ui/)
│   │   │   │   └── AccordionGallery.css    # (duplicate — canonical: @/components/ui/)
│   │   │   └── _lib/
│   │   │       └── company-content.ts   # News articles, career roles, partner data
│   │   │
│   │   ├── [...slug]/                   # ← Universal Catch-All Route
│   │   │   ├── page.tsx                 # Resolves any CMS-created URL; dynamic metadata
│   │   │   └── _templates/              # Section-aware layout templates
│   │   │       ├── index.ts             # Barrel export for all templates
│   │   │       ├── SectionBadge.tsx     # Small coloured badge showing section label
│   │   │       ├── SolutionsTemplate.tsx  # Hero + deliverables + consultation CTA layout
│   │   │       ├── ProductsTemplate.tsx   # Specs grid + inquiry dialog + image gallery
│   │   │       ├── IndustriesTemplate.tsx # Sector intelligence card layout
│   │   │       ├── CompanyTemplate.tsx    # Article + media + resource links layout
│   │   │       └── FallbackTemplate.tsx   # Universal root-level page fallback layout
│   │   │
│   │   ├── leadership/
│   │   │   └── page.tsx                 # Legacy route redirect → executive-technical-leads
│   │   │
│   │   └── api/                         # Server-Side API Routes
│   │       ├── admin/
│   │       │   ├── auth/route.ts        # POST: validate credentials, issue session cookie
│   │       │   ├── content/route.ts     # GET/PUT: read or write site-content.json
│   │       │   └── tree/route.ts        # GET/POST/PUT/DELETE: navigation tree CRUD
│   │       ├── consultation/route.ts    # POST: validate + email consultation requests
│   │       └── content/
│   │           ├── route.ts             # GET: public site content consumer endpoint
│   │           └── nav/route.ts         # GET: public navigation tree consumer endpoint
│   │
│   ├── components/                      # ← Strict Global Scope (shared across ≥2 scopes)
│   │   ├── layout/                      # Site-wide chrome — rendered on every page
│   │   │   ├── Navbar.tsx               # Mega-menu navigation bar (dynamic from tree-store)
│   │   │   └── Footer.tsx               # Responsive site footer with links & branding
│   │   └── ui/                          # Reusable design primitives & shared interactive UI
│   │       ├── Button.tsx               # Animated CTA button with gradient variants
│   │       ├── Reveal.tsx               # Intersection-Observer scroll-reveal wrapper
│   │       ├── Section.tsx              # Page section wrapper with Container helper
│   │       ├── SpecularButton.tsx       # Specular-highlight premium button
│   │       ├── SpecularButton.css       # Specular button CSS animation
│   │       ├── SwipeRow.tsx             # Mobile swipe-to-action table row
│   │       ├── SwipeToast.tsx           # Swipe feedback toast notification
│   │       ├── avatar.tsx               # Radix UI Avatar primitive wrapper
│   │       ├── badge.tsx                # Inline status/label badge component
│   │       ├── carousel.tsx             # Embla-based image/content carousel
│   │       ├── confetti.tsx             # Canvas confetti celebration trigger
│   │       ├── dialog.tsx               # Radix UI Dialog primitive (headless)
│   │       ├── layout-grid.tsx          # Bento-style masonry layout grid
│   │       ├── table.tsx                # Styled HTML table primitives
│   │       ├── AccordionGallery.tsx     # ✅ CANONICAL — GSAP animated team accordion
│   │       ├── AccordionGallery.css     # ✅ CANONICAL — Accordion gallery styles
│   │       ├── ConsultationDialog.tsx   # ✅ CANONICAL — Consultation quote request modal
│   │       ├── ProductBuyDialog.tsx     # ✅ CANONICAL — Equipment inquiry dialog
│   │       ├── SolutionFaq.tsx          # ✅ CANONICAL — FAQ accordion for deliverables
│   │       └── SolutionGallery.tsx      # ✅ CANONICAL — Field project image carousel
│   │
│   ├── data/                            # JSON flat-file databases (source of truth)
│   │   ├── navigation-tree.json         # Hierarchical site nav & menu (CMS-editable)
│   │   └── site-content.json            # All CMS content: solutions, products, industries, news
│   │
│   └── lib/                             # Global cross-cutting utilities (≥2 scopes)
│       ├── tree-store.ts                # Nav tree reader, slug matcher, item traversal (816 lines)
│       ├── data-store.ts                # JSON content engine: interfaces, read/write (651 lines)
│       ├── content.ts                   # Static contacts, logos, executive team data (390 lines)
│       ├── geo.ts                       # Spherical math: lat/lng, great-circle, projection (186 lines)
│       ├── hooks.ts                     # React hooks: viewport, GPU tier detection (109 lines)
│       ├── random.ts                    # Seeded pseudo-random number generator (21 lines)
│       ├── utils.ts                     # cn(), slugify(), solutionSlug() helpers (17 lines)
│       └── data/                        # Geographic datasets for 3D globe
│           ├── land.ts                  # World land polygon vertices
│           ├── landMask.ts              # Land/ocean binary mask
│           ├── landOutline.ts           # Coastline vertex arrays
│           └── globeGraticule.ts        # Lat/lng graticule line vertices
│
├── package.json                         # npm dependencies & scripts
├── tsconfig.json                        # TypeScript config — @/* → src/*
├── tailwind.config.ts                   # Tailwind theme: colors, fonts, animation tokens
├── components.json                      # shadcn/ui component registry config
└── format.md                            # This architecture reference document
```

---

## 3. Key File Responsibilities

| File | Lines | Role |
|---|---|---|
| `src/lib/tree-store.ts` | 816 | **Core nav engine** — reads `navigation-tree.json`, resolves slug paths, provides `getTreeItem()`, `allTreeItems()`, `getNavTree()` |
| `src/lib/data-store.ts` | 651 | **Content engine** — reads/writes `site-content.json`, exports all TypeScript interfaces (`SolutionItem`, `ProductItem`, etc.), exposes `getSiteContent()` / `saveSiteContent()` |
| `src/lib/content.ts` | 390 | **Static data** — company contacts, branding logos, executive team profiles (`EXECUTIVE_LEADS`), partner list |
| `src/lib/geo.ts` | 186 | **Spatial math** — great-circle distance, spherical-to-Cartesian, used by 3D globe |
| `src/lib/hooks.ts` | 109 | **Client hooks** — `useWindowSize()`, GPU tier detection for adaptive WebGL quality |
| `src/lib/utils.ts` | 17 | **Helpers** — `cn()` (clsx + tailwind-merge), `slugify()`, `solutionSlug()` |
| `src/app/admin/_lib/admin-auth.ts` | — | **Auth** — HMAC-SHA256 session tokens, `httpOnly` cookie, `verifyAdminSession()` |
| `src/app/[...slug]/page.tsx` | — | **Catch-all router** — resolves CMS URLs, selects template via `tab.id`, injects metadata |

---

## 4. Scope Isolation Matrix

| Scope | URL Prefix | Private `_components/` | Private `_lib/` | Templates |
|---|---|---|---|---|
| **Home** | `/` | `_components/sections/` + `_components/three/` | — | — |
| **Admin** | `/admin` | `admin/_components/` | `admin/_lib/admin-auth.ts` | — |
| **Solutions** | `/solutions` | ⚠️ stale copies only | `solutions/_lib/solutions.ts` | — |
| **Products** | `/products` | ⚠️ stale copy only | `products/_lib/products.ts` | — |
| **Industries** | `/industries` | — | `industries/_lib/industries.ts` | — |
| **Company** | `/company` | ⚠️ stale copies only | `company/_lib/company-content.ts` | — |
| **Catch-All** | `/[...slug]` | — | — | `[...slug]/_templates/` |
| **Global** | All routes | `components/layout/` + `components/ui/` | `lib/` | — |

---

## 5. Data Flow

```
Browser Request
      │
      ▼
 Next.js App Router
      │
      ├── Exact route match? ──► Named page.tsx (e.g. solutions/[slug])
      │                                │
      │                                ▼
      │                        generateMetadata() ──► title, canonical, OG, JSON-LD
      │                                │
      │                                ▼
      │                    RSC reads _lib/*.ts ──► getSiteContent() / getTreeItem()
      │                                │
      │                                ▼
      │                    Returns SSR HTML + JSON-LD to browser
      │
      └── No exact match? ──► [...slug]/page.tsx (catch-all)
                                       │
                                       ▼
                              getTreeItem(slugArray) from tree-store
                                       │
                                       ▼
                              switch(tab.id) selects template:
                              ┌───────────────────────────────┐
                              │ solutions  → SolutionsTemplate │
                              │ products   → ProductsTemplate  │
                              │ industries → IndustriesTemplate│
                              │ company    → CompanyTemplate   │
                              │ *          → FallbackTemplate  │
                              └───────────────────────────────┘
```

---

## 6. CMS Architecture (Flat-File JSON)

The site uses **no database**. All content is stored in two JSON files:

| File | Edited By | Read By |
|---|---|---|
| `src/data/navigation-tree.json` | Admin `TreeCMSManager` → `POST /api/admin/tree` | `tree-store.ts` → `Navbar`, `[...slug]/page.tsx` |
| `src/data/site-content.json` | Admin `*Manager` components → `PUT /api/admin/content` | `data-store.ts` → all detail pages |

After every admin write, `revalidatePath('/')` flushes the Next.js SSR cache.

---

## 7. ⚠️ Stale Duplicate Files (Safe to Delete)

These are orphaned originals left behind after components were promoted to global `src/components/ui/`. All imports already point to canonical versions. No imports reference these stale files.

| Stale File | Canonical Replacement |
|---|---|
| `src/app/solutions/_components/ConsultationDialog.tsx` | `src/components/ui/ConsultationDialog.tsx` |
| `src/app/solutions/_components/SolutionFaq.tsx` | `src/components/ui/SolutionFaq.tsx` |
| `src/app/solutions/_components/SolutionGallery.tsx` | `src/components/ui/SolutionGallery.tsx` |
| `src/app/products/_components/ProductBuyDialog.tsx` | `src/components/ui/ProductBuyDialog.tsx` |
| `src/app/company/_components/AccordionGallery.tsx` | `src/components/ui/AccordionGallery.tsx` |
| `src/app/company/_components/AccordionGallery.css` | `src/components/ui/AccordionGallery.css` |

---

## 8. API Route Contract Summary

| Method | Route | Auth | Purpose |
|---|---|---|---|
| `POST` | `/api/admin/auth` | No | Login — validate credentials, set session cookie |
| `GET` | `/api/admin/content` | ✅ | Read full `site-content.json` |
| `PUT` | `/api/admin/content` | ✅ | Write full `site-content.json` |
| `GET` | `/api/admin/tree` | ✅ | Read full `navigation-tree.json` |
| `POST/PUT/DELETE` | `/api/admin/tree` | ✅ | Mutate navigation tree nodes |
| `GET` | `/api/content` | No | Public read of site content |
| `GET` | `/api/content/nav` | No | Public read of navigation tree |
| `POST` | `/api/consultation` | No | Submit consultation form → email dispatch |
