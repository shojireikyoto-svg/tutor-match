import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { listMatchRequestsForParent, listReservationsForParent } from "@/lib/queries";
import { cancelReservationAction } from "@/lib/actions";

const STATUS_LABEL: Record<string, { label: string; cls: string; icon: string }> = {
  pending:   { label: "返信待ち", cls: "bg-amber-100 text-amber-800", icon: "⏳" },
  accepted:  { label: "承認済み", cls: "bg-emerald-100 text-emerald-800", icon: "✅" },
  declined:  { label: "お断り",   cls: "bg-stone-200 text-stone-600", icon: "❌" },
  cancelled: { label: "キャンセル", cls: "bg-stone-200 text-stone-600", icon: "🚫" },
  requested: { label: "確認待ち", cls: "bg-amber-100 text-amber-800", icon: "⏳" },
  confirmed: { label: "確定",     cls: "bg-emerald-100 text-emerald-800", icon: "✅" },
  completed: { label: "完了",     cls: "bg-sky-100 text-sky-800", icon: "🎉" },
};

export default async function ParentDashboard() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== "parent") redirect("/tutor/dashboard");

  const matches = await listMatchRequestsForParent(session.id);
  const reservations = await listReservationsForParent(session.id);
  const hasActivity = matches.length > 0 || reservations.length > 0;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 pb-24 md:pb-10">
      <div className="bg-gradient-to-r from-amber-50 to-rose-50 rounded-2xl p-5 mb-6">
        <p className="text-amber-700 font-bold text-lg">
          {session.name} さん、こんにちは 🌸
        </p>
        <p className="text-stone-600 text-sm mt-1">
          お子さまの受験を全力でサポートします。
        </p>
      </div>

      {/* はじめての方 */}
      {!hasActivity && (
        <div className="bg-white border-2 border-dashed border-amber-300 rounded-2xl p-7 text-center mb-6">
          <div className="text-4xl mb-3">👋</div>
          <h2 className="font-bold text-amber-900 text-lg">まずは先生を探してみましょう</h2>
          <p className="text-stone-600 text-sm mt-2">気になる先生に無料で相談できます。返信は24時間以内。</p>
          <Link href="/tutors" className="inline-block mt-4 bg-amber-500 hover:bg-amber-600 text-white rounded-xl px-6 py-3 font-bold">
            先生を探す →
          </Link>
        </div>
      )}

      {/* 次のステップ案内 */}
      {hasActivity && (
        <div className="bg-white border border-amber-100 rounded-2xl p-4 mb-6 flex items-center gap-3">
          <div className="text-2xl">💡</div>
          <div>
            <p className="text-sm text-stone-700">他にも気になる先生はいますか？</p>
            <Link href="/tutors" className="text-amber-700 font-bold text-sm hover:underline">先生をもっと見る →</Link>
          </div>
        </div>
      )}

      {/* マッチング申込 */}
      <Section title="📬 相談・マッチング申込" count={matches.length}>
        {matches.length === 0 ? (
          <Empty>
            まだ相談していません。
            <Link href="/tutors" className="block mt-2 text-amber-700 font-bold hover:underline">先生を探して相談する →</Link>
          </Empty>
        ) : (
          <ul className="space-y-3">
            {matches.map((m) => {
              const s = STATUS_LABEL[m.status] ?? { label: m.status, cls: "bg-stone-100", icon: "" };
              return (
                <li key={m.id} className="bg-white border border-amber-100 rounded-2xl p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <Link href={`/tutors/${m.tutor_id}`} className="font-bold text-amber-900 hover:underline">
                        {m.tutor_name} 先生
                      </Link>
                      <p className="text-sm text-stone-600 mt-1 line-clamp-2">{m.message}</p>
                      <p className="text-xs text-stone-400 mt-1">📅 {m.created_at.slice(0, 10)}</p>
                    </div>
                    <span className={`text-xs rounded-full px-3 py-1 font-medium whitespace-nowrap ${s.cls}`}>
                      {s.icon} {s.label}
                    </span>
                  </div>
                  {m.status === "pending" && (
                    <p className="mt-2 text-xs text-amber-700 bg-amber-50 rounded-lg p-2">
                      先生からの返信をお待ちください。通常24時間以内にご連絡があります。
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </Section>

      {/* 予約 */}
      <Section title="📅 予約一覧" count={reservations.length}>
        {reservations.length === 0 ? (
          <Empty>予約はまだありません。</Empty>
        ) : (
          <ul className="space-y-3">
            {reservations.map((r) => {
              const s = STATUS_LABEL[r.status] ?? { label: r.status, cls: "bg-stone-100", icon: "" };
              return (
                <li key={r.id} className="bg-white border border-amber-100 rounded-2xl p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-bold text-amber-900">{r.tutor_name} 先生</div>
                      <div className="text-sm text-stone-600 mt-1">
                        📅 {r.starts_at.slice(0, 16)}　⏱ {r.duration_min}分
                      </div>
                      {r.note && <p className="text-xs text-stone-500 mt-1">{r.note}</p>}
                    </div>
                    <span className={`text-xs rounded-full px-3 py-1 font-medium whitespace-nowrap ${s.cls}`}>
                      {s.icon} {s.label}
                    </span>
                  </div>
                  {(r.status === "requested" || r.status === "confirmed") && (
                    <form action={cancelReservationAction} className="mt-2">
                      <input type="hidden" name="id" value={r.id} />
                      <button type="submit" className="text-xs text-stone-400 hover:text-rose-600 underline">
                        キャンセルする
                      </button>
                    </form>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </Section>
    </div>
  );
}

function Section({ title, count, children }: { title: string; count: number; children: React.ReactNode }) {
  return (
    <section className="mt-6">
      <div className="flex items-center gap-2 mb-3">
        <h2 className="text-lg font-bold text-amber-900">{title}</h2>
        {count > 0 && (
          <span className="bg-amber-400 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
            {count}
          </span>
        )}
      </div>
      {children}
    </section>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-amber-50/60 border border-dashed border-amber-200 rounded-2xl p-6 text-center text-stone-500 text-sm">
      {children}
    </div>
  );
}
