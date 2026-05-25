import { neon } from '@neondatabase/serverless';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const url = process.env.DATABASE_URL;
if (!url) {
  console.error('[migrate] DATABASE_URL is not set. Skipping migration.');
  process.exit(0);
}

const sql = neon(url);

async function migrate() {
  // Drop old tables
  await sql`DROP TABLE IF EXISTS reservations CASCADE`;
  await sql`DROP TABLE IF EXISTS match_requests CASCADE`;
  await sql`DROP TABLE IF EXISTS tutor_profiles CASCADE`;
  await sql`DROP TABLE IF EXISTS parent_profiles CASCADE`;
  await sql`DROP TABLE IF EXISTS matchings CASCADE`;
  await sql`DROP TABLE IF EXISTS items CASCADE`;
  await sql`DROP TABLE IF EXISTS users CASCADE`;

  // Enable pgcrypto for gen_random_uuid()
  await sql`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`;

  // Create users
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR(100) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      phone_number VARCHAR(20) NOT NULL DEFAULT '',
      is_verified BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  // Create items
  await sql`
    CREATE TABLE IF NOT EXISTS items (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      seller_id UUID NOT NULL REFERENCES users(id),
      buyer_id UUID REFERENCES users(id),
      title VARCHAR(100) NOT NULL,
      category VARCHAR(50) NOT NULL,
      item_status VARCHAR(20) NOT NULL DEFAULT 'available',
      price INT NOT NULL DEFAULT 0,
      images JSONB NOT NULL DEFAULT '[]',
      description TEXT NOT NULL DEFAULT '',
      pickup_address VARCHAR(255) NOT NULL DEFAULT '',
      pickup_date DATE,
      pickup_time_slot VARCHAR(20),
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  // Create matchings
  await sql`
    CREATE TABLE IF NOT EXISTS matchings (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      item_id UUID NOT NULL REFERENCES items(id),
      pickup_date DATE NOT NULL,
      pickup_time_slot VARCHAR(20) NOT NULL,
      delivery_date DATE NOT NULL,
      delivery_time_slot VARCHAR(20) NOT NULL,
      pickup_address VARCHAR(255) NOT NULL,
      delivery_address VARCHAR(255) NOT NULL,
      delivery_fee INT NOT NULL DEFAULT 0,
      stripe_intent_id VARCHAR(255) UNIQUE,
      driver_id UUID REFERENCES users(id),
      matching_status VARCHAR(20) NOT NULL DEFAULT 'pending',
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  console.log('[migrate] Uni-Relay tables ready.');
}

(async () => {
  try {
    await migrate();
    console.log('[migrate] Done.');
  } catch (err) {
    console.error('[migrate] Error:', err);
    process.exit(1);
  }
})();
