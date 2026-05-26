"use server";

import { getSql } from "./db";
import {
  clearSession,
  findUserByEmail,
  hashPassword,
  isUniversityEmail,
  requireSession,
  setSessionCookie,
  verifyPassword,
} from "./auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function signupAction(_prev: unknown, formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const name = String(formData.get("name") ?? "").trim();
  const phone_number = String(formData.get("phone_number") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !name || password.length < 6) {
    return { error: "入力内容を確認してください（パスワードは6文字以上）" };
  }
  if (!isUniversityEmail(email)) {
    return { error: "大学メールアドレス（*.ac.jp）でご登録ください" };
  }
  if (await findUserByEmail(email)) {
    return { error: "このメールアドレスは既に登録されています" };
  }

  const sql = getSql();
  const hash = await hashPassword(password);
  const rows = await sql`
    INSERT INTO users (name, email, password_hash, phone_number)
    VALUES (${name}, ${email}, ${hash}, ${phone_number})
    RETURNING id
  `;
  const userId = String(rows[0].id);
  await setSessionCookie({ id: userId, email, name });
  redirect("/home");
}

export async function loginAction(_prev: unknown, formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const u = await findUserByEmail(email);
  if (!u || !(await verifyPassword(password, u.password_hash))) {
    return { error: "メールアドレスまたはパスワードが正しくありません" };
  }
  await setSessionCookie({ id: u.id, email: u.email, name: u.name });
  redirect("/home");
}

export async function logoutAction() {
  await clearSession();
  redirect("/");
}

export async function createItemAction(_prev: unknown, formData: FormData) {
  const session = await requireSession();
  const sql = getSql();

  const title = String(formData.get("title") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const price = Number(formData.get("price") ?? 0);
  const description = String(formData.get("description") ?? "").trim();
  const pickup_address = String(formData.get("pickup_address") ?? "").trim();
  const pickup_date = String(formData.get("pickup_date") ?? "").trim();
  const pickup_time_slot = String(formData.get("pickup_time_slot") ?? "").trim();
  const image_url = String(formData.get("image_url") ?? "").trim();

  if (!title || !category || !pickup_address || !pickup_date || !pickup_time_slot) {
    return { error: "必須項目をすべて入力してください" };
  }

  const images = image_url ? JSON.stringify([image_url]) : JSON.stringify([]);

  await sql`
    INSERT INTO items (seller_id, title, category, price, description, pickup_address, pickup_date, pickup_time_slot, images)
    VALUES (${session.id}, ${title}, ${category}, ${price}, ${description}, ${pickup_address}, ${pickup_date}, ${pickup_time_slot}, ${images})
  `;

  revalidatePath("/items");
  revalidatePath("/dashboard");
  redirect("/dashboard");
}

const BASE_FEE = 5000;
const DISTANCE_FEE_PER_KM = 500;
const TIMELAG_FEE_PER_DAY = 1500;
const ASSUMED_KM = 8;

function calcDeliveryFee(pickupDate: string, deliveryDate: string): number {
  const p = new Date(pickupDate);
  const d = new Date(deliveryDate);
  const diffDays = Math.round((d.getTime() - p.getTime()) / 86400000);
  if (diffDays < 0 || diffDays > 3) return -1;
  return BASE_FEE + DISTANCE_FEE_PER_KM * ASSUMED_KM + (diffDays > 0 ? TIMELAG_FEE_PER_DAY * diffDays : 0);
}

export async function createMatchingAction(_prev: unknown, formData: FormData) {
  const session = await requireSession();
  const sql = getSql();

  const item_id = String(formData.get("item_id") ?? "");
  const delivery_date = String(formData.get("delivery_date") ?? "").trim();
  const delivery_time_slot = String(formData.get("delivery_time_slot") ?? "").trim();
  const delivery_address = String(formData.get("delivery_address") ?? "").trim();

  if (!item_id || !delivery_date || !delivery_time_slot || !delivery_address) {
    return { error: "必須項目をすべて入力してください" };
  }

  const itemRows = await sql`SELECT * FROM items WHERE id = ${item_id} AND item_status = 'available'`;
  const item = itemRows[0];
  if (!item) return { error: "商品が見つからないか、既にマッチング済みです" };
  if (item.seller_id === session.id) return { error: "自分の出品商品は購入できません" };

  const delivery_fee = calcDeliveryFee(String(item.pickup_date), delivery_date);
  if (delivery_fee < 0) {
    return { error: "搬入希望日は搬出日から3日以内で選択してください（倉庫レスルール）" };
  }

  await sql`
    INSERT INTO matchings (item_id, pickup_date, pickup_time_slot, delivery_date, delivery_time_slot, pickup_address, delivery_address, delivery_fee)
    VALUES (${item_id}, ${item.pickup_date}, ${item.pickup_time_slot}, ${delivery_date}, ${delivery_time_slot}, ${item.pickup_address}, ${delivery_address}, ${delivery_fee})
  `;

  await sql`
    UPDATE items SET item_status = 'matched', buyer_id = ${session.id}
    WHERE id = ${item_id}
  `;

  revalidatePath("/items");
  revalidatePath(`/items/${item_id}`);
  redirect("/dashboard?tab=purchases");
}

export async function updateItemStatusAction(formData: FormData) {
  const session = await requireSession();
  const sql = getSql();
  const item_id = String(formData.get("item_id") ?? "");
  const status = String(formData.get("status") ?? "");
  const valid = ["available", "matched", "picked_up", "delivered"];
  if (!valid.includes(status)) return;
  await sql`
    UPDATE items SET item_status = ${status}
    WHERE id = ${item_id} AND seller_id = ${session.id}
  `;
  revalidatePath("/dashboard");
}
