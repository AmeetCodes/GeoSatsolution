import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAdminSessionServer } from "../_lib/admin-auth";
import { LoginPage } from "../_components/SignInPage";

export const metadata: Metadata = {
  title: "Admin Sign In | GeoSAT Solutions",
  description: "Sign in to administrative console",
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
