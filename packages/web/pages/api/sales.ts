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

    // Use provided date or default to today
    let targetDate: string;
    if (date && typeof date === 'string') {
      // Validate date format (YYYY-MM-DD)
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(date)) {
        return res.status(400).json({ error: "Invalid date format. Expected YYYY-MM-DD" });
      }
      targetDate = date;
    } else {
      const now = new Date();
      targetDate = `${now.getFullYear()}-${String(
        now.getMonth() + 1
      ).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    }

    let result;

    // Handle specific date query
    if (req.query.date) {
      result = await pool.query(
        `
        SELECT *
        FROM sales
        WHERE start_date <= $1
        AND end_date >= $1
        ORDER BY start_date ASC
        `,
        [targetDate]
      );
    }
    // Handle mode-based queries
    else if (mode === "past") {
      result = await pool.query(
        `
        SELECT *
        FROM sales
        WHERE end_date < $1
        ORDER BY end_date DESC
        `,
        [targetDate]
      );
    }
    else if (mode === "upcoming") {
      result = await pool.query(
        `
        SELECT *
        FROM sales
        WHERE start_date > $1
        ORDER BY start_date ASC
        `,
        [targetDate]
      );
    }
    // Default = active on target date
    else {
      result = await pool.query(
        `
        SELECT *
        FROM sales
        WHERE start_date <= $1
        AND end_date >= $1
        ORDER BY start_date ASC
        `,
        [targetDate]
      );
    }

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Failed to fetch sales" });
  }
}
