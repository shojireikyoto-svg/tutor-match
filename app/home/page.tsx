import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function HomePage() {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-indigo-900 text-center">ようこそ、{session.name}さん</h1>
      <p className="text-center text-slate-500 mt-2">今日はどちらのモードで利用しますか？</p>
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Link href="/items/new" className="group bg-white border-2 border-indigo-200 hover:border-indigo-500 rounded-2xl p-8 text-center shadow-sm hover:shadow-md transition-all">
          <div className="text-5xl mb-4">📦</div>
          <h2 className="text-xl font-bold text-indigo-900">先輩モード</h2>
          <p className="text-sm text-slate-500 mt-2">家具・家電を出品して、後輩に譲渡する</p>
          <div className="mt-4 text-indigo-600 font-medium text-sm group-hover:underline">出品する →</div>
        </Link>
        <Link href="/items" className="group bg-white border-2 border-violet-200 hover:border-violet-500 rounded-2xl p-8 text-center shadow-sm hover:shadow-md transition-all">
          <div className="text-5xl mb-4">🛋️</div>
          <h2 className="text-xl font-bold text-violet-900">後輩モード</h2>
          <p className="text-sm text-slate-500 mt-2">家具・家電を探して、格安で手に入れる</p>
          <div className="mt-4 text-violet-600 font-medium text-sm group-hover:underline">商品を探す →</div>
        </Link>
      </div>
      <div className="mt-8 text-center">
        <Link href="/dashboard" className="text-slate-500 hover:text-indigo-600 text-sm underline">
          マイページ（出品管理・購入履歴）
        </Link>
      </div>
    </div>
  );
}
