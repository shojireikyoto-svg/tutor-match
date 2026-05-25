import Link from "next/link";

const CATEGORIES = [
  { name: "冷蔵庫", emoji: "🧊" },
  { name: "洗濯機", emoji: "🌀" },
  { name: "電子レンジ", emoji: "📡" },
  { name: "ベッド", emoji: "🛏️" },
  { name: "机・デスク", emoji: "🪑" },
  { name: "ソファ", emoji: "🛋️" },
  { name: "テレビ", emoji: "📺" },
  { name: "その他", emoji: "📦" },
];

const STEPS = [
  {
    num: "01",
    emoji: "📦",
    title: "先輩が出品",
    body: "引越し前に不要な家具・家電を登録。搬出住所・希望日時を入力するだけ。",
  },
  {
    num: "02",
    emoji: "🛒",
    title: "後輩が購入",
    body: "新生活に必要な家具・家電を格安でゲット。搬入先と日時を指定して確定。",
  },
  {
    num: "03",
    emoji: "🚚",
    title: "ダイレクト配送",
    body: "倉庫を経由せず直接お届け。配送料は距離と日程差で自動計算。",
  },
];

const FEATURES = [
  {
    icon: "🏭",
    title: "倉庫レス配送",
    body: "中間倉庫を省くことで配送コストを大幅削減。先輩・後輩双方がお得になります。",
  },
  {
    icon: "🎓",
    title: "大学生限定",
    body: "*.ac.jpメールアドレスが必要。同じ大学コミュニティ内での安心取引。",
  },
  {
    icon: "🛡️",
    title: "安心配送",
    body: "プロの配送業者が搬出から搬入まで対応。家具・家電の運搬に特化したサービス。",
  },
];

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 via-violet-50 to-slate-50 -z-10" />
        <div className="max-w-6xl mx-auto px-4 py-16 sm:py-28 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="inline-block bg-indigo-100 text-indigo-700 text-xs font-bold rounded-full px-3 py-1 mb-5">
              京都大学生の引越しをつなぐ
            </p>
            <h1 className="text-4xl sm:text-6xl font-black text-indigo-900 leading-tight">
              先輩の家具を、
              <br />
              <span className="text-violet-500">後輩へ。</span>
            </h1>
            <p className="mt-6 text-slate-700 text-base sm:text-lg leading-relaxed">
              卒業生の家具・家電を、入学する新入生へ直接お届け。
              <br />
              倉庫なし・ダイレクト配送で、
              <strong className="text-indigo-700">お互いの引越しコストを大幅節約。</strong>
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                href="/items/new"
                className="bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-2xl px-7 py-4 font-bold text-lg shadow-md text-center"
              >
                出品する（先輩へ）
              </Link>
              <Link
                href="/items"
                className="bg-white border-2 border-indigo-400 text-indigo-700 hover:bg-indigo-50 rounded-2xl px-7 py-4 font-bold text-center"
              >
                商品を探す（後輩へ）
              </Link>
            </div>
            <p className="mt-4 text-xs text-slate-500">
              ✓ 大学メール（*.ac.jp）で登録　✓ 倉庫なし　✓ 直接配送
            </p>
          </div>
          <div className="relative hidden md:flex items-center justify-center">
            <div className="aspect-square w-full max-w-sm bg-gradient-to-br from-indigo-200 to-violet-200 rounded-[2.5rem] flex items-center justify-center text-8xl">
              🚚
            </div>
            <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-lg p-4">
              <div className="font-bold text-indigo-700 text-lg">配送料 5,000円〜</div>
              <div className="text-slate-500 text-xs">倉庫なしで格安実現</div>
            </div>
            <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-lg p-4">
              <div className="font-bold text-violet-600">京都市内対応</div>
              <div className="text-slate-500 text-xs">大学周辺エリア</div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-indigo-900">
          ご利用の流れ
        </h2>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {STEPS.map((step, i) => (
            <div key={step.num} className="relative bg-white rounded-2xl p-7 shadow-sm border border-slate-100 text-center">
              {i < 2 && (
                <div className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 text-indigo-300 text-3xl z-10">
                  →
                </div>
              )}
              <div className="w-12 h-12 bg-indigo-600 text-white rounded-full mx-auto flex items-center justify-center font-bold text-sm">
                {step.num}
              </div>
              <div className="text-4xl mt-4">{step.emoji}</div>
              <h3 className="mt-3 font-bold text-lg text-indigo-900">{step.title}</h3>
              <p className="mt-2 text-slate-600 text-sm">{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-indigo-50/60 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-indigo-900">
            Uni-Relay の特長
          </h2>
          <div className="mt-10 grid md:grid-cols-3 gap-6">
            {FEATURES.map((f) => (
              <div key={f.title} className="bg-white rounded-2xl p-7 shadow-sm border border-indigo-100">
                <div className="text-4xl">{f.icon}</div>
                <h3 className="mt-4 font-bold text-lg text-indigo-900">{f.title}</h3>
                <p className="mt-2 text-slate-600 text-sm leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-indigo-900">
          配送料金のしくみ
        </h2>
        <p className="text-center text-slate-500 mt-2">透明な料金体系で、ぼったくりなし</p>
        <div className="mt-10 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="bg-indigo-600 text-white px-6 py-4">
            <div className="text-sm font-medium opacity-80">基本料金（例：約8km・同日配送）</div>
            <div className="text-3xl font-black mt-1">¥9,000</div>
          </div>
          <div className="p-6 space-y-3 text-sm">
            <div className="flex justify-between items-center py-2 border-b border-slate-100">
              <span className="text-slate-600">基本料金</span>
              <span className="font-bold text-slate-900">¥5,000</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-100">
              <span className="text-slate-600">距離加算（約8km）</span>
              <span className="font-bold text-slate-900">¥4,000</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-100">
              <span className="text-slate-600">一時保管料（搬出翌日配送）</span>
              <span className="font-bold text-slate-900">+¥1,500 / 日</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-slate-600">商品代金（0円〜）</span>
              <span className="font-bold text-slate-900">出品者が設定</span>
            </div>
          </div>
          <div className="bg-slate-50 px-6 py-3 text-xs text-slate-500">
            ※ 搬出日から配送日までの差が大きいほど一時保管料が加算されます（最大3日）
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-violet-50/50 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-indigo-900">
            取扱カテゴリ
          </h2>
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.name}
                href={`/items?category=${encodeURIComponent(cat.name)}`}
                className="bg-white rounded-2xl p-5 text-center shadow-sm border border-slate-100 hover:border-indigo-300 hover:shadow-md transition-all group"
              >
                <div className="text-4xl">{cat.emoji}</div>
                <div className="mt-3 font-medium text-slate-700 group-hover:text-indigo-700 text-sm">
                  {cat.name}
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link
              href="/items"
              className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl px-8 py-4 font-bold text-lg shadow-md"
            >
              すべての商品を見る
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-gradient-to-br from-indigo-600 to-violet-600 rounded-3xl p-10 text-white text-center shadow-xl">
          <h2 className="text-2xl sm:text-3xl font-bold">
            引越しコストを、一緒に減らそう。
          </h2>
          <p className="mt-3 opacity-90 text-sm sm:text-base">
            大学メール（*.ac.jp）で登録するだけ。先輩も後輩も、みんなお得に。
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/signup"
              className="inline-block bg-white text-indigo-700 hover:bg-indigo-50 rounded-2xl px-8 py-4 font-bold text-lg shadow-md"
            >
              無料で登録する
            </Link>
            <Link
              href="/items"
              className="inline-block bg-indigo-500/50 hover:bg-indigo-500/70 text-white border border-white/30 rounded-2xl px-8 py-4 font-bold text-lg"
            >
              商品を見る
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
