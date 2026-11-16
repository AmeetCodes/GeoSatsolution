import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAdminSessionServer } from "./_lib/admin-auth";
import { siteContentService } from "@/lib/db/services/site-content.service";
import { navigationService } from "@/lib/db/services/navigation.service";
import { listShowcaseProjects } from "@/lib/db/services/showcase-project.service";
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
  const [content, tree, showcaseProjects, inquiries, inquiryCounts] =
    await Promise.all([
      siteContentService.getFullSiteContent(),
      navigationService.getTree(),
      listShowcaseProjects(),
      inquiryService.list(),
      inquiryService.statusCounts(),
    ]);

  return (
    <AdminDashboard
      initialContent={content}
      initialTree={tree}
      initialShowcaseProjects={showcaseProjects.map((p) => ({ ...p, _id: String(p._id), type: p.type as "service" | "sales", districts: p.districts ?? [], client: p.client ?? "", partner: p.partner ?? "", area: p.area ?? 0, coverImage: p.coverImage ?? "", galleryImages: p.galleryImages ?? [] }))}
      initialInquiries={inquiries}
      initialInquiryCounts={inquiryCounts}
      userEmail={session.email}
    />
  );
}
