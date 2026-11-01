import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAdminSessionServer } from "../_lib/admin-auth";
import { LoginPage } from "@/components/ui/sign-in-page";

export const metadata: Metadata = {
  title: "Admin Login | GeoSAT Solutions",
  description: "Sign in to access the GeoSAT management console.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLoginPage() {
  const session = await getAdminSessionServer();

  if (session) {
    redirect("/admin");
  }

  return <LoginPage redirectTo="/admin" />;
}
