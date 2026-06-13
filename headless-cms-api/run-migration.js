const postgres = require('postgres');
const fs = require('fs');

async function main() {
  const sql = postgres('postgresql://postgres:116bcc6d6cb77d1ab0e7de29ed560819@192.168.0.105:54322/postgres');
  
  const migrationSql = fs.readFileSync('drizzle/0001_lowly_shockwave.sql', 'utf8');
  
  try {
    await sql.unsafe(migrationSql);
    console.log('Migration applied successfully');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    await sql.end();
  }
}

main();
