import pg from 'pg';

// 日付系をJS Dateオブジェクトではなく文字列で返す（lib/db.tsと統一）
pg.types.setTypeParser(1082, (v) => v);
pg.types.setTypeParser(1114, (v) => v);
pg.types.setTypeParser(1184, (v) => v);

const url = process.env.DATABASE_URL;
if (!url) {
  console.error('[migrate] DATABASE_URL is not set. Skipping migration.');
  process.exit(0);
}

const pool = new pg.Pool({ connectionString: url, ssl: { rejectUnauthorized: false } });

async function query(text) {
  const client = await pool.connect();
  try {
    await client.query(text);
  } finally {
    client.release();
  }
}

async function migrate() {
  await query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`);

  await query(`
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR(100) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      phone_number VARCHAR(20) NOT NULL DEFAULT '',
      is_verified BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);

  await query(`
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
  `);

  await query(`
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
  `);

  console.log('[migrate] Uni-Relay tables ready.');
}

(async () => {
  try {
    await migrate();
    console.log('[migrate] Done.');
  } catch (err) {
    console.error('[migrate] Error:', err);
    process.exit(1);
  } finally {
    await pool.end();
  }
})();
