import connectDB, {
  disconnectDB,
  getDatabaseName,
} from "../src/lib/db/connection";
import {
  Admin,
  Article,
  Career,
  Client,
  Consultation,
  Equipment,
  Industry,
  Leader,
  Navigation,
  Partner,
  Product,
  Project,
  Solution,
} from "../src/lib/models";
import { seedDatabase } from "../src/lib/db/seed";

const models = [
  Solution,
  Product,
  Industry,
  Article,
  Career,
  Leader,
  Partner,
  Client,
  Equipment,
  Project,
  Navigation,
  Admin,
  Consultation,
];

async function setupDatabase() {
  await connectDB();

  try {
    await Promise.all(models.map((model) => model.init()));

    const existingCounts = Object.fromEntries(
      await Promise.all(
        models.map(async (model) => [
          model.modelName,
          await model.countDocuments().exec(),
        ] as const),
      ),
    );
    const isEmpty = Object.values(existingCounts).every((count) => count === 0);

    const result = isEmpty
      ? await seedDatabase(false)
      : { seeded: false, counts: existingCounts };

    console.info(
      JSON.stringify(
        {
          database: getDatabaseName(),
          seeded: result.seeded,
          counts: result.counts,
        },
        null,
        2,
      ),
    );
  } finally {
    await disconnectDB();
  }
}

setupDatabase().catch((error: unknown) => {
  console.error("Database setup failed:", error);
  process.exitCode = 1;
});