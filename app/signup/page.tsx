"use client";
import { useActionState, useState } from "react";
import { signupAction } from "@/lib/actions";
import Link from "next/link";

export default function SignupPage() {
  const [role, setRole] = useState<"parent" | "tutor">("parent");
  const [state, formAction, isPending] = useActionState(signupAction, null);

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-amber-900 text-center">
        無料会員登録
      </h1>
      <p className="text-center text-sm text-stone-500 mt-1">
        30秒で登録完了。費用は一切かかりません。
      </p>

      <div className="mt-6 grid grid-cols-2 gap-2 bg-amber-100/50 rounded-full p-1">
        <button
          type="button"
          onClick={() => setRole("parent")}
          className={`rounded-full py-2 text-sm font-medium ${
            role === "parent"
              ? "bg-white text-amber-700 shadow"
              : "text-stone-600"
          }`}
        >
          保護者として
        </button>
        <button
          type="button"
          onClick={() => setRole("tutor")}
          className={`rounded-full py-2 text-sm font-medium ${
            role === "tutor"
              ? "bg-white text-amber-700 shadow"
              : "text-stone-600"
          }`}
        >
          先生として
        </button>
      </div>

      <form action={formAction} className="mt-6 space-y-4">
        <input type="hidden" name="role" value={role} />
        <Field label="お名前" name="name" placeholder="山田 花子" required />
        <Field
          label="メールアドレス"
          name="email"
          type="email"
          placeholder="you@example.com"
          required
        />
        <Field
          label="パスワード"
          name="password"
          type="password"
          placeholder="6文字以上"
          required
          minLength={6}
        />
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
          {isPending ? "登録中..." : "登録する"}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-stone-500">
        すでに会員の方は{" "}
        <Link href="/login" className="text-amber-700 hover:underline">
          ログイン
        </Link>
      </p>
    </div>
  );
}

function Field({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-stone-700 mb-1">
        {label}
      </span>
      <input
        {...props}
        className="w-full border border-stone-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-300"
      />
    </label>
  );
}
