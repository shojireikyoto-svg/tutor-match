"use client";
import { useActionState } from "react";
import { createItemAction } from "@/lib/actions";
import Link from "next/link";

const CATEGORIES = ["冷蔵庫", "洗濯機", "電子レンジ", "ベッド", "机・デスク", "ソファ", "テレビ", "その他"];
const TIME_SLOTS = ["AM（9〜12時）", "PM前半（12〜15時）", "PM後半（15〜18時）"];

export default function NewItemPage() {
  const [state, formAction, isPending] = useActionState(createItemAction, null);

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <Link href="/home" className="text-indigo-600 text-sm hover:underline">← ホームに戻る</Link>
      <h1 className="text-2xl font-bold text-indigo-900 mt-4">家具・家電を出品する</h1>
      <p className="text-sm text-slate-500 mt-1">後輩に譲渡したい家具・家電を登録してください</p>

      <form action={formAction} className="mt-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">商品名 <span className="text-red-500">*</span></label>
          <input name="title" required placeholder="例: 一人暮らし用冷蔵庫 120L" className="w-full border border-slate-300 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-300" />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">カテゴリ <span className="text-red-500">*</span></label>
          <select name="category" required className="w-full border border-slate-300 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white">
            <option value="">選択してください</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">価格（0円で無料譲渡）</label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-slate-400">¥</span>
            <input name="price" type="number" min="0" defaultValue="0" className="w-full border border-slate-300 rounded-xl pl-7 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-300" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">商品の説明</label>
          <textarea name="description" rows={3} placeholder="状態、サイズ、使用年数など" className="w-full border border-slate-300 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none" />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">画像URL（任意）</label>
          <input name="image_url" type="url" placeholder="https://..." className="w-full border border-slate-300 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-300" />
        </div>

        <div className="bg-indigo-50 rounded-2xl p-4 space-y-4">
          <h2 className="font-bold text-indigo-900 text-sm">搬出スケジュール</h2>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">搬出元住所 <span className="text-red-500">*</span></label>
            <input name="pickup_address" required placeholder="例: 京都市左京区xx町1-2-3" className="w-full border border-slate-300 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-300" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">搬出希望日 <span className="text-red-500">*</span></label>
              <input name="pickup_date" type="date" required className="w-full border border-slate-300 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-300" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">時間帯 <span className="text-red-500">*</span></label>
              <select name="pickup_time_slot" required className="w-full border border-slate-300 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white">
                <option value="">選択</option>
                {TIME_SLOTS.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
        </div>

        {state?.error && (
          <p className="text-red-600 text-sm bg-red-50 rounded-xl p-3">{state.error}</p>
        )}

        <button type="submit" disabled={isPending} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-3 font-bold disabled:opacity-50">
          {isPending ? "出品中..." : "出品する"}
        </button>
      </form>
    </div>
  );
}
