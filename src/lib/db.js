import pg from "pg";
const { Pool } = pg;

/**
 * Connect to the PostgreSQL database.
 * @returns {Promise<import("pg").Client>} A new client from the connection pool.
 */
export const connectToDB = async ({ host, user, pass, database, port }) => {
  const pool = new Pool({
    database: database || "postgres",
    user: user || "postgres",
    password: pass || '',
    host: host || "localhost",
    port: Number(port || 5432),
  });

  return await pool.connect();
}