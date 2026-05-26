import { listAvailableItems } from "@/lib/queries";
import Link from "next/link";
import { getSession } from "@/lib/auth";

const CATEGORIES = ["すべて", "冷蔵庫", "洗濯機", "電子レンジ", "ベッド", "机・デスク", "ソファ", "テレビ", "その他"];
const STATUS_LABEL: Record<string, string> = {
  available: "出品中",
  matched: "成約済",
  picked_up: "集荷済",
  delivered: "配送完了",
};
const CATEGORY_EMOJI: Record<string, string> = {
  "冷蔵庫": "🧊", "洗濯機": "🌀", "電子レンジ": "📡", "ベッド": "🛏️",
  "机・デスク": "🪑", "ソファ": "🛋️", "テレビ": "📺", "その他": "📦",
};

export default async function ItemsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const session = await getSession();
  const selectedCat = category && category !== "すべて" ? category : undefined;
  const items = await listAvailableItems(selectedCat);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-indigo-900">商品一覧</h1>
        {session && (
          <Link href="/items/new" className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-4 py-2 text-sm font-medium">
            + 出品する
          </Link>
        )}
      </div>

      {/* Category filter */}
      <div className="flex gap-2 flex-wrap mb-8">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat}
            href={cat === "すべて" ? "/items" : `/items?category=${encodeURIComponent(cat)}`}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
              (cat === "すべて" && !selectedCat) || cat === selectedCat
                ? "bg-indigo-600 text-white border-indigo-600"
                : "bg-white text-slate-600 border-slate-300 hover:border-indigo-400"
            }`}
          >
            {CATEGORY_EMOJI[cat] || ""} {cat}
          </Link>
        ))}
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20 text-slate-400">
          <div className="text-5xl mb-4">📭</div>
          <p>現在出品中の商品はありません</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item) => (
            <Link key={item.id} href={`/items/${item.id}`} className="bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md hover:border-indigo-200 transition-all overflow-hidden block">
              <div className="aspect-video bg-slate-100 flex items-center justify-center text-5xl">
                {item.images[0] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover" />
                ) : (
                  CATEGORY_EMOJI[item.category] || "📦"
                )}
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <h2 className="font-bold text-slate-900 line-clamp-1">{item.title}</h2>
                  <span className="text-xs bg-slate-100 text-slate-500 rounded-full px-2 py-0.5 whitespace-nowrap">
                    {item.category}
                  </span>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xl font-bold text-indigo-600">
                    {item.price === 0 ? "無料" : `¥${item.price.toLocaleString()}`}
                  </span>
                  <span className="text-xs text-slate-400">{item.seller_name}</span>
                </div>
                {item.pickup_date && (
                  <div className="mt-2 text-xs text-slate-500">
                    搬出希望: {item.pickup_date} {item.pickup_time_slot}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
