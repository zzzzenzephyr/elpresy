import { defineConfig } from "drizzle-kit";
import fs from "fs";
import path from "path";

// Load .env.local manually without dotenv dependency
const envPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  envContent.split("\n").forEach((line) => {
    const [key, ...values] = line.split("=");
    if (key && values.length > 0) {
      process.env[key.trim()] = values.join("=").trim().replace(/^["']/, "").replace(/["']$/, "");
    }
  });
}

export default defineConfig({
  out: "./drizzle",
  schema: "./src/lib/db/schema.ts",
  dialect: "postgresql",
  schemaFilter: ["public"],
  dbCredentials: {
    url: process.env.SUPABASE_URL!,
  },
});
