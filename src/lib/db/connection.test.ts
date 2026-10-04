import { after, describe, it } from "node:test";
import assert from "node:assert/strict";

import mongoose from "mongoose";

import {
  connectDB,
  disconnectDB,
  getConnectionState,
  getDatabaseName,
  getMongoUri,
  MONGO_STATES,
} from "./connection";

const testUri = process.env.MONGODB_TEST_URI ?? process.env.MONGODB_URI?.trim();
const scratchCollection = "connection_test_scratch";

describe("connectDB", () => {
  after(async () => {
    await disconnectDB();
  });

  it("throws a helpful error when MONGODB_URI is missing", () => {
    const original = process.env.MONGODB_URI;
    delete process.env.MONGODB_URI;

    try {
      assert.throws(() => getMongoUri(), /MONGODB_URI is not set/);
    } finally {
      if (original !== undefined) process.env.MONGODB_URI = original;
    }
  });

  it("connects, reports connected state, and pings the server", async (t) => {
    if (!testUri) {
      t.skip("set MONGODB_TEST_URI or MONGODB_URI to run connection tests");
      return;
    }

    const conn = await connectDB(testUri);
    const db = conn.connection.db;
    assert.ok(db, "connection should expose a database handle");

    assert.equal(getConnectionState(), MONGO_STATES.connected);
    assert.equal(conn.connection.readyState, 1);
    assert.ok(getDatabaseName(), "connected database name should be resolved");

    const pong = await db.admin().command({ ping: 1 });
    assert.equal(pong.ok, 1, "server should answer ping");
  });

  it("reuses the existing connection on subsequent calls", async (t) => {
    if (!testUri) {
      t.skip("set MONGODB_TEST_URI or MONGODB_URI to run connection tests");
      return;
    }

    await connectDB(testUri);
    const first = mongoose.connection.id ?? mongoose.connection.name;

    const second = await connectDB(testUri);

    assert.equal(getConnectionState(), MONGO_STATES.connected);
    assert.equal(
      mongoose.connection.id ?? mongoose.connection.name,
      first,
      "second call should reuse the pooled connection",
    );
    assert.ok(second.connection.db);
  });

  it("reads and writes through the connection, then cleans up", async (t) => {
    if (!testUri) {
      t.skip("set MONGODB_TEST_URI or MONGODB_URI to run connection tests");
      return;
    }

    const conn = await connectDB(testUri);
    const db = conn.connection.db;
    assert.ok(db, "connection should expose a database handle");

    const collection = db.collection(scratchCollection);

    try {
      await collection.deleteMany({});
      const insert = await collection.insertOne({ probe: "connectDB", at: new Date() });
      assert.ok(insert.insertedId, "insert should return an id");

      const found = await collection.findOne({ _id: insert.insertedId });
      assert.equal(found?.probe, "connectDB", "document should be readable back");
    } finally {
      await collection.deleteMany({});
      await collection.drop().catch(() => undefined);
    }
  });

  it("reports disconnected state after disconnectDB()", async (t) => {
    if (!testUri) {
      t.skip("set MONGODB_TEST_URI or MONGODB_URI to run connection tests");
      return;
    }

    await connectDB(testUri);
    await disconnectDB();

    assert.equal(getConnectionState(), MONGO_STATES.disconnected);
  });

  it("reconnects after a disconnect", async (t) => {
    if (!testUri) {
      t.skip("set MONGODB_TEST_URI or MONGODB_URI to run connection tests");
      return;
    }

    const conn = await connectDB(testUri);
    const db = conn.connection.db;
    assert.ok(db, "connection should expose a database handle");

    const pong = await db.admin().command({ ping: 1 });

    assert.equal(pong.ok, 1);
    assert.equal(getConnectionState(), MONGO_STATES.connected);
  });
});
