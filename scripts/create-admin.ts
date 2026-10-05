import { createInterface } from "node:readline/promises";
import { Admin } from "../src/lib/models/Admin";
import { hashPassword } from "../src/lib/auth/password";
import connectDB, { disconnectDB } from "../src/lib/db/connection";

async function ask(prompt: string): Promise<string> {
  const interface_ = createInterface({ input: process.stdin, output: process.stdout });
  try {
    return (await interface_.question(prompt)).trim();
  } finally {
    interface_.close();
  }
}

async function askHidden(prompt: string): Promise<string> {
  if (!process.stdin.isTTY) {
    throw new Error("Run this command directly in a terminal to enter the password securely.");
  }

  process.stdout.write(prompt);
  process.stdin.setRawMode(true);
  process.stdin.resume();

  return new Promise((resolve, reject) => {
    let value = "";
    const finish = (error?: Error) => {
      process.stdin.off("data", onData);
      process.stdin.setRawMode(false);
      process.stdout.write("\n");
      if (error) reject(error);
      else resolve(value);
    };
    const onData = (input: Buffer) => {
      for (const character of input.toString("utf8")) {
        if (character === "\u0003") {
          finish(new Error("Admin creation cancelled."));
          return;
        }
        if (character === "\r" || character === "\n") {
          finish();
          return;
        }
        if (character === "\u007f" || character === "\b") {
          value = value.slice(0, -1);
          continue;
        }
        if (character >= " ") value += character;
      }
    };
    process.stdin.on("data", onData);
  });
}

async function createAdmin() {
  const email = (await ask("Admin email: ")).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("Enter a valid email address.");
  }

  const name = await ask("Admin name: ");
  if (!name) throw new Error("Admin name is required.");

  const password = await askHidden("Password (minimum 12 characters): ");
  if (password.length < 12) throw new Error("Password must be at least 12 characters.");

  const confirmation = await askHidden("Confirm password: ");
  if (password !== confirmation) throw new Error("Passwords do not match.");

  await connectDB();
  try {
    const passwordHash = await hashPassword(password);
    const admin = await Admin.findOneAndUpdate(
      { email },
      {
        $set: { name, passwordHash, role: "superadmin" },
      },
      { upsert: true, returnDocument: "after", runValidators: true, setDefaultsOnInsert: true },
    ).exec();

    if (!admin) throw new Error("Admin account could not be saved.");
    console.info(`Admin account created or updated: ${admin.email}`);
  } finally {
    await disconnectDB();
  }
}

createAdmin().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : "Admin account setup failed.");
  process.exitCode = 1;
});