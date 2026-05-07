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
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('parent','tutor')),
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS parent_profiles (
      user_id INTEGER PRIMARY KEY REFERENCES users(id),
      child_grade TEXT,
      target_schools TEXT,
      note TEXT
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS tutor_profiles (
      user_id INTEGER PRIMARY KEY REFERENCES users(id),
      headline TEXT NOT NULL DEFAULT '',
      bio TEXT NOT NULL DEFAULT '',
      university TEXT NOT NULL DEFAULT '',
      subjects TEXT NOT NULL DEFAULT '',
      areas TEXT NOT NULL DEFAULT '',
      hourly_rate INTEGER NOT NULL DEFAULT 5000,
      experience_years INTEGER NOT NULL DEFAULT 0,
      photo_url TEXT,
      passed_schools TEXT NOT NULL DEFAULT '',
      published INTEGER NOT NULL DEFAULT 0
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS match_requests (
      id SERIAL PRIMARY KEY,
      parent_id INTEGER NOT NULL REFERENCES users(id),
      tutor_id INTEGER NOT NULL REFERENCES users(id),
      message TEXT NOT NULL DEFAULT '',
      status TEXT NOT NULL DEFAULT 'pending',
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS reservations (
      id SERIAL PRIMARY KEY,
      parent_id INTEGER NOT NULL REFERENCES users(id),
      tutor_id INTEGER NOT NULL REFERENCES users(id),
      starts_at TIMESTAMPTZ NOT NULL,
      duration_min INTEGER NOT NULL DEFAULT 60,
      note TEXT NOT NULL DEFAULT '',
      status TEXT NOT NULL DEFAULT 'requested',
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
}
