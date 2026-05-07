import Link from "next/link";
import { listTutors } from "@/lib/queries";

const TESTIMONIALS = [
  {
    name: "Kさん（小6・女の子のお母さま）",
    school: "→ 女子学院 合格",
    body: "娘が算数を嫌いになりそうで焦っていました。先生と出会って3ヶ月、「算数が好きになった！」と言い出して涙が出ました。",
    avatar: "👩",
  },
  {
    name: "Tさん（小5・男の子のお母さま）",
    school: "→ 開成 合格",
    body: "塾のSAPIXと並走してもらいました。塾でわからなかった部分を丁寧に拾ってくれて、成績がぐんぐん上がりました。",
    avatar: "👩‍👦",
  },
  {
    name: "Mさん（小4・双子のお母さま）",
    school: "→ 渋谷幕張・豊島岡 合格",
    body: "2人分の受験は本当に大変で。先生が子どもだけでなく私の相談にも乗ってくれたので、最後まで諦めずに頑張れました。",
    avatar: "👩‍👧‍👦",
  },
];

const FAQS = [
  {
    q: "いくらかかりますか？",
    a: "先生によって異なりますが、1時間4,500円〜8,000円が相場です。入会金・紹介料は一切かかりません。授業料は先生と直接お支払いください。",
  },
  {
    q: "週に何回から依頼できますか？",
    a: "1回から依頼OK。週1回でも月1回でも、ご家庭のペースに合わせられます。まずは1回試してみることをおすすめしています。",
  },
  {
    q: "合わなかったら変えられますか？",
    a: "もちろんです。先生との相性は大切なので、遠慮なくご相談ください。別の先生をご紹介します。",
  },
  {
    q: "どんな塾に対応していますか？",
    a: "SAPIX・四谷大塚・早稲アカ・日能研など主要塾すべてに対応しています。塾のテキスト・カリキュラムに合わせた授業を行います。",
  },
  {
    q: "低学年でも利用できますか？",
    a: "小2〜小6まで対応しています。低学年のうちから算数・国語の土台を作ることで、4年生からの本格受験勉強をスムーズに始められます。",
  },
];

export default async function Home() {
  const featured = (await listTutors()).slice(0, 3);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-100 via-rose-50 to-white -z-10" />
        <div className="max-w-6xl mx-auto px-4 py-14 sm:py-24 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="inline-block bg-rose-100 text-rose-700 text-xs font-bold rounded-full px-3 py-1 mb-4">
              🌸 中学受験を頑張るご家庭へ
            </p>
            <h1 className="text-3xl sm:text-5xl font-bold text-amber-900 leading-tight">
              お子さまに、
              <br />
              <span className="text-rose-500">ぴったりの先生</span>を。
            </h1>
            <p className="mt-5 text-stone-700 text-base sm:text-lg leading-relaxed">
              「塾だけでは伸び悩んでいる…」<br />
              「教えるたびにケンカになる…」<br />
              そんなお悩みを、中学受験を知り尽くした<br />
              家庭教師が<strong className="text-amber-700">解決します。</strong>
            </p>
            <div className="mt-7 flex flex-col sm:flex-row gap-3">
              <Link
                href="/tutors"
                className="bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white rounded-2xl px-7 py-4 font-bold text-lg shadow-md text-center"
              >
                先生を探してみる →
              </Link>
              <Link
                href="/signup"
                className="bg-white border-2 border-amber-400 text-amber-700 hover:bg-amber-50 rounded-2xl px-7 py-4 font-bold text-center"
              >
                無料で会員登録
              </Link>
            </div>
            <p className="mt-4 text-xs text-stone-500">
              ✓ 登録・入会金無料　✓ 1回から　✓ 先生変更OK
            </p>
          </div>
          <div className="relative hidden md:block">
            <div className="aspect-square bg-gradient-to-br from-amber-200 to-rose-200 rounded-[2rem] flex items-center justify-center text-8xl">
              🌸
            </div>
            <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-lg p-4">
              <div className="font-bold text-amber-700 text-lg">合格率 92%</div>
              <div className="text-stone-500 text-xs">2025年度実績</div>
            </div>
            <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-lg p-4">
              <div className="font-bold text-rose-500">登録教師 200名+</div>
              <div className="text-stone-500 text-xs">全国対応</div>
            </div>
          </div>
        </div>
      </section>

      {/* お悩み */}
      <section className="max-w-6xl mx-auto px-4 py-14">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-amber-900">
          こんなお悩み、ありませんか？
        </h2>
        <div className="mt-8 grid md:grid-cols-3 gap-5">
          {[
            { icon: "😰", title: "塾の宿題が回らない", body: "毎週たまる宿題。見てあげたくても内容が難しくて…。" },
            { icon: "📉", title: "成績が伸び悩んでいる", body: "頑張っているのにテストの点が上がらない。このままで大丈夫？" },
            { icon: "💔", title: "勉強でケンカになる", body: "教えるたびに親子バトル。雰囲気が悪くなるのが辛い。" },
          ].map((c) => (
            <div key={c.title} className="bg-white border border-amber-100 rounded-2xl p-6 shadow-sm">
              <div className="text-4xl">{c.icon}</div>
              <h3 className="mt-3 font-bold text-lg text-amber-900">{c.title}</h3>
              <p className="mt-2 text-stone-600">{c.body}</p>
            </div>
          ))}
        </div>
        <p className="mt-8 text-center text-stone-700 text-lg">
          👇 そのお悩み、<strong className="text-amber-700">家庭教師で解決できます</strong>
        </p>
      </section>

      {/* 強み */}
      <section className="bg-amber-50/60 py-14">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-amber-900">
            合格のはな が選ばれる理由
          </h2>
          <div className="mt-8 grid md:grid-cols-3 gap-5">
            {[
              { icon: "🏆", num: "01", title: "中学受験のプロだけ", body: "御三家・難関校の合格実績を持つ家庭教師のみ登録。SAPIX・四谷大塚・早稲アカ対応。" },
              { icon: "💬", num: "02", title: "お母さま目線のマッチング", body: "お子さまの性格・志望校・通塾先を踏まえ、相性のよい先生をご提案。相談は何度でも無料。" },
              { icon: "📅", num: "03", title: "1回ごとの安心予約", body: "高額な前払いなし。必要な回数だけ予約。合わなければ遠慮なく別の先生に変更できます。" },
            ].map((c) => (
              <div key={c.num} className="bg-white rounded-2xl p-7 shadow-sm">
                <div className="text-3xl">{c.icon}</div>
                <div className="text-rose-400 font-bold text-sm mt-2">{c.num}</div>
                <h3 className="mt-1 font-bold text-lg text-amber-900">{c.title}</h3>
                <p className="mt-2 text-stone-600">{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 流れ */}
      <section className="max-w-6xl mx-auto px-4 py-14">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-amber-900">
          ご利用の流れ
        </h2>
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { step: "1", title: "無料会員登録", body: "30秒で完了" },
            { step: "2", title: "先生を探す", body: "条件で絞り込み" },
            { step: "3", title: "相談・申込", body: "メッセージで気軽に" },
            { step: "4", title: "授業スタート", body: "先生と直接日程調整" },
          ].map((s, i) => (
            <div key={s.step} className="relative bg-gradient-to-br from-amber-50 to-rose-50 rounded-2xl p-5 text-center">
              {i < 3 && (
                <div className="hidden md:block absolute -right-2 top-1/2 -translate-y-1/2 text-amber-300 text-2xl z-10">→</div>
              )}
              <div className="w-10 h-10 bg-amber-400 text-white rounded-full mx-auto flex items-center justify-center font-bold text-lg">
                {s.step}
              </div>
              <h3 className="mt-3 font-bold text-amber-900 text-sm sm:text-base">{s.title}</h3>
              <p className="text-xs text-stone-600 mt-1">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 口コミ */}
      <section className="bg-rose-50/50 py-14">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-amber-900">
            合格したお母さまの声
          </h2>
          <div className="mt-8 grid md:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-3xl">{t.avatar}</div>
                  <div>
                    <div className="font-bold text-amber-900 text-sm">{t.name}</div>
                    <div className="text-rose-500 text-xs font-bold">{t.school}</div>
                  </div>
                </div>
                <div className="text-amber-400 mb-2">★★★★★</div>
                <p className="text-stone-700 text-sm leading-relaxed">「{t.body}」</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* おすすめ先生 */}
      <section className="max-w-6xl mx-auto px-4 py-14">
        <div className="flex items-end justify-between mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-amber-900">おすすめの先生</h2>
          <Link href="/tutors" className="text-amber-700 hover:underline text-sm">すべて見る →</Link>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {featured.map((t) => (
            <Link key={t.id} href={`/tutors/${t.id}`} className="bg-white border border-amber-100 rounded-2xl p-5 hover:shadow-lg transition-shadow block">
              <div className="flex items-center gap-3">
                {t.photo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={t.photo_url} alt={t.name} className="w-16 h-16 rounded-full object-cover" />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-amber-200 flex items-center justify-center text-2xl">👩‍🏫</div>
                )}
                <div>
                  <div className="font-bold text-amber-900">{t.name} 先生</div>
                  <div className="text-xs text-stone-500">{t.university}</div>
                  <div className="text-amber-400 text-xs mt-0.5">★★★★★</div>
                </div>
              </div>
              <p className="mt-3 text-sm text-stone-700 line-clamp-2">{t.headline}</p>
              <div className="mt-3 flex flex-wrap gap-1">
                {t.subjects.split(",").map((s) => (
                  <span key={s} className="bg-amber-100 text-amber-800 text-xs rounded-full px-2 py-0.5">{s.trim()}</span>
                ))}
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-stone-500">指導歴 {t.experience_years}年</span>
                <span className="text-rose-600 font-bold text-sm">¥{t.hourly_rate.toLocaleString()}/h</span>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-6 text-center">
          <Link href="/tutors" className="inline-block bg-amber-500 hover:bg-amber-600 text-white rounded-2xl px-8 py-4 font-bold text-lg">
            すべての先生を見る
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 py-14">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-amber-900">
          よくあるご質問
        </h2>
        <div className="mt-8 space-y-3">
          {FAQS.map((f) => (
            <details key={f.q} className="bg-white border border-amber-100 rounded-2xl overflow-hidden group">
              <summary className="flex items-center justify-between px-5 py-4 cursor-pointer font-bold text-amber-900 list-none">
                <span>Q. {f.q}</span>
                <span className="text-amber-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="px-5 pb-4 text-stone-700 border-t border-amber-100 pt-3">
                {f.a}
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 pb-16">
        <div className="bg-gradient-to-br from-amber-400 to-rose-400 rounded-3xl p-10 text-white text-center shadow-xl">
          <h2 className="text-2xl sm:text-3xl font-bold">
            お子さまの合格を、<br className="sm:hidden" />一緒に目指しませんか？
          </h2>
          <p className="mt-3 opacity-95">登録無料・入会金なし・1回から始められます</p>
          <Link href="/signup" className="inline-block mt-6 bg-white text-rose-600 hover:bg-rose-50 rounded-2xl px-10 py-4 font-bold text-lg shadow-md">
            まずは無料で登録する
          </Link>
          <p className="mt-3 text-sm opacity-80">30秒で完了。クレジットカード不要。</p>
        </div>
      </section>

      {/* 固定フッターCTA（モバイル） */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-amber-100 p-3 shadow-lg z-20">
        <Link href="/tutors" className="block bg-amber-500 hover:bg-amber-600 text-white rounded-xl py-3 font-bold text-center text-lg">
          先生を探す →
        </Link>
      </div>
    </div>
  );
}
