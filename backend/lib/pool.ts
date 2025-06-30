// backend/lib/pool.ts
const dotenv = require("dotenv");
const path = require("path");
const { Pool } = require("pg");

const envFile =
  process.env.NODE_ENV === "production"
    ? ".env.production"
    : ".env.development";
dotenv.config({ path: path.resolve(process.cwd(), envFile) });
console.log(`✅ Loaded environment from ${envFile} in pool.ts`);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default pool;
