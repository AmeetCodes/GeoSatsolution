### SYSTEM TASK: Implement Dynamic Catch-All Routing & Layout Inheritance Template System

#### OBJECTIVE
Fix the 404 "Page Not Found" and blank page errors occurring when newly created admin panel menu items are clicked. Implement a universal Dynamic Catch-All Route and Section Template Inheritance system so that ANY newly added menu item across ALL sections (`Solutions`, `Products`, `Industries`, `Company`, etc.) instantly renders a fully styled page using its parent section's design layout.

---

#### 1. THE PROBLEM TO FIX
1. **404 Errors on Custom Routes:** Newly created items (e.g., custom slugs or newly added sub-items) trigger a 404 page because no dynamic catch-all route handles unpredictable or deeply nested URL paths.
2. **Missing Page Templates:** Newly added items do not have an existing static page file or pre-configured CMS content layout, resulting in either a 404 or a completely blank screen.

---

#### 2. DYNAMIC CATCH-ALL ROUTING SETUP
Implement/Refactor Next.js dynamic routing using catch-all route handlers:

- **Create/Update Route Architecture:**
  - Standard Catch-All Route: `app/[...slug]/page.tsx` (or `pages/[...slug].tsx`)
  - Ensures ANY dynamic URL structure (e.g., `/products/survey-equipment/new-item-name` or `/solutions/gis-data/custom-page`) resolves to a dynamic renderer rather than returning a 404 error.

---

#### 3. SECTION LAYOUT & TEMPLATE INHERITANCE ENGINE
When a dynamic route is requested, the dynamic page component must inspect the database/CMS tree node for that item and inherit its layout template:

1. **Parent Section Detection:**
   - Detect which primary section/category the item belongs to (e.g., `Solutions`, `Products`, `Industries`, or `Company`).
2. **Template Mapping:**
   - **`Products` Template:** If created under `Products`, render using the standard Product detail page layout (Product Hero banner, Specs/Features grid, Inquiry CTA button, Sidebar navigation).
   - **`Solutions` Template:** If created under `Solutions`, render using the Solutions layout (Solution overview, capabilities, case study/workflow grid).
   - **`Industries` Template:** If created under `Industries`, render using the Industry sector intelligence card/grid layout.
   - **`Company` Template:** If created under `Company`, render using the standard article/text-and-media layout (matching About/Insights pages).
3. **Fallback Default Template:**
   - If an item is added directly at the root level without a specific section, use a clean universal Hero + Content layout using the site's default typography and UI framework.

---

#### 4. AUTOMATIC PAGE CONTENT SEEDING (ADMIN & CMS)
1. **Auto-Generation on Creation:**
   - When an admin creates a new nav item, automatically initialize default placeholder page content in the database (e.g., Page Title = Item Name, Default Subtitle, Default Hero Banner, and editable Rich-Text content sections).
2. **Admin Page Editor:**
   - Allow the admin to edit the page content (Title, Description, Banner, Content Blocks) directly from the admin panel for any dynamic slug.
3. **Instant Revalidation:**
   - Ensure dynamic page routes revalidate immediately upon creation/update so the newly rendered page reflects instant changes without needing a build restart.

---

#### 5. VERIFICATION CHECKLIST
- [ ] Clicking any newly created admin menu item opens a rendered page instead of a 404 error.
- [ ] A new product item created under "Survey Equipment" automatically adopts the exact styling, sidebar, and layout structure of existing product pages.
- [ ] A new solution item created under "Survey & Mapping" adopts the exact styling and layout of existing solution pages.
- [ ] Admin panel allows editing page hero title, text body, and section content for any dynamic route.
- [ ] Existing static/hardcoded pages continue to render normally without route collision.