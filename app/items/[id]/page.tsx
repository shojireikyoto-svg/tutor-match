import { getItemById, getMatchingByItemId } from "@/lib/queries";
import { getSession } from "@/lib/auth";
import { notFound } from "next/navigation";
import Link from "next/link";
import CheckoutForm from "./CheckoutForm";

const CATEGORY_EMOJI: Record<string, string> = {
  "冷蔵庫": "🧊", "洗濯機": "🌀", "電子レンジ": "📡", "ベッド": "🛏️",
  "机・デスク": "🪑", "ソファ": "🛋️", "テレビ": "📺", "その他": "📦",
};
const STATUS_BADGE: Record<string, { label: string; cls: string }> = {
  available: { label: "出品中", cls: "bg-green-100 text-green-700" },
  matched: { label: "成約済", cls: "bg-yellow-100 text-yellow-700" },
  picked_up: { label: "集荷済", cls: "bg-blue-100 text-blue-700" },
  delivered: { label: "配送完了", cls: "bg-slate-100 text-slate-500" },
};

export default async function ItemDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [item, session] = await Promise.all([getItemById(id), getSession()]);
  if (!item) notFound();
  const matching = item.item_status !== "available" ? await getMatchingByItemId(id) : null;
  const badge = STATUS_BADGE[item.item_status] ?? STATUS_BADGE.available;
  const isSeller = session?.id === item.seller_id;
  const isBuyer = session?.id === item.buyer_id;
  const canPurchase = session && !isSeller && item.item_status === "available";

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link href="/items" className="text-indigo-600 text-sm hover:underline">← 商品一覧に戻る</Link>

      <div className="mt-4 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="aspect-video bg-slate-100 flex items-center justify-center text-8xl">
          {item.images[0] ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover" />
          ) : (
            CATEGORY_EMOJI[item.category] || "📦"
          )}
        </div>

        <div className="p-6">
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-2xl font-bold text-slate-900">{item.title}</h1>
            <span className={`text-xs rounded-full px-3 py-1 font-medium whitespace-nowrap ${badge.cls}`}>
              {badge.label}
            </span>
          </div>

          <div className="mt-2 flex items-center gap-3">
            <span className="text-3xl font-bold text-indigo-600">
              {item.price === 0 ? "無料" : `¥${item.price.toLocaleString()}`}
            </span>
            <span className="bg-slate-100 text-slate-500 text-xs rounded-full px-2 py-1">{item.category}</span>
          </div>

          {item.description && (
            <p className="mt-4 text-slate-600 leading-relaxed">{item.description}</p>
          )}

          <div className="mt-6 bg-slate-50 rounded-xl p-4 space-y-2 text-sm">
            <div className="flex gap-2">
              <span className="text-slate-400 w-20">出品者</span>
              <span className="text-slate-700 font-medium">{item.seller_name}</span>
            </div>
            {item.pickup_date && (
              <div className="flex gap-2">
                <span className="text-slate-400 w-20">搬出希望</span>
                <span className="text-slate-700">{item.pickup_date}（{item.pickup_time_slot}）</span>
              </div>
            )}
            <div className="flex gap-2">
              <span className="text-slate-400 w-20">搬出元</span>
              <span className="text-slate-700">{item.pickup_address || "京都市内"}</span>
            </div>
          </div>

          {/* Matching info (if already matched) */}
          {matching && (isSeller || isBuyer) && (
            <div className="mt-4 bg-indigo-50 rounded-xl p-4 space-y-2 text-sm">
              <h2 className="font-bold text-indigo-900">配送情報</h2>
              <div className="flex gap-2">
                <span className="text-slate-400 w-20">搬入希望</span>
                <span className="text-slate-700">{matching.delivery_date}（{matching.delivery_time_slot}）</span>
              </div>
              <div className="flex gap-2">
                <span className="text-slate-400 w-20">配送料</span>
                <span className="text-slate-700 font-bold">¥{matching.delivery_fee.toLocaleString()}</span>
              </div>
              <div className="flex gap-2">
                <span className="text-slate-400 w-20">合計</span>
                <span className="text-indigo-700 font-bold">¥{(item.price + matching.delivery_fee).toLocaleString()}</span>
              </div>
            </div>
          )}

          {/* Checkout form for buyers */}
          {canPurchase && item.pickup_date && (
            <div className="mt-6">
              <CheckoutForm itemId={item.id} pickupDate={item.pickup_date} itemPrice={item.price} />
            </div>
          )}

          {!session && item.item_status === "available" && (
            <div className="mt-6 bg-indigo-50 rounded-xl p-4 text-center">
              <p className="text-slate-600 text-sm mb-3">購入するにはログインが必要です</p>
              <Link href="/login" className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-6 py-2.5 font-medium text-sm inline-block">
                ログインして購入する
              </Link>
            </div>
          )}

          {isSeller && (
            <div className="mt-6 bg-amber-50 rounded-xl p-4 text-center">
              <p className="text-amber-700 text-sm font-medium">これはあなたの出品商品です</p>
              <Link href="/dashboard" className="text-indigo-600 hover:underline text-sm mt-2 inline-block">
                出品管理はこちら →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
