import { handleAdminRefresh } from "@/lib/auth/admin-auth-handlers";

export async function POST() {
  return handleAdminRefresh();
}
