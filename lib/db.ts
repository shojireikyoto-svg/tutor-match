import Database from "better-sqlite3";
import path from "node:path";
import fs from "node:fs";

const DATA_DIR = path.join(process.cwd(), "data");
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

const dbPath = path.join(DATA_DIR, "app.db");

declare global {
  // eslint-disable-next-line no-var
  var __db: Database.Database | undefined;
}

export const db: Database.Database =
  global.__db ?? new Database(dbPath);

if (!global.__db) {
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  global.__db = db;
}

export function initSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL CHECK (role IN ('parent','tutor')),
      name TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS parent_profiles (
      user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
      child_grade TEXT,
      target_school TEXT,
      area TEXT,
      note TEXT
    );

    CREATE TABLE IF NOT EXISTS tutor_profiles (
      user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
      headline TEXT,
      university TEXT,
      bio TEXT,
      subjects TEXT,
      areas TEXT,
      hourly_rate INTEGER,
      experience_years INTEGER,
      passed_schools TEXT,
      photo_url TEXT,
      published INTEGER NOT NULL DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS match_requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      parent_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      tutor_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      message TEXT,
      status TEXT NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending','accepted','declined','cancelled')),
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS reservations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      parent_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      tutor_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      starts_at TEXT NOT NULL,
      duration_min INTEGER NOT NULL DEFAULT 60,
      note TEXT,
      status TEXT NOT NULL DEFAULT 'requested'
        CHECK (status IN ('requested','confirmed','declined','cancelled','completed')),
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_tutor_pub ON tutor_profiles(published);
    CREATE INDEX IF NOT EXISTS idx_match_parent ON match_requests(parent_id);
    CREATE INDEX IF NOT EXISTS idx_match_tutor ON match_requests(tutor_id);
    CREATE INDEX IF NOT EXISTS idx_res_parent ON reservations(parent_id);
    CREATE INDEX IF NOT EXISTS idx_res_tutor ON reservations(tutor_id);
  `);
}

initSchema();
