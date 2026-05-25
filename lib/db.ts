import { neon, type NeonQueryFunction } from '@neondatabase/serverless';

declare global {
  // eslint-disable-next-line no-var
  var __neonSql: NeonQueryFunction<false, false> | undefined;
}

function createSql(): NeonQueryFunction<false, false> {
  if (global.__neonSql) return global.__neonSql;
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not set');
  }
  global.__neonSql = neon(connectionString);
  return global.__neonSql;
}

export function getSql(): NeonQueryFunction<false, false> {
  return createSql();
}

export async function initializeDatabase() {
  const sql = getSql();
  await sql`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`;
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
}
