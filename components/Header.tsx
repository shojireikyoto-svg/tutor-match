import Link from "next/link";
import { getSession } from "@/lib/auth";
import { logoutAction } from "@/lib/actions";

export default async function Header() {
  const session = await getSession();

  return (
    <header className="border-b border-indigo-100 bg-white/90 backdrop-blur sticky top-0 z-30 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="bg-indigo-600 text-white font-black text-sm px-2 py-1 rounded-lg">UR</span>
          <span className="font-bold text-lg text-indigo-900">Uni-Relay</span>
        </Link>
        <nav className="flex items-center gap-2 sm:gap-4 text-sm">
          <Link href="/items" className="text-slate-600 hover:text-indigo-700 px-2 py-1">
            商品を探す
          </Link>
          {!session && (
            <>
              <Link href="/login" className="text-slate-600 hover:text-indigo-700 px-2 py-1">
                ログイン
              </Link>
              <Link href="/signup" className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-4 py-2 font-medium">
                登録
              </Link>
            </>
          )}
          {session && (
            <>
              <Link href="/items/new" className="text-slate-600 hover:text-indigo-700 px-2 py-1 hidden sm:inline">
                出品する
              </Link>
              <Link href="/dashboard" className="text-slate-600 hover:text-indigo-700 px-2 py-1">
                マイページ
              </Link>
              <form action={logoutAction}>
                <button type="submit" className="text-slate-400 hover:text-slate-700 px-2 py-1 text-xs">
                  ログアウト
                </button>
              </form>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
