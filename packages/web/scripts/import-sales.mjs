import { Pool } from "pg";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

// Fix __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env from web package root
dotenv.config({ path: path.join(__dirname, "../.env.local") });

// Correct path to sales.json (inside web/data)
const salesPath = path.join(__dirname, "../data/sales.json");

if (!fs.existsSync(salesPath)) {
  console.error("❌ sales.json not found at:", salesPath);
  process.exit(1);
}

const sales = JSON.parse(fs.readFileSync(salesPath, "utf-8"));

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function run() {
  try {
    console.log(`🚀 Importing ${sales.length} sales...`);

    for (const sale of sales) {
      // Generate safe title if missing
      const title = sale.name || sale.title || "Estate Sale";

      // Extract address components
      let address = "";
      let city = "";
      let state = "";
      let zipCode = "";

      if (sale.address) {
        address = sale.address;
        const addressParts = sale.address.split(", ");
        if (addressParts.length >= 3) {
          city = addressParts[addressParts.length - 2];
          const stateZipPart = addressParts[addressParts.length - 1];
          const stateZipParts = stateZipPart.split(" ");
          if (stateZipParts.length >= 1) {
            state = stateZipParts[0];
            if (stateZipParts.length >= 2) {
              zipCode = stateZipParts[1];
            }
          }
        }
      }

      // Use provided dates or defaults
      const startDate = new Date().toISOString().split("T")[0];
      const endDate = new Date().toISOString().split("T")[0];

      // Use provided times or defaults
      const startTime = sale.startTime || "08:00:00";
      const endTime = sale.endTime || "17:00:00";

      // Generate a slug from the title
      const slug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

      await pool.query(
        `
        INSERT INTO sales
        (
          slug,
          title,
          description,
          address,
          city,
          state,
          zip_code,
          latitude,
          longitude,
          start_date,
          end_date,
          start_time,
          end_time,
          status
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
        ON CONFLICT (slug) DO UPDATE SET
          title = EXCLUDED.title,
          description = EXCLUDED.description,
          address = EXCLUDED.address,
          city = EXCLUDED.city,
          state = EXCLUDED.state,
          zip_code = EXCLUDED.zip_code,
          latitude = EXCLUDED.latitude,
          longitude = EXCLUDED.longitude,
          start_date = EXCLUDED.start_date,
          end_date = EXCLUDED.end_date,
          start_time = EXCLUDED.start_time,
          end_time = EXCLUDED.end_time,
          status = EXCLUDED.status
        `,
        [
          slug,
          title,
          `Estate sale at ${address}`,
          address,
          city,
          state,
          zipCode,
          sale.latitude || 0,
          sale.longitude || 0,
          startDate,
          endDate,
          startTime,
          endTime,
          "published"
        ]
      );
    }

    console.log("✅ Import complete");
  } catch (err) {
    console.error("❌ Import failed:", err);
  } finally {
    await pool.end();
  }
}

run();
