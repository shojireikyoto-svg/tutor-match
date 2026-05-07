import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  listMatchRequestsForTutor,
  listReservationsForTutor,
} from "@/lib/queries";
import {
  respondMatchAction,
  respondReservationAction,
  updateTutorProfileAction,
} from "@/lib/actions";

interface TutorRow {
  user_id: number;
  headline: string;
  university: string;
  bio: string;
  subjects: string;
  areas: string;
  hourly_rate: number;
  experience_years: number;
  passed_schools: string;
  photo_url: string;
  published: number;
}

const STATUS_LABEL: Record<string, { label: string; cls: string }> = {
  pending: { label: "申込中", cls: "bg-amber-100 text-amber-800" },
  accepted: { label: "承認済", cls: "bg-emerald-100 text-emerald-800" },
  declined: { label: "辞退", cls: "bg-stone-200 text-stone-600" },
  requested: { label: "リクエスト", cls: "bg-amber-100 text-amber-800" },
  confirmed: { label: "確定", cls: "bg-emerald-100 text-emerald-800" },
  cancelled: { label: "キャンセル", cls: "bg-stone-200 text-stone-600" },
  completed: { label: "完了", cls: "bg-sky-100 text-sky-800" },
};

export default async function TutorDashboard() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== "tutor") redirect("/dashboard");

  const profile = db
    .prepare("SELECT * FROM tutor_profiles WHERE user_id = ?")
    .get(session.id) as TutorRow | undefined;

  const matches = listMatchRequestsForTutor(session.id);
  const reservations = listReservationsForTutor(session.id);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl sm:text-3xl font-bold text-amber-900">
        先生用マイページ
      </h1>
      <p className="text-stone-600 mt-1">
        {session.name} 先生、こんにちは 🌸
      </p>

      <Section title="プロフィール編集">
        <form
          action={updateTutorProfileAction}
          className="bg-white border border-amber-100 rounded-2xl p-5 grid sm:grid-cols-2 gap-4"
        >
          <Field label="キャッチコピー（headline）" name="headline" defaultValue={profile?.headline ?? ""} className="sm:col-span-2" />
          <Field label="大学・学部" name="university" defaultValue={profile?.university ?? ""} />
          <Field label="プロフィール写真URL" name="photo_url" defaultValue={profile?.photo_url ?? ""} />
          <Field label="指導教科（カンマ区切り）" name="subjects" defaultValue={profile?.subjects ?? ""} placeholder="算数,国語,理科" />
          <Field label="対応エリア" name="areas" defaultValue={profile?.areas ?? ""} placeholder="東京都(世田谷区),オンライン" />
          <Field label="時給（円）" name="hourly_rate" type="number" defaultValue={profile?.hourly_rate ?? 0} />
          <Field label="指導歴（年）" name="experience_years" type="number" defaultValue={profile?.experience_years ?? 0} />
          <Field label="主な合格実績（カンマ区切り）" name="passed_schools" defaultValue={profile?.passed_schools ?? ""} className="sm:col-span-2" />
          <label className="sm:col-span-2 block">
            <span className="block text-sm font-medium text-stone-700 mb-1">自己紹介</span>
            <textarea
              name="bio"
              defaultValue={profile?.bio ?? ""}
              rows={5}
              className="w-full border border-stone-300 rounded-lg px-3 py-2"
            />
          </label>
          <label className="sm:col-span-2 inline-flex items-center gap-2">
            <input
              type="checkbox"
              name="published"
              defaultChecked={!!profile?.published}
            />
            <span className="text-sm text-stone-700">
              プロフィールを公開する（保護者から検索可能になります）
            </span>
          </label>
          <div className="sm:col-span-2">
            <button
              type="submit"
              className="bg-amber-500 hover:bg-amber-600 text-white rounded-full px-6 py-2 font-bold"
            >
              保存する
            </button>
          </div>
        </form>
      </Section>

      <Section title="マッチング申込">
        {matches.length === 0 ? (
          <Empty>まだ申込はありません。</Empty>
        ) : (
          <ul className="space-y-3">
            {matches.map((m) => (
              <li
                key={m.id}
                className="bg-white border border-amber-100 rounded-2xl p-4"
              >
                <div className="flex flex-wrap justify-between gap-2">
                  <div>
                    <div className="font-bold text-amber-900">
                      {m.parent_name} さんより
                    </div>
                    <p className="text-sm text-stone-700 mt-1 whitespace-pre-line">
                      {m.message}
                    </p>
                    <p className="text-xs text-stone-400 mt-1">{m.created_at}</p>
                  </div>
                  <StatusBadge status={m.status} />
                </div>
                {m.status === "pending" && (
                  <div className="mt-3 flex gap-2">
                    <form action={respondMatchAction}>
                      <input type="hidden" name="id" value={m.id} />
                      <input type="hidden" name="action" value="accept" />
                      <button className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-full px-4 py-1.5 text-sm font-bold">
                        承認する
                      </button>
                    </form>
                    <form action={respondMatchAction}>
                      <input type="hidden" name="id" value={m.id} />
                      <input type="hidden" name="action" value="decline" />
                      <button className="bg-white border border-stone-300 hover:bg-stone-50 text-stone-700 rounded-full px-4 py-1.5 text-sm">
                        辞退
                      </button>
                    </form>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section title="予約一覧">
        {reservations.length === 0 ? (
          <Empty>予約はまだありません。</Empty>
        ) : (
          <ul className="space-y-3">
            {reservations.map((r) => (
              <li
                key={r.id}
                className="bg-white border border-amber-100 rounded-2xl p-4 flex flex-wrap justify-between items-center gap-3"
              >
                <div>
                  <div className="font-bold text-amber-900">
                    {r.parent_name} さん
                  </div>
                  <div className="text-sm text-stone-600">
                    📅 {r.starts_at}　⏱ {r.duration_min}分
                  </div>
                  {r.note && (
                    <p className="text-xs text-stone-500 mt-1">{r.note}</p>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <StatusBadge status={r.status} />
                  {r.status === "requested" && (
                    <>
                      <FormBtn id={r.id} action="confirm" label="確定" cls="bg-emerald-500 hover:bg-emerald-600 text-white" />
                      <FormBtn id={r.id} action="decline" label="辞退" cls="bg-white border border-stone-300 text-stone-700" />
                    </>
                  )}
                  {r.status === "confirmed" && (
                    <FormBtn id={r.id} action="complete" label="完了にする" cls="bg-sky-500 hover:bg-sky-600 text-white" />
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </Section>
    </div>
  );
}

function FormBtn({
  id,
  action,
  label,
  cls,
}: {
  id: number;
  action: string;
  label: string;
  cls: string;
}) {
  return (
    <form action={respondReservationAction}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="action" value={action} />
      <button className={`${cls} rounded-full px-4 py-1.5 text-sm font-medium`}>
        {label}
      </button>
    </form>
  );
}

function Field({
  label,
  className = "",
  ...props
}: { label: string; className?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className={`block ${className}`}>
      <span className="block text-sm font-medium text-stone-700 mb-1">
        {label}
      </span>
      <input
        {...props}
        className="w-full border border-stone-300 rounded-lg px-3 py-2"
      />
    </label>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-10">
      <h2 className="text-xl font-bold text-amber-900 mb-3">{title}</h2>
      {children}
    </section>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-amber-50/60 border border-dashed border-amber-200 rounded-2xl p-6 text-center text-stone-500">
      {children}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_LABEL[status] ?? { label: status, cls: "bg-stone-100" };
  return (
    <span className={`text-xs rounded-full px-3 py-1 font-medium ${s.cls}`}>
      {s.label}
    </span>
  );
}
