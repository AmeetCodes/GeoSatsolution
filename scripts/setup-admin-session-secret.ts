import { randomBytes } from "node:crypto";
import { chmod, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const envPath = resolve(process.cwd(), ".env.local");
const settingPattern = /^ADMIN_SESSION_SECRET\s*=.*$/m;

async function setupSessionSecret() {
  let contents = "";
  try {
    contents = await readFile(envPath, "utf8");
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
  }

  const configured = contents.match(/^ADMIN_SESSION_SECRET\s*=\s*(.*)$/m)?.[1]
    ?.trim()
    .replace(/^(?:"(.*)"|'(.*)')$/, (_, doubleQuoted, singleQuoted) => doubleQuoted ?? singleQuoted);

  if (configured && Buffer.byteLength(configured) >= 32) {
    console.info("Admin session secret is already configured; no changes made.");
    return;
  }

  const newSetting = `ADMIN_SESSION_SECRET=${randomBytes(48).toString("base64url")}`;
  const updated = settingPattern.test(contents)
    ? contents.replace(settingPattern, newSetting)
    : `${contents}${contents && !contents.endsWith("\n") ? "\n" : ""}${newSetting}\n`;

  await writeFile(envPath, updated, { mode: 0o600 });
  await chmod(envPath, 0o600);
  console.info("Generated and saved a secure admin session secret in .env.local. Restart the dev server to load it.");
}

setupSessionSecret().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : "Could not configure the admin session secret.");
  process.exitCode = 1;
});