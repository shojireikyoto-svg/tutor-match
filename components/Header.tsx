import Link from "next/link";
import { getSession } from "@/lib/auth";
import { logoutAction } from "@/lib/actions";

export default async function Header() {
  const session = await getSession();

  return (
    <header className="border-b border-amber-100 bg-white/80 backdrop-blur sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">🌸</span>
          <span className="font-bold text-lg text-amber-900">
            合格のはな
          </span>
        </Link>
        <nav className="flex items-center gap-2 sm:gap-5 text-sm">
          <Link
            href="/tutors"
            className="text-stone-700 hover:text-amber-700 px-2 py-1"
          >
            先生を探す
          </Link>
          <Link
            href="/about"
            className="text-stone-700 hover:text-amber-700 px-2 py-1 hidden sm:inline"
          >
            サービス紹介
          </Link>
          {!session && (
            <>
              <Link
                href="/login"
                className="text-stone-700 hover:text-amber-700 px-2 py-1"
              >
                ログイン
              </Link>
              <Link
                href="/signup"
                className="bg-amber-500 hover:bg-amber-600 text-white rounded-full px-4 py-2 font-medium"
              >
                無料登録
              </Link>
            </>
          )}
          {session && (
            <>
              <Link
                href={
                  session.role === "parent" ? "/dashboard" : "/tutor/dashboard"
                }
                className="text-stone-700 hover:text-amber-700 px-2 py-1"
              >
                マイページ
              </Link>
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="text-stone-500 hover:text-stone-800 px-2 py-1"
                >
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
