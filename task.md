### SYSTEM TASK: Dynamic Catch-All Routing, Layout Inheritance & SEO Engine Implementation

#### CRITICAL ARCHITECTURAL MANDATES
* **Scope-Based Colocation:** All section layout templates must live strictly inside `src/app/[...slug]/_templates/`. Do NOT leak template components into global directories.
* **Server-Side Rendering (SSR):** `src/app/[...slug]/page.tsx` MUST execute as a React Server Component (RSC). Do NOT use top-level `'use client'` directives.
* **Technical SEO First:** Every dynamic catch-all route must export dynamic metadata (`generateMetadata()`) and inject structured Schema.org JSON-LD scripts directly into the pre-rendered SSR HTML.
* **Zero UI Regression:** Visual styling, Tailwind tokens, grid structures, and interactive dialogs must remain 100% pixel-identical to existing sections.

---

#### 1. DYNAMIC CATCH-ALL ROUTE HANDLER (`src/app/[...slug]/page.tsx`)
Refactor/Implement the universal catch-all route to resolve any dynamic URL created via the Admin Navigation Tree:

* **Path:** `src/app/[...slug]/page.tsx`
* **Route Resolution Flow:**
  1. Extract slug array from route params (e.g., `['solutions', 'survey-mapping', 'uav-lidar-survey']`).
  2. Query `src/lib/tree-store.ts` via `getTreeItem(slugArray)` or `findTreeItemBySlug()` to locate the active node in `navigation-tree.json`.
  3. If node exists, query `src/lib/data-store.ts` (`getSiteContent()`) to retrieve page copy and media assets.
  4. If no node exists, invoke `notFound()` to render the standard 404 handler.

---

#### 2. SECTION LAYOUT TEMPLATE INHERITANCE (`src/app/[...slug]/_templates/`)
Colocate all layout templates inside `src/app/[...slug]/_templates/`. The catch-all page must inspect the item's primary parent tab (`tab.id`) and delegate rendering to the corresponding template:

* **Template Selection Engine (`src/app/[...slug]/_templates/index.ts`):**
  - **`Solutions` (`tab.id === 'solutions'`):** Render `SolutionsTemplate.tsx` (Hero banner, deliverables list, case studies, and `@/components/ui/ConsultationDialog.tsx`).
  - **`Products` (`tab.id === 'products'`):** Render `ProductsTemplate.tsx` (Product hero, specs grid, feature list, and `@/components/ui/ProductBuyDialog.tsx`).
  - **`Industries` (`tab.id === 'industries'`):** Render `IndustriesTemplate.tsx` (Sector focus card layout, use-case matrix, and capabilities list).
  - **`Company` (`tab.id === 'company'`):** Render `CompanyTemplate.tsx` (Article media layout, key takeaways, and resource links).
  - **Fallback (`FallbackTemplate.tsx`):** Universal root-level layout for custom top-level pages.

---

#### 3. TECHNICAL SEO & METADATA GENERATION
Ensure search engines properly index every dynamically rendered dynamic page:

1. **Dynamic Metadata Export:**
   - Export `generateMetadata({ params })` in `src/app/[...slug]/page.tsx`.
   - Resolve page title, description, and OpenGraph images from `site-content.json` via `data-store.ts`.
   - Generate canonical URL matching the human-readable slug (e.g., `https://geosat.co/solutions/survey-mapping/uav-lidar-survey`).

2. **Schema.org Structured JSON-LD Injection:**
   - Dynamically inject Schema.org scripts into the SSR HTML based on `tab.id`:
     - **Solutions:** `@type: "Service"`
     - **Products:** `@type: "Product"`
     - **Industries:** `@type: "Service"` or `@type: "Article"`
     - **Company:** `@type: "Organization"` or `@type: "NewsArticle"`

---

#### 4. DATA SEEDING & INSTANT REVALIDATION
* **Auto-Content Initialization:**
  - When a new item is created in `TreeCMSManager.tsx` (`src/app/admin/_components/`), automatically seed default placeholder content (Hero title, subtitle, specs/features array) into `site-content.json` via `PUT /api/admin/content`.
* **On-Demand Revalidation:**
  - Ensure `POST/PUT/DELETE` handlers in `/api/admin/tree` and `/api/admin/content` trigger `revalidatePath('/', 'layout')` and `revalidatePath(item.href)` so newly created/edited pages reflect instantly without rebuilds.

---

#### 5. VERIFICATION CHECKLIST
- [ ] Clicking any newly created dynamic item renders a styled page matching its parent layout instead of a 404 or blank screen.
- [ ] `src/app/[...slug]/page.tsx` executes purely as an RSC (verified via page view-source returning full semantic HTML).
- [ ] View-source confirms pre-rendered `<title>`, `<meta name="description">`, `<link rel="canonical">`, and Schema.org `<script type="application/ld+json">`.
- [ ] All section templates live strictly in `src/app/[...slug]/_templates/` and import UI primitives exclusively from `@/components/ui/`.
- [ ] Dynamic paths revalidate instantly upon Admin CMS save operations.