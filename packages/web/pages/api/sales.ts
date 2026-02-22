import type { NextApiRequest, NextApiResponse } from "next";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { date, mode } = req.query;

    const now = new Date();

    const today = `${now.getFullYear()}-${String(
      now.getMonth() + 1
    ).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

    let result;

    // 1️⃣ Specific date requested
    if (date) {
      result = await pool.query(
        `
        SELECT *
        FROM sales
        WHERE start_date <= $1
        AND end_date >= $1
        ORDER BY start_date ASC
        `,
        [date]
      );
    }

    // 2️⃣ Past sales
    else if (mode === "past") {
      result = await pool.query(
        `
        SELECT *
        FROM sales
        WHERE end_date < $1
        ORDER BY end_date DESC
        `,
        [today]
      );
    }

    // 3️⃣ Upcoming sales
    else if (mode === "upcoming") {
      result = await pool.query(
        `
        SELECT *
        FROM sales
        WHERE start_date > $1
        ORDER BY start_date ASC
        `,
        [today]
      );
    }

    // 4️⃣ Default = active today
    else {
      result = await pool.query(
        `
        SELECT *
        FROM sales
        WHERE end_date >= $1
        ORDER BY start_date ASC
        `,
        [today]
      );
    }

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Failed to fetch sales" });
  }
}