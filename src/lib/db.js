import pg from "pg";
const { Pool } = pg;

const pool = new Pool({
  database: import.meta.env.VITE_PGDATABASE || "postgres",
  user: import.meta.env.VITE_PGUSER || "postgres",
  password: import.meta.env.VITE_PGPASSWORD || '',
  host: import.meta.env.VITE_PGHOST || "localhost",
  port: Number(import.meta.env.VITE_PGPORT || 5432),
});

/**
 * Connect to the PostgreSQL database.
 * @returns {Promise<import("pg").Client>} A new client from the connection pool.
 */
export const connectToDB = async () => await pool.connect();