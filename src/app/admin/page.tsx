import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAdminSessionServer } from "./_lib/admin-auth";
import { siteContentService } from "@/lib/db/services/site-content.service";
import { navigationService } from "@/lib/db/services/navigation.service";
import { contentService } from "@/lib/db/services/content.service";
import { districtProjectService } from "@/lib/db/services/district-project.service";
import { inquiryService } from "@/lib/db/services/inquiry.service";
import { AdminDashboard } from "./_components/AdminDashboard";

export const metadata: Metadata = {
  title: "Admin Console | GeoSAT Solutions",
  description: "Administrative control portal for GeoSAT operations and data catalog.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminPage() {
  const session = await getAdminSessionServer();

  if (!session) {
    // When user types localhost:3000/admin and is not logged in, redirect to admin login page
    redirect("/admin/login");
  }

  // When logged in, provide full access to admin dashboard backed by MongoDB
  const [content, tree, projects, districtProjects, inquiries, inquiryCounts] =
    await Promise.all([
      siteContentService.getFullSiteContent(),
      navigationService.getTree(),
      contentService.getProjects(),
      districtProjectService.listRecords(),
      inquiryService.list(),
      inquiryService.statusCounts(),
    ]);

  return (
    <AdminDashboard
      initialContent={content}
      initialTree={tree}
      initialProjects={projects.map((p) => ({ code: p.code, title: p.title, sector: p.sector, body: p.body, tags: p.tags, images: (p.images || []).map((image) => ({ src: image.src, alt: image.alt || p.title, caption: image.caption || "", source: image.source, mediaId: image.mediaId ? String(image.mediaId) : undefined })), isPublished: p.isPublished !== false }))}
      initialDistrictProjects={districtProjects}
      initialInquiries={inquiries}
      initialInquiryCounts={inquiryCounts}
      userEmail={session.email}
    />
  );
}
