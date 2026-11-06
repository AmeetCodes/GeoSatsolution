import { handleAdminLogin } from "@/lib/auth/admin-auth-handlers";

export async function POST(req: Request) {
  return handleAdminLogin(req);
}
