import postgres from 'postgres';
import * as dotenv from 'dotenv';
import { resolve } from 'path';
import * as fs from 'fs';

dotenv.config({ path: resolve(__dirname, '.env') });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('DATABASE_URL is missing');
  process.exit(1);
}

const sql = postgres(connectionString, { max: 1 });

async function main() {
  try {
    console.log('Reading migration...');
    const query = fs.readFileSync('drizzle/0003_lazy_silhouette.sql', 'utf-8');
    await sql.unsafe(query);
    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await sql.end();
  }
}

main();
