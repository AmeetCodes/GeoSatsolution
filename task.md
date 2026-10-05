# GeoSAT — Improve Content Schemas, Admin Forms & Dynamic Page Templates

Inspect the existing GeoSAT codebase, current MongoDB schemas, admin panel, and public pages before making changes.

The main requirement is:

> **Admin controls the content. The application controls the design.**

Do not create a page builder or allow admins to change layouts, colors, CSS, or component structures. Every dynamically created page must automatically use the same existing design, spacing, typography, colors, cards, sections, responsive behavior, and UI structure as its neighboring pages of the same content type.

---

## 1. Solutions

Improve the Solution schema and admin interface so an admin can create and manage a complete Solution page using structured content.

Admin should be able to manage:

* Topic / title
* Short description
* Main/hero image
* Additional images / image gallery
* Detailed description/content
* Key features or important points where required by the existing design
* FAQ questions and answers
* Slug
* Category/type where already required
* Published/unpublished status

The admin should **not** control the page design.

When a new Solution is created:

```text
Admin Panel
   ↓
Solution content
   ↓
MongoDB
   ↓
Existing Solution page template
   ↓
/solutions/[slug]
```

The new page must automatically use the same Solution page design as the existing Solution pages. Only the content, images, title, description, FAQs, etc. should change.

Use the provided Solution page image/reference as the visual reference for determining which content should be editable from the admin panel while keeping the visual structure fixed.

---

## 2. Products

Improve the Product schema and admin CRUD interface using the same principle.

Admin should manage the important content required by the existing Product page design, including:

* Product name/topic
* Short description
* Detailed description
* Main image
* 2–3 additional images for the existing image carousel
* Important specifications/details required by the current UI
* FAQ questions and answers
* Slug
* Category where applicable
* Published/unpublished status

All Product pages must use **one consistent Product page template**.

Creating a new product from Admin must automatically produce a page using the same:

* Layout
* Colors
* Typography
* Sections
* Cards
* Image carousel
* FAQ design
* Responsive behavior

Only the database content should change.

---

## 3. Industries

Keep Industries simple.

The admin should primarily manage the existing Industry cards:

* Industry title
* Short description
* Image/icon required by the current card
* Slug/link
* Published status where applicable

Do not add unnecessary complex page-building functionality for Industries.

The existing Industry card design must remain unchanged.

---

## 4. Company → About

### Executive & Technical Leads

Create/improve the schema and admin CRUD so admins can add, edit, and remove team members.

Admin should manage fields required by the existing design, such as:

* Name
* Position/title
* Short biography/details
* Profile image
* Relevant professional information already supported by the current page
* Display/order if required

Every member added through Admin must automatically appear using the existing Executive & Technical Leads design.

Editing or deleting a member must update the MongoDB record and the public page.

Do not create a different design for each member.

### GeoSAT Partners

Use the same approach.

Admin should be able to:

* Add partner
* Edit partner
* Delete partner
* Add partner name/details
* Add partner logo/image
* Manage any other fields already required by the existing Partner UI
* Control ordering if required

All partners must render using the existing Partner design.

---

## 5. Insights

### News & Field Notes

Admin should be able to manage the structured content required by the existing Insights design, including where applicable:

* Title
* Short description/excerpt
* Main image
* Article/content
* Slug
* Published date
* Author if already supported
* Published/unpublished status

New articles must automatically use the existing News & Field Notes listing and detail-page design.

### Downloads & Technical Resources

Admin should be able to manage:

* Title
* Description
* Thumbnail/image where required
* Resource/file
* Resource type/category where required
* Published status

Use the existing Downloads & Technical Resources UI and design. Do not create arbitrary layouts.

---

## 6. Careers

Create structured admin CRUD for the existing career categories:

* Survey & GIS Engineering Roles
* UAV & LiDAR Operations Roles
* Software Development Roles

Admin should be able to add and manage job postings with the fields actually required by the existing Careers UI, such as:

* Job title
* Category/role type
* Short description
* Full description
* Requirements
* Responsibilities
* Location
* Employment type
* Application information
* Published/open/closed status
* Any existing fields already supported by the current design

All career postings must automatically use the existing Careers page/job-detail design.

---

## 7. Database and Admin Rules

For every section above:

* Admin create → save to MongoDB.
* Admin edit → update the existing MongoDB record.
* Admin delete → remove/archive according to the existing requirement.
* Admin publish/unpublish → update the database status.
* Public pages fetch the data from MongoDB.
* Public pages render the data through the existing fixed template.
* Use stable IDs and slugs for relationships and routes.
* Validate all admin input with Zod.
* Protect all write operations with admin authentication.
* Revalidate affected public routes after successful changes.

MongoDB must be the **single source of truth** for admin-managed content.

---

## 8. Remove Duplicate Content Sources

After each content type is successfully connected and verified:

* Remove the old hardcoded arrays that duplicate MongoDB data.
* Remove JSON content that has been successfully migrated to MongoDB.
* Remove obsolete mock/placeholder records.
* Remove duplicate types, interfaces, and data-fetching logic.
* Remove old CRUD logic that is no longer used.

Do not remove anything based on assumptions.

Before deleting a file or data source:

1. Check all imports and references.
2. Confirm the new MongoDB implementation replaces its functionality.
3. Verify the relevant admin CRUD works.
4. Verify the corresponding public route works.
5. Then remove the obsolete code.

Do not remove static design configuration, reusable UI components, or other code that is still required.

---

## 9. Most Important Design Rule

Do **not** build a dynamic page builder.

The architecture must be:

```text
ADMIN
  ↓
Structured Content
  ↓
MongoDB
  ↓
Fixed Next.js Page Template
  ↓
Public Page
```

For example:

```text
Solution A
Solution B
Solution C
```

must all use the same Solution page structure.

Only this changes:

```text
Title
Description
Images
Details
FAQs
Other structured content
```

The following must remain controlled by the code:

```text
Colors
Typography
Spacing
Layout
Sections
Animations
Cards
Buttons
Responsive behavior
Page structure
```

Apply this same principle to Products, Industries, Company, Insights, and Careers.

Do not redesign the existing public website. Improve the schemas and admin forms so the correct content can be managed from Admin and rendered dynamically through the existing design system.

Start by inspecting the existing implementation and image/reference design, then update the schemas and Admin UI before connecting the corresponding public templates.
