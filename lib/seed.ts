import { db } from "./db";
import bcrypt from "bcryptjs";

export function seedIfEmpty() {
  const row = db.prepare("SELECT COUNT(*) as c FROM users").get() as {
    c: number;
  };
  if (row.c > 0) return;

  const hash = bcrypt.hashSync("password123", 10);

  const insertUser = db.prepare(
    "INSERT INTO users (email, password_hash, role, name) VALUES (?, ?, ?, ?)"
  );
  const insertTutor = db.prepare(
    `INSERT INTO tutor_profiles
     (user_id, headline, university, bio, subjects, areas, hourly_rate, experience_years, passed_schools, photo_url, published)
     VALUES (@user_id,@headline,@university,@bio,@subjects,@areas,@hourly_rate,@experience_years,@passed_schools,@photo_url,1)`
  );

  const tutors = [
    {
      email: "sato@example.com",
      name: "佐藤 美咲",
      headline: "御三家対策10年。算数特化で苦手を得意に。",
      university: "東京大学 理科二類",
      bio: "中学受験指導歴10年。算数の苦手意識を取り除き、思考力で解く力を育てます。お子さま一人ひとりの個性を見て、ご家庭と二人三脚で合格を目指します。",
      subjects: "算数,理科",
      areas: "東京都(世田谷区,渋谷区),オンライン",
      hourly_rate: 6500,
      experience_years: 10,
      passed_schools: "開成,麻布,桜蔭,女子学院,渋谷幕張",
      photo_url:
        "https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&h=400&fit=crop",
    },
    {
      email: "tanaka@example.com",
      name: "田中 健一",
      headline: "国語が伸び悩むお子さまへ。読解の型を伝授。",
      university: "早稲田大学 文学部",
      bio: "国語の点数は才能ではなく型で決まります。記述問題への取り組み方、選択肢の絞り方を体系的に指導します。",
      subjects: "国語,社会",
      areas: "東京都(練馬区,杉並区,中野区),オンライン",
      hourly_rate: 5500,
      experience_years: 7,
      passed_schools: "武蔵,渋渋,広尾学園,豊島岡",
      photo_url:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    },
    {
      email: "yamada@example.com",
      name: "山田 さくら",
      headline: "低学年からの土台作り。楽しく学ぶ習慣を。",
      university: "お茶の水女子大学 理学部",
      bio: "低学年〜小4向け。勉強を「やらされる」から「やりたい」に変える関わり方を大切にしています。",
      subjects: "算数,理科,国語",
      areas: "東京都(文京区,豊島区),神奈川県(川崎市),オンライン",
      hourly_rate: 4500,
      experience_years: 5,
      passed_schools: "雙葉,白百合,フェリス",
      photo_url:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop",
    },
    {
      email: "kobayashi@example.com",
      name: "小林 拓海",
      headline: "難関校志望者向け。SAPIX αクラス出身者多数。",
      university: "東京大学 理科一類",
      bio: "SAPIX α・四谷大塚S・早稲アカNNなど大手塾と並走しながら、塾の弱点を補強する個別指導を提供します。",
      subjects: "算数,理科",
      areas: "東京都(港区,千代田区,中央区),オンライン",
      hourly_rate: 8000,
      experience_years: 8,
      passed_schools: "筑駒,開成,聖光,栄光,駒場東邦",
      photo_url:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
    },
    {
      email: "ito@example.com",
      name: "伊藤 玲奈",
      headline: "女子御三家・新御三家まで幅広く対応。",
      university: "慶應義塾大学 経済学部",
      bio: "女子校受験のリアルを知り尽くしています。お母さまの不安にも寄り添いながら、お子さまの伴走者になります。",
      subjects: "算数,国語,社会",
      areas: "東京都(目黒区,品川区),オンライン",
      hourly_rate: 6000,
      experience_years: 6,
      passed_schools: "桜蔭,女子学院,雙葉,鴎友,吉祥女子",
      photo_url:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
    },
    {
      email: "watanabe@example.com",
      name: "渡辺 翔太",
      headline: "理科が大好きになる授業。実験動画も活用。",
      university: "東京工業大学 生命理工学院",
      bio: "理科は「覚える」より「腑に落ちる」が大事。図解と実例でイメージから定着させます。",
      subjects: "理科,算数",
      areas: "オンライン専門",
      hourly_rate: 5000,
      experience_years: 4,
      passed_schools: "海城,本郷,巣鴨,芝",
      photo_url:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
    },
  ];

  const tx = db.transaction(() => {
    for (const t of tutors) {
      const r = insertUser.run(t.email, hash, "tutor", t.name);
      insertTutor.run({ user_id: r.lastInsertRowid as number, ...t });
    }
    insertUser.run("parent@example.com", hash, "parent", "保護者デモ");
  });
  tx();
}
