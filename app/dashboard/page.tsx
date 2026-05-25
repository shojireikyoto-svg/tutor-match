import { getSession } from "@/lib/auth";
import { getMyListings, getMyPurchases } from "@/lib/queries";
import { redirect } from "next/navigation";
import Link from "next/link";
import { updateItemStatusAction } from "@/lib/actions";

const STATUS_LABEL: Record<string, string> = {
  available: "出品中", matched: "成約済", picked_up: "集荷済", delivered: "配送完了",
};
const STATUS_CLS: Record<string, string> = {
  available: "bg-green-100 text-green-700",
  matched: "bg-yellow-100 text-yellow-700",
  picked_up: "bg-blue-100 text-blue-700",
  delivered: "bg-slate-100 text-slate-500",
};
const NEXT_STATUS: Record<string, string> = {
  matched: "picked_up", picked_up: "delivered",
};
const NEXT_LABEL: Record<string, string> = {
  picked_up: "集荷完了に更新", delivered: "配送完了に更新",
};
const CATEGORY_EMOJI: Record<string, string> = {
  "冷蔵庫": "🧊", "洗濯機": "🌀", "電子レンジ": "📡", "ベッド": "🛏️",
  "机・デスク": "🪑", "ソファ": "🛋️", "テレビ": "📺", "その他": "📦",
};

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  const { tab } = await searchParams;
  const activeTab = tab === "purchases" ? "purchases" : "listings";

  const [listings, purchases] = await Promise.all([
    getMyListings(session.id),
    getMyPurchases(session.id),
  ]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-indigo-900">マイページ</h1>
          <p className="text-sm text-slate-500 mt-0.5">{session.name}</p>
        </div>
        <Link href="/items/new" className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-4 py-2 text-sm font-medium">
          + 出品する
        </Link>
      </div>

      <div className="flex gap-1 bg-slate-100 rounded-xl p-1 mb-6">
        <Link
          href="/dashboard"
          className={`flex-1 text-center py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === "listings" ? "bg-white text-indigo-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
          }`}
        >
          出品管理（{listings.length}件）
        </Link>
        <Link
          href="/dashboard?tab=purchases"
          className={`flex-1 text-center py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === "purchases" ? "bg-white text-indigo-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
          }`}
        >
          購入履歴（{purchases.length}件）
        </Link>
      </div>

      {activeTab === "listings" && (
        <div className="space-y-3">
          {listings.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <div className="text-4xl mb-3">📦</div>
              <p>まだ出品していません</p>
              <Link href="/items/new" className="mt-4 inline-block text-indigo-600 hover:underline text-sm">出品する →</Link>
            </div>
          ) : (
            listings.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                  {CATEGORY_EMOJI[item.category] || "📦"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Link href={`/items/${item.id}`} className="font-medium text-slate-900 hover:text-indigo-600 truncate">
                      {item.title}
                    </Link>
                    <span className={`text-xs rounded-full px-2 py-0.5 font-medium ${STATUS_CLS[item.item_status] ?? ""}`}>
                      {STATUS_LABEL[item.item_status]}
                    </span>
                  </div>
                  <div className="text-sm text-slate-500 mt-0.5">
                    {item.price === 0 ? "無料" : `¥${item.price.toLocaleString()}`}
                    {item.pickup_date && ` · 搬出 ${item.pickup_date}`}
                  </div>
                </div>
                {NEXT_STATUS[item.item_status] && (
                  <form action={updateItemStatusAction} className="flex-shrink-0">
                    <input type="hidden" name="item_id" value={item.id} />
                    <input type="hidden" name="status" value={NEXT_STATUS[item.item_status]} />
                    <button type="submit" className="text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg px-3 py-2 font-medium whitespace-nowrap">
                      {NEXT_LABEL[NEXT_STATUS[item.item_status]]}
                    </button>
                  </form>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === "purchases" && (
        <div className="space-y-3">
          {purchases.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <div className="text-4xl mb-3">🛋️</div>
              <p>まだ購入していません</p>
              <Link href="/items" className="mt-4 inline-block text-indigo-600 hover:underline text-sm">商品を探す →</Link>
            </div>
          ) : (
            purchases.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                  {CATEGORY_EMOJI[item.category] || "📦"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Link href={`/items/${item.id}`} className="font-medium text-slate-900 hover:text-indigo-600 truncate">
                      {item.title}
                    </Link>
                    <span className={`text-xs rounded-full px-2 py-0.5 font-medium ${STATUS_CLS[item.item_status] ?? ""}`}>
                      {STATUS_LABEL[item.item_status]}
                    </span>
                  </div>
                  <div className="text-sm text-slate-500 mt-0.5">
                    {item.seller_name} · 配送料 ¥{item.delivery_fee?.toLocaleString()}
                    {item.delivery_date && ` · 搬入 ${item.delivery_date}`}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
