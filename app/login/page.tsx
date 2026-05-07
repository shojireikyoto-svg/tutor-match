"use client";
import { useActionState } from "react";
import { loginAction } from "@/lib/actions";
import Link from "next/link";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, null);

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-amber-900 text-center">ログイン</h1>
      <form action={formAction} className="mt-6 space-y-4">
        <label className="block">
          <span className="block text-sm font-medium text-stone-700 mb-1">
            メールアドレス
          </span>
          <input
            name="email"
            type="email"
            required
            className="w-full border border-stone-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-300"
          />
        </label>
        <label className="block">
          <span className="block text-sm font-medium text-stone-700 mb-1">
            パスワード
          </span>
          <input
            name="password"
            type="password"
            required
            className="w-full border border-stone-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-300"
          />
        </label>
        {state?.error && (
          <p className="text-rose-600 text-sm bg-rose-50 rounded-lg p-3">
            {state.error}
          </p>
        )}
        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-amber-500 hover:bg-amber-600 text-white rounded-full py-3 font-bold disabled:opacity-50"
        >
          {isPending ? "ログイン中..." : "ログイン"}
        </button>
      </form>
      <div className="mt-6 text-center text-sm text-stone-500 space-y-2">
        <p>
          アカウントをお持ちでない方は{" "}
          <Link href="/signup" className="text-amber-700 hover:underline">
            新規登録
          </Link>
        </p>
        <p className="bg-amber-50 rounded-lg p-3 text-xs">
          <strong>デモ用アカウント:</strong>
          <br />
          保護者: parent@example.com / password123
          <br />
          先生: sato@example.com / password123
        </p>
      </div>
    </div>
  );
}
