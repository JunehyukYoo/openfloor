import dotenv from "dotenv";
import path from "path";

function loadEnv() {
  const envPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(process.cwd(), ".env.production")
      : path.resolve(process.cwd(), ".env.development");

  dotenv.config({ path: envPath });
  console.log(`✅ Loaded environment from ${envPath}`);
}

async function main() {
  loadEnv();

  console.log(
    `🌱 Running seed in ${process.env.NODE_ENV || "development"} mode...`
  );

  try {
    if (process.env.NODE_ENV === "production") {
      console.log("🚀 Seeding production database...");
      const { seed } = await import("./seed-prod");
      await seed(); // call the exported seed function
    } else {
      console.log("🚀 Seeding development database...");
      const { seed } = await import("./seed-dev");
      await seed(); // call the exported seed function
    }

    console.log("✅ Seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

main();
