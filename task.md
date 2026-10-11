# GeoSAT — Complete Database Integration, Admin CRUD, Dynamic Rendering & Codebase Cleanup

## Objective

Implement the complete MongoDB-backed content management architecture for the existing GeoSAT website.

The goal is to establish a single, reliable source of truth for all database-managed content. Everything an authorized admin creates, edits, updates, replaces, publishes, unpublishes, or deletes through the admin panel must be correctly reflected in MongoDB and on its corresponding public website routes.

The existing public website design, page structure, layouts, and working functionality must be preserved. Admin-created content must use the appropriate existing page templates and design patterns rather than introducing inconsistent or automatically generated layouts.

**Important:** This is an integration and architecture task, not a redesign or a request to add new features. Inspect the existing codebase thoroughly before changing anything.

---

## 1. Inspect the Existing Codebase

Before implementation, thoroughly inspect the complete existing project, especially:

* `src/data/`
* `src/lib/`
* `src/models/` or the existing schema/model directories
* `src/app/` and all public routes
* `src/app/api/` and existing API route handlers
* Admin dashboard pages, forms, tables, and CRUD operations
* Existing authentication and authorization
* Existing JSON files and static content
* Hardcoded arrays, constants, interfaces, and types
* Existing navigation structure and route relationships
* Existing database connection and environment configuration
* Existing cache, revalidation, and data-fetching logic
* Existing tests and project scripts

Identify every content source and determine which parts of the application currently use:

* MongoDB
* JSON files
* Hardcoded arrays or objects
* Static page content
* Admin form state
* API responses
* Mock or placeholder data

Create a clear internal mapping between each admin-managed content type, its database model, its API operations, its admin interface, and its corresponding public routes.

Do not assume that a file is unused just because it appears outdated. Trace its imports, references, and runtime usage before modifying or removing it.

---

## 2. Verify and Implement the MongoDB Connection

* Reuse the existing MongoDB configuration and environment variables.
* Implement or improve a reusable `connectDB()` function.
* Ensure connections are safely reused across Next.js requests and development hot reloads.
* Handle connection errors and invalid configuration clearly.
* Prevent duplicate connections and unnecessary database connections.
* Ensure server-only database code is not exposed to client components.
* Test the connection using the existing project structure and a safe verification method.

Do not expose database credentials, connection strings, or sensitive configuration in client-side code or API responses.

---

## 3. Review and Complete Database Models

Review all existing Mongoose schemas and relationships before creating or modifying models.

Cover every content type that the existing admin panel is intended to manage, including where applicable:

* Solutions and solution categories
* Products and product categories
* Industries
* Company information
* Leadership and team members
* Partners and clients
* Projects and case studies
* Insights and articles
* Careers and job listings
* Homepage content and sections
* Navigation items and their relationships
* Consultation and quote requests, if already supported by the application

For each model:

* Define appropriate fields and data types.
* Add required fields, defaults, enums, and constraints.
* Use stable IDs and slugs for relationships and public routes.
* Add appropriate indexes for frequently queried fields.
* Define relationships without unnecessarily duplicating the same content.
* Support publishing status and timestamps where relevant.
* Ensure the model matches the actual admin form fields and public page requirements.

Do not introduce new content types or fields without a clear requirement in the existing application.

Preserve existing schemas and data wherever possible. Avoid destructive schema changes.

---

## 4. Implement Zod Validation

Create or improve Zod validation schemas for all relevant create and update operations.

* Validate incoming request bodies before database operations.
* Match validation rules to the corresponding Mongoose models and admin forms.
* Validate IDs, slugs, required fields, enum values, URLs, and nested structures where applicable.
* Support partial updates without incorrectly requiring every field.
* Reject invalid or unexpected fields where appropriate.
* Return consistent, understandable validation errors.
* Prevent malformed requests from reaching database write operations.

Keep validation definitions reusable and avoid maintaining conflicting validation rules in multiple locations.

---

## 5. Build a Clean Repository and Service Layer

Establish a clear separation of responsibilities within the existing Next.js application.

**Repository layer**

* Handle database queries and persistence.
* Provide reusable create, read, update, delete, and listing operations.
* Keep raw Mongoose queries out of API route handlers and UI components.

**Service layer**

* Handle business rules and relationships.
* Apply publishing rules and other required content logic.
* Coordinate repository operations where multiple models are involved.
* Handle conditions such as duplicate slugs and missing records.

**API layer**

* Handle HTTP requests and responses.
* Validate incoming data.
* Enforce authentication and authorization.
* Call the appropriate services.
* Return consistent status codes and response formats.

Use a modular monolith architecture inside the existing Next.js project. Do not add a separate Express backend or unnecessary architectural layers.

---

## 6. Implement Complete API CRUD Operations

Implement or improve API endpoints for every existing admin-managed content type.

Support the appropriate operations:

* `GET` — List and retrieve content.
* `POST` — Create new content.
* `PUT` or `PATCH` — Update existing content.
* `DELETE` — Delete content.

Requirements:

* Follow the existing Next.js App Router conventions.
* Support filtering, pagination, and sorting where required by existing admin interfaces.
* Validate IDs and request bodies.
* Handle missing records, duplicate slugs, invalid input, and database errors correctly.
* Return appropriate HTTP status codes.
* Use consistent response structures.
* Protect all write operations with proper authentication and authorization.
* Ensure public read endpoints expose only content that is intended to be public.
* Do not create duplicate endpoints if an existing endpoint can be safely extended.

Implement and verify one complete content type at a time, beginning with Solutions.

---

## 7. Secure Admin Authentication and Authorization

Inspect the existing authentication system before modifying it.

* Ensure only authenticated and authorized administrators can create, edit, publish, unpublish, or delete content.
* Verify authentication on the server for every protected API operation.
* Fix existing security weaknesses that could allow forged or unauthorized sessions.
* Use secure password handling and session management appropriate to the existing application.
* Protect sensitive configuration and credentials.
* Ensure unauthorized requests receive proper error responses.
* Preserve the existing admin login experience unless a change is necessary for security or functionality.

Do not treat hiding admin buttons or pages in the frontend as sufficient authorization.

---

## 8. Connect Every Admin CRUD Interface to MongoDB

Replace existing JSON-file operations, mock data, and disconnected form behavior with real API and database operations wherever those interfaces manage persistent content.

For each existing admin-managed content type:

* Load records from the database.
* Create new records through the API.
* Edit and update the correct existing record.
* Replace existing values without creating unintended duplicates.
* Delete the correct record.
* Support publishing and unpublishing where applicable.
* Refresh or update the interface after successful operations.
* Display accurate loading, empty, success, and error states.
* Preserve existing form fields and working UI behavior.
* Ensure failed operations never display false success messages.

Every admin action must have a real, verified outcome. Do not leave buttons that only update local state or display simulated success when the operation is expected to persist data.

If an existing interface is only a placeholder or is not intended to manage persistent content, do not invent functionality for it. Document any such limitation.

---

## 9. Connect Public Pages to Database-Managed Content

Make the public website retrieve its database-managed content from the canonical data layer instead of duplicate hardcoded arrays, disconnected JSON files, or outdated static data.

For every content type:

* Identify the public routes that display it.
* Fetch the correct records using the relevant database services.
* Use stable IDs and slugs for route lookups and relationships.
* Render the appropriate published content.
* Handle missing, unpublished, or deleted content correctly.
* Preserve existing SEO metadata, page behavior, and route structure.
* Avoid unnecessary database queries and repeated fetching.
* Keep server-side database access separate from client-side components.

**Design and layout requirements:**

* Preserve the existing design and structure of every public page.
* Use existing reusable components and page templates wherever possible.
* Render admin-created content inside the correct existing layout.
* Ensure new records appear consistently with neighboring cards, sections, detail pages, and other items of the same type.
* Support optional fields and missing images without breaking the layout.
* Do not create arbitrary page designs from admin-entered text.
* Do not allow admin content to inject arbitrary code, scripts, or CSS into public pages.
* Where a content type needs multiple presentation formats, use the existing page templates and clearly defined content fields to select the appropriate presentation.

If the existing application does not have a suitable reusable template for a content type, identify that gap and implement only the minimum required component to preserve the site's established design.

---

## 10. Establish Reliable Content Relationships and Routing

Ensure admin-managed content is connected to the correct public pages and related records.

* Use stable database IDs for internal relationships.
* Use unique, validated slugs for public-facing routes where appropriate.
* Ensure navigation items point to valid routes or content records.
* Keep categories, related items, and parent-child relationships consistent.
* Handle slug changes without leaving stale references.
* Prevent accidental deletion or broken references where relationships require protection.
* Ensure newly created content appears in the correct listing and detail routes.
* Ensure deleted or unpublished content no longer appears in public listings or navigation where applicable.

Do not rely on matching titles or labels to establish database relationships.

---

## 11. Implement Publishing and Cache Revalidation

Establish a reliable publishing workflow consistent with the existing application.

* Support draft and published states where appropriate.
* Ensure public pages display only content permitted by the publishing rules.
* Revalidate the relevant routes after successful create, update, delete, publish, or unpublish operations.
* Revalidate affected listing pages, detail pages, and navigation where necessary.
* Avoid unnecessary global cache invalidation.
* Ensure admin previews or draft views do not accidentally expose unpublished content publicly.
* Handle deleted or changed slugs so outdated pages do not continue showing stale content.

Verify that changes made in the admin panel become visible on the correct public routes without requiring a manual server restart.

---

## 12. Remove Duplicate and Obsolete Content Sources Safely

After the database integration is complete and verified, clean up the existing codebase.

The database must become the single source of truth for content that is managed through the admin panel.

Identify and remove, only when confirmed unnecessary:

* JSON files whose content has been fully migrated to MongoDB.
* Hardcoded arrays or objects that duplicate database-managed content.
* Old data-fetching functions and repository code replaced by the new implementation.
* Disconnected CRUD handlers and obsolete API routes.
* Duplicate interfaces, types, validation rules, and constants.
* Mock records and placeholder data no longer required.
* Unused components and imports related to the old content system.
* Redundant polling or refresh logic replaced by reliable data fetching and revalidation.

**Strict deletion rules:**

* Do not delete files based only on their names or assumptions.
* Trace imports, references, route usage, and runtime behavior first.
* Confirm that the replacement implementation works before removing the old one.
* Preserve static content that is intentionally part of the design, layout, or application configuration.
* Do not remove assets, design components, environment configuration, or unrelated working code.
* Do not delete the original data until its migration and integrity have been verified.
* If a file has mixed responsibilities, remove only the obsolete content logic and preserve the required functionality.
* Do not leave duplicate data sources active after migration.

After cleanup, search the entire project for references to the removed files, old data structures, and outdated functions. Fix broken imports and confirm the application builds successfully.

---

## 13. Verify the Complete End-to-End Workflow

Test the real application workflow, not just isolated database functions.

For each migrated content type, verify the applicable operations:

1. An authorized admin creates a record.
2. The record is saved correctly in MongoDB.
3. The admin interface displays the saved record.
4. The corresponding public listing displays the record using the correct existing design.
5. The public detail route displays the correct content.
6. The admin edits or replaces the record.
7. MongoDB contains the updated values without unintended duplicate records.
8. The public pages display the updated content.
9. The admin publishes or unpublishes the record, where supported.
10. The public website follows the publishing rules.
11. The admin deletes the record.
12. The record disappears from the relevant admin and public views.
13. Unauthorized users cannot perform protected operations.
14. Invalid requests and database failures produce accurate error states.

Also verify:

* Database connection and reconnection behavior.
* Validation and relationship integrity.
* Navigation and route correctness.
* Cache revalidation.
* Existing responsive layouts and working features.
* Build, lint, and relevant automated tests.

Do not claim an operation works unless it has been verified.

---

## 14. Final Codebase Review and Report

After implementation:

* Review the final project structure.
* Identify any remaining duplicate or obsolete content sources.
* Confirm all admin-managed content uses MongoDB as its persistent source of truth.
* Confirm public routes render the correct database content through the intended page templates.
* Confirm no required design components or unrelated functionality were removed.
* Report any incomplete migration or known limitation honestly.

Provide a final report containing:

* What was implemented.
* Which content types are fully database-driven.
* Which admin operations were verified.
* Which public routes were connected.
* Which files were created, modified, or safely removed.
* Which old JSON files, hardcoded arrays, and duplicate logic were eliminated.
* Tests and build checks performed, including their actual results.
* Any remaining issues or work that still requires attention.

## Non-Negotiable Rules

* Inspect before modifying.
* Implement in small, verifiable stages.
* Use the existing Next.js application; do not create a separate backend.
* MongoDB must be the single source of truth for admin-managed persistent content.
* Admin CRUD operations must perform real database operations.
* Public routes must display the correct saved and published content.
* Existing design and layout must be preserved.
* Reuse existing components and code wherever appropriate.
* Do not introduce unrequested features or redesigns.
* Do not retain duplicate JSON or hardcoded content sources for data that has been migrated.
* Do not delete files until their replacement is implemented and their usage is verified.
* Do not report completion for functionality that has not been implemented and tested.

**Begin by inspecting the current codebase and mapping the existing content flow. Then implement and verify the complete Solutions workflow first. Once it works end to end, apply the same architecture to the remaining existing admin-managed content types.**
So, for example:

Admin creates "LiDAR Survey"

→ Admin form submits it
→ Zod validates it
→ API receives it
→ Service processes it
→ Repository saves it
→ MongoDB stores it
→ relevant cache is revalidated
→ /solutions/lidar-survey fetches it
→ existing Solution page template renders it
→ visitor sees it

That is explicitly the goal of the prompt: MongoDB becomes the single source of truth for admin-managed content.

And importantly: it does NOT mean

It will not make MongoDB store your CSS/design.

Your code still controls the design:

MongoDB
   ↓
Title
Description
Image
Slug
Category
Features
etc.
   ↓
Existing React/Next.js component
   ↓
Your GeoSAT design

So if you add a new Solution from Admin, it should appear using the same Solution card/detail-page structure, rather than creating some random new design. The prompt specifically requires this.

The cleanup part is also important

After migration, it should not leave you with:

MongoDB
   +
site-content.json
   +
solutions.ts
   +
hardcodedSolutions[]
   +
anotherSolutions[]

Instead:

             MongoDB
                ↓
        Single source of truth
                ↓
        Next.js data layer
          ↙           ↘
     Admin Panel    Public Pages

Old JSON, duplicate arrays, mock data, obsolete APIs, etc. should be removed only after the agent verifies they are no longer needed.