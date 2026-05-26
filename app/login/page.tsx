"use client";
import { useActionState } from "react";
import { loginAction } from "@/lib/actions";
import Link from "next/link";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, null);

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-indigo-900">ログイン</h1>
        <p className="text-sm text-slate-500 mt-1">Uni-Relay へようこそ</p>
      </div>
      <form action={formAction} className="space-y-4">
        <label className="block">
          <span className="block text-sm font-medium text-slate-700 mb-1">
            メールアドレス
          </span>
          <input
            name="email"
            type="email"
            required
            placeholder="you@kyoto-u.ac.jp"
            className="w-full border border-slate-300 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
        </label>
        <label className="block">
          <span className="block text-sm font-medium text-slate-700 mb-1">
            パスワード
          </span>
          <input
            name="password"
            type="password"
            required
            placeholder="パスワードを入力"
            className="w-full border border-slate-300 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
        </label>
        {state?.error && (
          <p className="text-red-600 text-sm bg-red-50 rounded-lg p-3">
            {state.error}
          </p>
        )}
        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-3 font-bold disabled:opacity-50"
        >
          {isPending ? "ログイン中..." : "ログイン"}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-500">
        アカウントをお持ちでない方は{" "}
        <Link href="/signup" className="text-indigo-600 hover:underline">
          新規登録
        </Link>
      </p>
    </div>
  );
}
