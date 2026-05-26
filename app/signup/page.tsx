"use client";
import { useActionState } from "react";
import { signupAction } from "@/lib/actions";
import Link from "next/link";

export default function SignupPage() {
  const [state, formAction, isPending] = useActionState(signupAction, null);

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-indigo-900">会員登録</h1>
        <p className="text-sm text-slate-500 mt-1">大学メール（*.ac.jp）が必要です</p>
      </div>
      <form action={formAction} className="space-y-4">
        <Field label="お名前" name="name" placeholder="京都 太郎" required />
        <Field label="大学メールアドレス" name="email" type="email" placeholder="you@kyoto-u.ac.jp" required />
        <Field label="電話番号（配送連絡用）" name="phone_number" type="tel" placeholder="090-1234-5678" />
        <Field label="パスワード" name="password" type="password" placeholder="6文字以上" required minLength={6} />
        {state?.error && (
          <p className="text-red-600 text-sm bg-red-50 rounded-lg p-3">{state.error}</p>
        )}
        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-3 font-bold disabled:opacity-50"
        >
          {isPending ? "登録中..." : "登録する"}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-500">
        すでに会員の方は{" "}
        <Link href="/login" className="text-indigo-600 hover:underline">ログイン</Link>
      </p>
    </div>
  );
}

function Field({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-slate-700 mb-1">{label}</span>
      <input {...props} className="w-full border border-slate-300 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-300" />
    </label>
  );
}
