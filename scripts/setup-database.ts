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
  Resource,
  ContentMigration,
} from "../src/lib/models";
import { DEFAULT_RESOURCES } from "../src/lib/data-store";
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
  Resource,
  ContentMigration,
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
    if (!isEmpty && !(await ContentMigration.exists({ _id: "legacy-downloads-v1" }).exec())) {
      if ((await Resource.countDocuments().exec()) === 0) {
        await Resource.insertMany(DEFAULT_RESOURCES.map((item, index) => ({ ...item, order: index + 1, updated: new Date(item.updated) })));
      }
      await ContentMigration.create({ _id: "legacy-downloads-v1", appliedAt: new Date() });
      result.counts.Resource = await Resource.countDocuments().exec();
    }

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
