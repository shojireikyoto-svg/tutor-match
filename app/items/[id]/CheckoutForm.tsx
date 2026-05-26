"use client";
import { useActionState, useState } from "react";
import { createMatchingAction } from "@/lib/actions";

const TIME_SLOTS = ["AM（9〜12時）", "PM前半（12〜15時）", "PM後半（15〜18時）"];
const BASE_FEE = 5000;
const DISTANCE_FEE = 500 * 8;
const TIMELAG_FEE = 1500;

interface Props {
  itemId: string;
  pickupDate: string;
  itemPrice: number;
}

export default function CheckoutForm({ itemId, pickupDate, itemPrice }: Props) {
  const [state, formAction, isPending] = useActionState(createMatchingAction, null);
  const [deliveryDate, setDeliveryDate] = useState("");

  const calcFee = () => {
    if (!deliveryDate) return null;
    const p = new Date(pickupDate);
    const d = new Date(deliveryDate);
    const diff = Math.round((d.getTime() - p.getTime()) / 86400000);
    if (diff < 0 || diff > 3) return null;
    return BASE_FEE + DISTANCE_FEE + (diff > 0 ? TIMELAG_FEE * diff : 0);
  };

  const deliveryFee = calcFee();

  return (
    <div className="bg-indigo-50 rounded-2xl p-5">
      <h2 className="font-bold text-indigo-900 mb-4">購入・配送手続き</h2>
      <form action={formAction} className="space-y-4">
        <input type="hidden" name="item_id" value={itemId} />

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            搬入希望日 <span className="text-red-500">*</span>
            <span className="text-xs text-slate-400 ml-2">（搬出日 {pickupDate} から3日以内）</span>
          </label>
          <input
            name="delivery_date"
            type="date"
            required
            value={deliveryDate}
            onChange={(e) => setDeliveryDate(e.target.value)}
            min={pickupDate}
            className="w-full border border-slate-300 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
          {deliveryDate && deliveryFee === null && (
            <p className="text-red-500 text-xs mt-1">搬出日から3日以内の日付を選択してください</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">搬入時間帯 <span className="text-red-500">*</span></label>
          <select name="delivery_time_slot" required className="w-full border border-slate-300 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white">
            <option value="">選択してください</option>
            {TIME_SLOTS.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">搬入先住所 <span className="text-red-500">*</span></label>
          <input name="delivery_address" required placeholder="例: 京都市北区xx町1-2-3" className="w-full border border-slate-300 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-300" />
        </div>

        {deliveryFee !== null && (
          <div className="bg-white rounded-xl p-4 text-sm space-y-1.5">
            <div className="flex justify-between text-slate-600">
              <span>商品代金</span>
              <span>{itemPrice === 0 ? "無料" : `¥${itemPrice.toLocaleString()}`}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>配送料（基本）</span><span>¥{BASE_FEE.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>距離加算（約8km）</span><span>¥{DISTANCE_FEE.toLocaleString()}</span>
            </div>
            {deliveryFee > BASE_FEE + DISTANCE_FEE && (
              <div className="flex justify-between text-slate-600">
                <span>一時保管料</span>
                <span>¥{(deliveryFee - BASE_FEE - DISTANCE_FEE).toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-indigo-900 pt-1 border-t border-slate-200">
              <span>お支払い合計</span>
              <span>¥{(itemPrice + deliveryFee).toLocaleString()}</span>
            </div>
          </div>
        )}

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-700">
          マッチング成立後のキャンセルは配送料の100%のキャンセル料が発生します。
        </div>

        {state?.error && (
          <p className="text-red-600 text-sm bg-red-50 rounded-xl p-3">{state.error}</p>
        )}

        <button
          type="submit"
          disabled={isPending || deliveryFee === null}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-3 font-bold disabled:opacity-50"
        >
          {isPending ? "処理中..." : "購入を確定する（Stripe決済）"}
        </button>
        <p className="text-xs text-slate-400 text-center">※ MVP版のため実際の決済は行われません</p>
      </form>
    </div>
  );
}
