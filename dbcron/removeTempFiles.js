// 需要使用 cron 来定时执行这个文件
// 例如
import pg from 'pg';
import path from 'path';
import fs from 'fs';

const { Pool } = pg;

const pool = new Pool({
  database: process.env.PGDATABASE || 'nimingban',
  user: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD || '',
  host: process.env.PGHOST || 'localhost',
  port: Number(process.env.PGPORT || 5432),
});

const dbconn = await pool.connect();

const toDeleteRowsQuery = {
  text: `SELECT id, fullname FROM post_comment_image WHERE created_at < NOW() - INTERVAL '1 day' AND (exist_type = 'delete' OR post_id IS NULL)`,
}

const toDeleteRowsResult = await dbconn.query(toDeleteRowsQuery);

for (let row of toDeleteRowsResult.rows) {
  const { id, fullname } = row;

  // 删除磁盘上的文件
  const filePath = path.join(process.env.IMAGE_UPLOAD_PATH, fullname);
  fs.rmSync(filePath, { force: true });
  // 删除 post_comment_image 中的行
  const deleteImageQuery = {
    text: `DELETE FROM post_comment_image WHERE id = $1`,
    values: [id]
  }

  await dbconn.query(deleteImageQuery);
  console.log(`已删除 id=${id}, 文件名为 ${fullname} 的文件`)
}

dbconn.release();
