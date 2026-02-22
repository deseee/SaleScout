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
    const { date, mode, day } = req.query;

    // Handle specific day of week filtering (Saturday/Sunday)
    if (day && typeof day === 'string') {
      const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      const dayIndex = days.indexOf(day.toLowerCase());
      
      if (dayIndex === -1) {
        return res.status(400).json({ error: "Invalid day parameter. Must be a day of the week." });
      }
      
      const result = await pool.query(
        `
        SELECT 
          id, title, description, 
          start_date, end_date, start_time, end_time,
          address, city, state, zip_code,
          latitude, longitude
        FROM sales
        WHERE EXTRACT(DOW FROM start_date::date) = $1
        AND end_date >= CURRENT_DATE
        ORDER BY start_date ASC
        `,
        [dayIndex]
      );

      // Transform the data to match the expected format
      const transformedData = result.rows.map(row => ({
        id: row.id,
        title: row.title,
        description: row.description,
        address: row.address,
        city: row.city,
        state: row.state,
        zip_code: row.zip_code,
        latitude: parseFloat(row.latitude),
        longitude: parseFloat(row.longitude),
        start_date: row.start_date instanceof Date ? row.start_date.toISOString().split('T')[0] : row.start_date,
        end_date: row.end_date instanceof Date ? row.end_date.toISOString().split('T')[0] : row.end_date,
        start_time: row.start_time,
        end_time: row.end_time
      }));

      return res.status(200).json(transformedData);
    }

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

    // Handle mode-based queries
    if (mode === "past") {
      result = await pool.query(
        `
        SELECT 
          id, title, description, 
          start_date, end_date, start_time, end_time,
          address, city, state, zip_code,
          latitude, longitude
        FROM sales
        WHERE end_date < $1::date
        ORDER BY end_date DESC
        `,
        [targetDate]
      );
    }
    else if (mode === "upcoming") {
      result = await pool.query(
        `
        SELECT 
          id, title, description, 
          start_date, end_date, start_time, end_time,
          address, city, state, zip_code,
          latitude, longitude
        FROM sales
        WHERE start_date > $1::date
        ORDER BY start_date ASC
        `,
        [targetDate]
      );
    }
    // Default = active OR upcoming sales (more inclusive)
    else {
      result = await pool.query(
        `
        SELECT 
          id, title, description, 
          start_date, end_date, start_time, end_time,
          address, city, state, zip_code,
          latitude, longitude
        FROM sales
        WHERE end_date >= CURRENT_DATE
        ORDER BY start_date ASC
        LIMIT 20
        `
      );
    }

    // Transform the data to match the expected format
    const transformedData = result.rows.map(row => ({
      id: row.id,
      title: row.title,
      description: row.description,
      address: row.address,
      city: row.city,
      state: row.state,
      zip_code: row.zip_code,
      latitude: parseFloat(row.latitude),
      longitude: parseFloat(row.longitude),
      start_date: row.start_date instanceof Date ? row.start_date.toISOString().split('T')[0] : row.start_date,
      end_date: row.end_date instanceof Date ? row.end_date.toISOString().split('T')[0] : row.end_date,
      start_time: row.start_time,
      end_time: row.end_time
    }));

    res.status(200).json(transformedData);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Failed to fetch sales", details: error.message });
  }
}
