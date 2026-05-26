import pg from 'pg';

// pgのデフォルト型パーサーを上書きして日付をJS Dateオブジェクトではなく文字列で返す
// （NeonのHTTP APIが返す形式と統一するため）
pg.types.setTypeParser(1082, (v: string) => v);  // date
pg.types.setTypeParser(1114, (v: string) => v);  // timestamp
pg.types.setTypeParser(1184, (v: string) => v);  // timestamptz

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SqlFn = (strings: TemplateStringsArray, ...values: any[]) => Promise<any[]>;

declare global {
  // eslint-disable-next-line no-var
  var __pgPool: pg.Pool | undefined;
  // eslint-disable-next-line no-var
  var __sqlFn: SqlFn | undefined;
}

function createSql(): SqlFn {
  if (!global.__pgPool) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) throw new Error('DATABASE_URL is not set');
    global.__pgPool = new pg.Pool({
      connectionString,
      ssl: connectionString.includes('localhost') ? false : { rejectUnauthorized: false },
    });
  }
  const pool = global.__pgPool;
  return async (strings, ...values) => {
    let text = '';
    strings.forEach((s, i) => {
      text += s;
      if (i < values.length) text += `$${i + 1}`;
    });
    const res = await pool.query(text, values);
    return res.rows;
  };
}

export function getSql(): SqlFn {
  if (!global.__sqlFn) global.__sqlFn = createSql();
  return global.__sqlFn;
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
