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
      const title =
        sale.title ||
        sale.name ||
        `${sale.address || "Garage Sale"}${sale.city ? " - " + sale.city : ""}`;

      // Support both single-day and multi-day sales
      const startDate =
        sale.startDate ||
        sale.start_date ||
        sale.date ||
        new Date().toISOString().split("T")[0];

      const endDate =
        sale.endDate ||
        sale.end_date ||
        sale.date ||
        startDate;

      // Extract city and state from address if not provided
      let city = sale.city || "";
      let state = sale.state || "";
      
      if (sale.address && !city && !state) {
        const addressParts = sale.address.split(", ");
        if (addressParts.length >= 2) {
          const lastPart = addressParts[addressParts.length - 1];
          const stateZip = lastPart.split(" ");
          if (stateZip.length >= 1) {
            state = stateZip[0];
          }
          if (addressParts.length >= 3) {
            city = addressParts[addressParts.length - 2];
          }
        }
      }

      await pool.query(
        `
        INSERT INTO sales
        (
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
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
        `,
        [
          title,
          sale.description || "",
          sale.address || "",
          city,
          state,
          sale.zip || sale.zip_code || "",
          sale.lat || sale.latitude || null,
          sale.lng || sale.longitude || null,
          startDate,
          endDate,
          sale.startTime || sale.start_time || "08:00:00",
          sale.endTime || sale.end_time || "17:00:00",
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
