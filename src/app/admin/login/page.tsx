import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAdminSessionServer } from "../_lib/admin-auth";
import { LoginPage } from "@/components/ui/sign-in-page";
import {
  ADMIN_DASHBOARD_PATH,
  ADMIN_LOGIN_PATH,
} from "@/lib/auth/session-config";

export const metadata: Metadata = {
  title: "Admin Login | GeoSAT Solutions",
  description: "Sign in to access the GeoSAT management console.",
  robots: {
    index: false,
    follow: false,
  },
};

type AdminLoginPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function isAdminPath(path: string): boolean {
  return path === "/admin" || path.startsWith("/admin/");
}

function getSafeCallbackUrl(value: string | string[] | undefined): string {
  const candidate = firstValue(value);
  if (!candidate || !candidate.startsWith("/") || candidate.startsWith("//")) {
    return ADMIN_DASHBOARD_PATH;
  }

  try {
    const parsed = new URL(candidate, "https://geosat.local");
    if (parsed.origin !== "https://geosat.local") return ADMIN_DASHBOARD_PATH;
    const safePath = `${parsed.pathname}${parsed.search}${parsed.hash}`;
    if (
      !isAdminPath(parsed.pathname) ||
      parsed.pathname === ADMIN_LOGIN_PATH ||
      parsed.pathname === `${ADMIN_LOGIN_PATH}/`
    ) {
      return ADMIN_DASHBOARD_PATH;
    }
    return safePath;
  } catch {
    return ADMIN_DASHBOARD_PATH;
  }
}

export default async function AdminLoginPage({ searchParams }: AdminLoginPageProps) {
  const [session, query] = await Promise.all([getAdminSessionServer(), searchParams]);

  if (session) {
    redirect(ADMIN_DASHBOARD_PATH);
  }

  return (
    <LoginPage
      redirectTo={getSafeCallbackUrl(query.callbackUrl)}
      initialReason={firstValue(query.reason)}
    />
  );
}
