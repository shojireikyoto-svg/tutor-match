"use server";

import { db } from "./db";
import {
  clearSession,
  findUserByEmail,
  hashPassword,
  requireSession,
  setSessionCookie,
  verifyPassword,
} from "./auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function signupAction(_prev: unknown, formData: FormData) {
  const role = String(formData.get("role")) as "parent" | "tutor";
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const name = String(formData.get("name") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !name || password.length < 6 || !["parent", "tutor"].includes(role)) {
    return { error: "入力内容を確認してください（パスワードは6文字以上）" };
  }
  if (findUserByEmail(email)) {
    return { error: "このメールアドレスは既に登録されています" };
  }

  const hash = await hashPassword(password);
  const r = db
    .prepare(
      "INSERT INTO users (email, password_hash, role, name) VALUES (?, ?, ?, ?)"
    )
    .run(email, hash, role, name);
  const userId = Number(r.lastInsertRowid);

  if (role === "parent") {
    db.prepare(
      "INSERT INTO parent_profiles (user_id, child_grade, target_school, area, note) VALUES (?, '', '', '', '')"
    ).run(userId);
  } else {
    db.prepare(
      `INSERT INTO tutor_profiles
       (user_id, headline, university, bio, subjects, areas, hourly_rate, experience_years, passed_schools, photo_url, published)
       VALUES (?, '', '', '', '', '', 0, 0, '', '', 0)`
    ).run(userId);
  }

  await setSessionCookie({ id: userId, email, role, name });
  redirect(role === "parent" ? "/dashboard" : "/tutor/dashboard");
}

export async function loginAction(_prev: unknown, formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const u = findUserByEmail(email);
  if (!u || !(await verifyPassword(password, u.password_hash))) {
    return { error: "メールアドレスまたはパスワードが正しくありません" };
  }
  await setSessionCookie({ id: u.id, email: u.email, role: u.role, name: u.name });
  redirect(u.role === "parent" ? "/dashboard" : "/tutor/dashboard");
}

export async function logoutAction() {
  await clearSession();
  redirect("/");
}

export async function createMatchRequestAction(formData: FormData): Promise<void> {
  const session = await requireSession("parent");
  const tutorId = Number(formData.get("tutorId"));
  const message = String(formData.get("message") ?? "").trim();
  if (!tutorId || !message) return;
  db.prepare(
    "INSERT INTO match_requests (parent_id, tutor_id, message) VALUES (?, ?, ?)"
  ).run(session.id, tutorId, message);
  revalidatePath("/dashboard");
  redirect("/dashboard?tab=matches");
}

export async function respondMatchAction(formData: FormData): Promise<void> {
  const session = await requireSession("tutor");
  const id = Number(formData.get("id"));
  const action = String(formData.get("action"));
  const status =
    action === "accept" ? "accepted" : action === "decline" ? "declined" : null;
  if (!id || !status) return;
  db.prepare(
    "UPDATE match_requests SET status = ? WHERE id = ? AND tutor_id = ?"
  ).run(status, id, session.id);
  revalidatePath("/tutor/dashboard");
}

export async function createReservationAction(formData: FormData): Promise<void> {
  const session = await requireSession("parent");
  const tutorId = Number(formData.get("tutorId"));
  const date = String(formData.get("date") ?? "");
  const time = String(formData.get("time") ?? "");
  const duration = Number(formData.get("duration") ?? 60);
  const note = String(formData.get("note") ?? "");
  if (!tutorId || !date || !time) return;
  const startsAt = `${date} ${time}:00`;
  db.prepare(
    `INSERT INTO reservations (parent_id, tutor_id, starts_at, duration_min, note)
     VALUES (?, ?, ?, ?, ?)`
  ).run(session.id, tutorId, startsAt, duration, note);
  revalidatePath("/dashboard");
  redirect("/dashboard?tab=reservations");
}

export async function respondReservationAction(formData: FormData): Promise<void> {
  const session = await requireSession("tutor");
  const id = Number(formData.get("id"));
  const action = String(formData.get("action"));
  const map: Record<string, string> = {
    confirm: "confirmed",
    decline: "declined",
    complete: "completed",
  };
  const status = map[action];
  if (!id || !status) return;
  db.prepare(
    "UPDATE reservations SET status = ? WHERE id = ? AND tutor_id = ?"
  ).run(status, id, session.id);
  revalidatePath("/tutor/dashboard");
}

export async function cancelReservationAction(formData: FormData) {
  const session = await requireSession("parent");
  const id = Number(formData.get("id"));
  db.prepare(
    "UPDATE reservations SET status = 'cancelled' WHERE id = ? AND parent_id = ?"
  ).run(id, session.id);
  revalidatePath("/dashboard");
}

export async function updateTutorProfileAction(formData: FormData) {
  const session = await requireSession("tutor");
  const data = {
    headline: String(formData.get("headline") ?? ""),
    university: String(formData.get("university") ?? ""),
    bio: String(formData.get("bio") ?? ""),
    subjects: String(formData.get("subjects") ?? ""),
    areas: String(formData.get("areas") ?? ""),
    hourly_rate: Number(formData.get("hourly_rate") ?? 0),
    experience_years: Number(formData.get("experience_years") ?? 0),
    passed_schools: String(formData.get("passed_schools") ?? ""),
    photo_url: String(formData.get("photo_url") ?? ""),
    published: formData.get("published") === "on" ? 1 : 0,
    user_id: session.id,
  };
  db.prepare(
    `UPDATE tutor_profiles
     SET headline=@headline, university=@university, bio=@bio,
         subjects=@subjects, areas=@areas, hourly_rate=@hourly_rate,
         experience_years=@experience_years, passed_schools=@passed_schools,
         photo_url=@photo_url, published=@published
     WHERE user_id=@user_id`
  ).run(data);
  revalidatePath("/tutor/dashboard");
  revalidatePath("/tutors");
}
