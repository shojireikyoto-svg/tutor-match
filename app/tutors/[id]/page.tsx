import { notFound } from "next/navigation";
import Link from "next/link";
import { getTutorById } from "@/lib/queries";
import { getSession } from "@/lib/auth";
import { createMatchRequestAction, createReservationAction } from "@/lib/actions";

const CONCERNS = [
  "算数が苦手で困っている",
  "国語の記述が書けない",
  "理科・社会の暗記が進まない",
  "塾の宿題が回っていない",
  "志望校の傾向対策をしたい",
  "モチベーションが下がっている",
  "復習・定着を強化したい",
  "親が教えるとケンカになる",
];

export default async function TutorDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const tutor = getTutorById(Number(id));
  if (!tutor) notFound();

  const session = await getSession();
  const isParent = session?.role === "parent";

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 pb-24 md:pb-10">
      <Link href="/tutors" className="text-sm text-amber-700 hover:underline">← 一覧に戻る</Link>

      <div className="mt-4 grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          {/* プロフィールヘッダー */}
          <div className="bg-white border border-amber-100 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-4">
              {tutor.photo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={tutor.photo_url} alt={tutor.name} className="w-20 h-20 rounded-full object-cover flex-shrink-0" />
              ) : (
                <div className="w-20 h-20 rounded-full bg-amber-200 flex items-center justify-center text-4xl flex-shrink-0">👩‍🏫</div>
              )}
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-amber-900">{tutor.name} 先生</h1>
                <p className="text-sm text-stone-500">{tutor.university}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-amber-400 text-sm">★★★★★</span>
                  <span className="text-xs text-stone-500">指導歴 {tutor.experience_years}年</span>
                </div>
                {/* バッジ */}
                <div className="flex flex-wrap gap-1 mt-2">
                  {(tutor.passed_schools.includes("開成") || tutor.passed_schools.includes("桜蔭") || tutor.passed_schools.includes("女子学院")) && (
                    <span className="bg-amber-100 text-amber-800 text-xs font-bold rounded-full px-2 py-0.5">🌸 御三家実績あり</span>
                  )}
                  {tutor.areas.includes("オンライン") && (
                    <span className="bg-sky-100 text-sky-700 text-xs rounded-full px-2 py-0.5">💻 オンライン対応</span>
                  )}
                  {tutor.experience_years >= 8 && (
                    <span className="bg-rose-100 text-rose-700 text-xs font-bold rounded-full px-2 py-0.5">🏆 ベテラン</span>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-4 bg-amber-50 rounded-xl p-4 border-l-4 border-amber-400">
              <p className="text-stone-800 font-medium leading-relaxed">「{tutor.headline}」</p>
            </div>
          </div>

          <Section title="自己紹介">
            <p className="whitespace-pre-line text-stone-700 leading-relaxed">{tutor.bio}</p>
          </Section>

          <Section title="指導教科">
            <div className="flex flex-wrap gap-2">
              {tutor.subjects.split(",").map((s) => (
                <span key={s} className="bg-amber-100 text-amber-800 font-medium rounded-xl px-4 py-2">{s.trim()}</span>
              ))}
            </div>
          </Section>

          <Section title="対応エリア">
            <p className="text-stone-700">{tutor.areas}</p>
          </Section>

          <Section title="主な合格実績 🌸">
            <div className="flex flex-wrap gap-2">
              {tutor.passed_schools.split(",").map((s) => (
                <span key={s} className="bg-rose-50 text-rose-700 border border-rose-200 rounded-xl px-3 py-1.5 text-sm font-medium">
                  {s.trim()}
                </span>
              ))}
            </div>
          </Section>

          {/* モバイル用CTA */}
          {!session && (
            <div className="md:hidden mt-6">
              <Link href="/signup" className="block bg-amber-500 text-white rounded-2xl py-4 font-bold text-center text-lg">
                無料登録して相談する
              </Link>
            </div>
          )}
        </div>

        {/* サイドバー */}
        <aside className="md:sticky md:top-20 self-start">
          <div className="bg-white border-2 border-amber-300 rounded-2xl p-5 shadow-md">
            <div className="text-center mb-4">
              <div className="text-xs text-stone-500">1時間あたりの料金</div>
              <div className="text-4xl font-bold text-rose-600 mt-1">
                ¥{tutor.hourly_rate.toLocaleString()}
              </div>
              <div className="text-sm text-stone-500">入会金・紹介料なし</div>
            </div>

            {!session && (
              <>
                <Link href="/signup" className="block bg-amber-500 hover:bg-amber-600 text-white rounded-xl py-4 font-bold text-center text-base">
                  無料登録して相談する
                </Link>
                <p className="text-xs text-stone-500 text-center mt-2">30秒で登録完了</p>
              </>
            )}

            {session && !isParent && (
              <p className="text-sm text-stone-500 bg-stone-50 rounded-xl p-3 text-center">
                先生アカウントでは申し込みできません
              </p>
            )}

            {isParent && (
              <>
                {/* マッチング申込 */}
                <form action={createMatchRequestAction} className="space-y-3">
                  <input type="hidden" name="tutorId" value={tutor.id} />
                  <div>
                    <p className="text-sm font-bold text-stone-700 mb-2">お悩みを選んでください（複数OK）</p>
                    <div className="space-y-2">
                      {CONCERNS.map((c) => (
                        <label key={c} className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" name="concerns" value={c} className="w-4 h-4 accent-amber-500" />
                          <span className="text-sm text-stone-700">{c}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <textarea
                    name="message"
                    required
                    rows={3}
                    placeholder="お子さまの学年、志望校など自由にどうぞ（任意）"
                    className="w-full border border-stone-200 rounded-xl px-3 py-2 text-sm"
                  />
                  <button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-white rounded-xl py-4 font-bold text-base">
                    💌 無料相談する
                  </button>
                  <p className="text-xs text-stone-500 text-center">先生から24時間以内に返信があります</p>
                </form>

                <div className="mt-4 border-t border-stone-100 pt-4">
                  <details>
                    <summary className="cursor-pointer text-sm text-amber-700 hover:underline font-medium text-center">
                      📅 日時を指定して予約する
                    </summary>
                    <form action={createReservationAction} className="mt-3 space-y-2">
                      <input type="hidden" name="tutorId" value={tutor.id} />
                      <label className="block text-sm">
                        <span className="block text-stone-700 mb-1 font-medium">日付</span>
                        <input type="date" name="date" required className="w-full border border-stone-200 rounded-xl px-3 py-2" />
                      </label>
                      <label className="block text-sm">
                        <span className="block text-stone-700 mb-1 font-medium">開始時刻</span>
                        <input type="time" name="time" required className="w-full border border-stone-200 rounded-xl px-3 py-2" />
                      </label>
                      <label className="block text-sm">
                        <span className="block text-stone-700 mb-1 font-medium">授業時間</span>
                        <select name="duration" defaultValue={60} className="w-full border border-stone-200 rounded-xl px-3 py-2">
                          <option value={60}>60分</option>
                          <option value={90}>90分</option>
                          <option value={120}>120分</option>
                        </select>
                      </label>
                      <textarea name="note" rows={2} placeholder="ご要望（任意）" className="w-full border border-stone-200 rounded-xl px-3 py-2 text-sm" />
                      <button type="submit" className="w-full bg-rose-500 hover:bg-rose-600 text-white rounded-xl py-3 font-bold">
                        予約をリクエスト
                      </button>
                    </form>
                  </details>
                </div>
              </>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-6 bg-white border border-amber-100 rounded-2xl p-5 shadow-sm">
      <h2 className="text-amber-900 font-bold text-base border-l-4 border-amber-400 pl-3 mb-3">{title}</h2>
      {children}
    </section>
  );
}
