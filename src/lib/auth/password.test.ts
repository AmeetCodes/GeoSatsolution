import { describe, it } from "node:test";
import assert from "node:assert/strict";
import bcrypt from "bcryptjs";
import { hashPassword, verifyPassword } from "./password";

describe("admin password hashing", () => {
  it("stores a salted hash and verifies only the matching password", async () => {
    const password = "testing-only-password";
    const encodedHash = await hashPassword(password);

    assert.notEqual(encodedHash, password);
    assert.equal(await verifyPassword(password, encodedHash), true);
    assert.equal(await verifyPassword("incorrect-password", encodedHash), false);
    assert.equal(await verifyPassword(password, "invalid-hash"), false);
  });

  it("verifies existing bcrypt hashes for database-backed admin accounts", async () => {
    const password = "existing-admin-password";
    const encodedHash = await bcrypt.hash(password, 4);

    assert.equal(await verifyPassword(password, encodedHash), true);
    assert.equal(await verifyPassword("incorrect-password", encodedHash), false);
    assert.equal(await verifyPassword(password, "$2b$bad-hash"), false);
  });
});