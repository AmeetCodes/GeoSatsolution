import { handleAdminSessionStatus } from "@/lib/auth/admin-auth-handlers";

export async function GET() {
  return handleAdminSessionStatus();
}
