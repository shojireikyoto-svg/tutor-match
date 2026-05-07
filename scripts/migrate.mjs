// DB migration + seed script — runs during `vercel build` (before next build)
// Also usable locally: node --env-file=.env.local scripts/migrate.mjs

import { neon } from '@neondatabase/serverless';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const bcrypt = require('bcryptjs');

const url = process.env.DATABASE_URL;
if (!url) {
  console.error('[migrate] DATABASE_URL is not set. Skipping migration.');
  process.exit(0);
}

const sql = neon(url);

async function createTables() {
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
  console.log('[migrate] Tables ready.');
}

async function seedIfEmpty() {
  const rows = await sql`SELECT count(*) as count FROM users`;
  if (Number(rows[0].count) > 0) {
    console.log('[migrate] Data already exists. Skipping seed.');
    return;
  }

  const hash = await bcrypt.hash('password123', 10);

  const tutors = [
    {
      email: 'sato@example.com',
      name: '佐藤 美咲',
      headline: '御三家対策10年。算数特化で苦手を得意に。',
      university: '東京大学 理科二類',
      bio: '中学受験指導歴10年。算数の苦手意識を取り除き、思考力で解く力を育てます。お子さま一人ひとりの個性を見て、ご家庭と二人三脚で合格を目指します。',
      subjects: '算数,理科',
      areas: '東京都(世田谷区,渋谷区),オンライン',
      hourly_rate: 6500,
      experience_years: 10,
      passed_schools: '開成,麻布,桜蔭,女子学院,渋谷幕張',
      photo_url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&h=400&fit=crop',
    },
    {
      email: 'tanaka@example.com',
      name: '田中 健一',
      headline: '国語が伸び悩むお子さまへ。読解の型を伝授。',
      university: '早稲田大学 文学部',
      bio: '国語の点数は才能ではなく型で決まります。記述問題への取り組み方、選択肢の絞り方を体系的に指導します。',
      subjects: '国語,社会',
      areas: '東京都(練馬区,杉並区,中野区),オンライン',
      hourly_rate: 5500,
      experience_years: 7,
      passed_schools: '武蔵,渋渋,広尾学園,豊島岡',
      photo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    },
    {
      email: 'yamada@example.com',
      name: '山田 さくら',
      headline: '低学年からの土台作り。楽しく学ぶ習慣を。',
      university: 'お茶の水女子大学 理学部',
      bio: '低学年〜小4向け。勉強を「やらされる」から「やりたい」に変える関わり方を大切にしています。',
      subjects: '算数,理科,国語',
      areas: '東京都(文京区,豊島区),神奈川県(川崎市),オンライン',
      hourly_rate: 4500,
      experience_years: 5,
      passed_schools: '雙葉,白百合,フェリス',
      photo_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop',
    },
    {
      email: 'kobayashi@example.com',
      name: '小林 拓海',
      headline: '難関校志望者向け。SAPIX αクラス出身者多数。',
      university: '東京大学 理科一類',
      bio: 'SAPIX α・四谷大塚S・早稲アカNNなど大手塾と並走しながら、塾の弱点を補強する個別指導を提供します。',
      subjects: '算数,理科',
      areas: '東京都(港区,千代田区,中央区),オンライン',
      hourly_rate: 8000,
      experience_years: 8,
      passed_schools: '筑駒,開成,聖光,栄光,駒場東邦',
      photo_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
    },
    {
      email: 'ito@example.com',
      name: '伊藤 玲奈',
      headline: '女子御三家・新御三家まで幅広く対応。',
      university: '慶應義塾大学 経済学部',
      bio: '女子校受験のリアルを知り尽くしています。お母さまの不安にも寄り添いながら、お子さまの伴走者になります。',
      subjects: '算数,国語,社会',
      areas: '東京都(目黒区,品川区),オンライン',
      hourly_rate: 6000,
      experience_years: 6,
      passed_schools: '桜蔭,女子学院,雙葉,鴎友,吉祥女子',
      photo_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
    },
    {
      email: 'watanabe@example.com',
      name: '渡辺 翔太',
      headline: '理科が大好きになる授業。実験動画も活用。',
      university: '東京工業大学 生命理工学院',
      bio: '理科は「覚える」より「腑に落ちる」が大事。図解と実例でイメージから定着させます。',
      subjects: '理科,算数',
      areas: 'オンライン専門',
      hourly_rate: 5000,
      experience_years: 4,
      passed_schools: '海城,本郷,巣鴨,芝',
      photo_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
    },
  ];

  for (const t of tutors) {
    const r = await sql`
      INSERT INTO users (name, email, password_hash, role)
      VALUES (${t.name}, ${t.email}, ${hash}, 'tutor')
      RETURNING id
    `;
    const userId = r[0].id;
    await sql`
      INSERT INTO tutor_profiles
        (user_id, headline, university, bio, subjects, areas, hourly_rate, experience_years, passed_schools, photo_url, published)
      VALUES
        (${userId}, ${t.headline}, ${t.university}, ${t.bio}, ${t.subjects}, ${t.areas}, ${t.hourly_rate}, ${t.experience_years}, ${t.passed_schools}, ${t.photo_url}, 1)
    `;
  }

  await sql`
    INSERT INTO users (name, email, password_hash, role)
    VALUES ('保護者デモ', 'parent@example.com', ${hash}, 'parent')
  `;
  console.log('[migrate] Seed data inserted.');
}

(async () => {
  try {
    await createTables();
    await seedIfEmpty();
    console.log('[migrate] Done.');
  } catch (err) {
    console.error('[migrate] Error:', err);
    process.exit(1);
  }
})();
