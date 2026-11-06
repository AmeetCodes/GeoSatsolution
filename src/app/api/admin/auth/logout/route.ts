import { handleAdminLogout } from "@/lib/auth/admin-auth-handlers";

export async function POST() {
  return handleAdminLogout();
}
