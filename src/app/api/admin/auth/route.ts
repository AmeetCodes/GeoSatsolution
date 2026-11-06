import {
  handleAdminLogin,
  handleAdminLogout,
  handleAdminSessionStatus,
} from "@/lib/auth/admin-auth-handlers";

export async function POST(req: Request) {
  return handleAdminLogin(req);
}

export async function GET() {
  return handleAdminSessionStatus();
}

export async function DELETE() {
  return handleAdminLogout();
}
