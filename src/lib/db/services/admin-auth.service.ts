import connectDB from "../connection";
import { Admin } from "../../models/Admin";
import { hashPassword, needsPasswordRehash, verifyPassword } from "../../auth/password";

export interface AuthenticatedAdmin {
  email: string;
  name: string;
  role: "admin" | "superadmin";
}

export async function authenticateAdmin(
  email: string,
  password: string,
): Promise<AuthenticatedAdmin | null> {
  await connectDB();
  const admin = await Admin.findOne({ email: email.trim().toLowerCase() })
    .select("+passwordHash")
    .exec();

  if (!admin || !(await verifyPassword(password, admin.passwordHash))) return null;

  if (
    needsPasswordRehash(admin.passwordHash) &&
    Buffer.byteLength(password, "utf8") <= 72
  ) {
    const passwordHash = await hashPassword(password);
    await Admin.updateOne({ _id: admin._id }, { $set: { passwordHash } }).exec();
  }

  return {
    email: admin.email,
    name: admin.name,
    role: admin.role,
  };
}