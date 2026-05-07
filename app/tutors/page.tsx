import Link from "next/link";
import { listTutors } from "@/lib/queries";

interface SP { q?: string; subject?: string; area?: string; maxRate?: string }

export default async function TutorsPage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const tutors = await listTutors({
    q: sp.q, subject: sp.subject, area: sp.area,
    maxRate: sp.maxRate ? Number(sp.maxRate) : undefined,
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 pb-24 md:pb-10">
      <h1 className="text-2xl sm:text-3xl font-bold text-amber-900">家庭教師を探す</h1>
      <p className="text-stone-600 mt-1">お子さまの志望校・得意不得意に合わせてお選びください。</p>

      {/* 検索フォーム */}
      <form className="mt-5 bg-white border border-amber-100 rounded-2xl p-4 sm:p-5 shadow-sm space-y-3">
        <div className="grid sm:grid-cols-2 gap-3">
          <input
            name="q"
            defaultValue={sp.q ?? ""}
            placeholder="🔍 先生の名前・学校名・キーワード"
            className="border border-stone-200 rounded-xl px-4 py-3 w-full text-sm"
          />
          <input
            name="area"
            defaultValue={sp.area ?? ""}
            placeholder="📍 エリア（例: 世田谷、オンライン）"
            className="border border-stone-200 rounded-xl px-4 py-3 w-full text-sm"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <select name="subject" defaultValue={sp.subject ?? ""} className="border border-stone-200 rounded-xl px-4 py-3 text-sm w-full">
            <option value="">📚 教科を選ぶ</option>
            {["算数", "国語", "理科", "社会"].map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <select name="maxRate" defaultValue={sp.maxRate ?? ""} className="border border-stone-200 rounded-xl px-4 py-3 text-sm w-full">
            <option value="">💰 ご予算（時給）</option>
            <option value="5000">¥5,000まで</option>
            <option value="6000">¥6,000まで</option>
            <option value="7000">¥7,000まで</option>
            <option value="10000">¥10,000まで</option>
          </select>
        </div>
        <button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-white rounded-xl py-3 font-bold text-base">
          検索する
        </button>
      </form>

      <p className="mt-5 text-sm text-stone-600 font-medium">
        {tutors.length} 名の先生が見つかりました
      </p>

      <div className="mt-3 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tutors.map((t) => (
          <Link key={t.id} href={`/tutors/${t.id}`} className="bg-white border border-amber-100 rounded-2xl p-5 hover:shadow-lg transition-shadow block active:scale-[.98]">
            <div className="flex items-center gap-3">
              {t.photo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={t.photo_url} alt={t.name} className="w-16 h-16 rounded-full object-cover flex-shrink-0" />
              ) : (
                <div className="w-16 h-16 rounded-full bg-amber-200 flex items-center justify-center text-2xl flex-shrink-0">👩‍🏫</div>
              )}
              <div className="min-w-0">
                <div className="font-bold text-amber-900">{t.name} 先生</div>
                <div className="text-xs text-stone-500 truncate">{t.university}</div>
                <div className="text-amber-400 text-xs">★★★★★</div>
              </div>
            </div>

            {/* バッジ */}
            <div className="mt-3 flex flex-wrap gap-1">
              {t.experience_years >= 8 && (
                <span className="bg-rose-100 text-rose-700 text-xs font-bold rounded-full px-2 py-0.5">🏆 ベテラン</span>
              )}
              {t.passed_schools.includes("開成") || t.passed_schools.includes("桜蔭") || t.passed_schools.includes("女子学院") ? (
                <span className="bg-amber-100 text-amber-800 text-xs font-bold rounded-full px-2 py-0.5">🌸 御三家実績あり</span>
              ) : null}
              {t.areas.includes("オンライン") && (
                <span className="bg-sky-100 text-sky-700 text-xs rounded-full px-2 py-0.5">💻 オンライン対応</span>
              )}
            </div>

            <p className="mt-2 text-sm text-stone-700 line-clamp-2">{t.headline}</p>
            <div className="mt-3 flex flex-wrap gap-1">
              {t.subjects.split(",").map((s) => (
                <span key={s} className="bg-amber-100 text-amber-800 text-xs rounded-full px-2 py-0.5">{s.trim()}</span>
              ))}
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-stone-500">指導歴 {t.experience_years}年</span>
              <span className="text-rose-600 font-bold">¥{t.hourly_rate.toLocaleString()}/h</span>
            </div>
            <div className="mt-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl py-2 text-center text-sm font-bold">
              詳細を見る・相談する
            </div>
          </Link>
        ))}
      </div>

      {tutors.length === 0 && (
        <div className="mt-10 text-center py-12 bg-amber-50 rounded-2xl">
          <div className="text-4xl mb-3">🔍</div>
          <p className="text-stone-600 font-medium">条件に合う先生が見つかりませんでした</p>
          <p className="text-stone-500 text-sm mt-1">条件を変えてお試しください</p>
        </div>
      )}
    </div>
  );
}
