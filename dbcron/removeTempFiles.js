// 需要使用 cron 来定时执行这个文件
// 例如
import pg from 'pg';

const { Pool } = pg;

console.log(process.env.PGHOST);

const pool = new Pool({
  database: process.env.PGDATABASE || 'nimingban',
  user: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD || '',
  host: process.env.PGHOST || 'localhost',
  port: Number(process.env.PGPORT || 5432),
});

const dbconn = await pool.connect();

console.log(dbconn);
