import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(__dirname, '.env') });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('DATABASE_URL is missing');
  process.exit(1);
}

const sql = postgres(connectionString, { max: 1 });
const db = drizzle(sql);

async function main() {
  try {
    console.log('Adding role column...');
    await sql`ALTER TABLE "headless_cms_users" ADD COLUMN IF NOT EXISTS "role" varchar(20) DEFAULT 'USER' NOT NULL;`;
    
    console.log('Promoting first user to ADMIN...');
    const result = await sql`UPDATE "headless_cms_users" SET "role" = 'ADMIN' WHERE id IN (
      SELECT id FROM "headless_cms_users" ORDER BY created_at ASC LIMIT 1
    ) RETURNING email;`;
    
    if (result.length > 0) {
      console.log(`Successfully promoted ${result[0].email} to ADMIN`);
    } else {
      console.log('No users found to promote.');
    }
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await sql.end();
  }
}

main();
