"use server";

import { getSql } from "./db";
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
  if (await findUserByEmail(email)) {
    return { error: "このメールアドレスは既に登録されています" };
  }

  const sql = getSql();
  const hash = await hashPassword(password);
  const rows = await sql`
    INSERT INTO users (name, email, password_hash, role)
    VALUES (${name}, ${email}, ${hash}, ${role})
    RETURNING id
  `;
  const userId = Number(rows[0].id);

  if (role === "parent") {
    await sql`
      INSERT INTO parent_profiles (user_id, child_grade, target_schools, note)
      VALUES (${userId}, '', '', '')
    `;
  } else {
    await sql`
      INSERT INTO tutor_profiles
        (user_id, headline, university, bio, subjects, areas, hourly_rate, experience_years, passed_schools, photo_url, published)
      VALUES
        (${userId}, '', '', '', '', '', 0, 0, '', '', 0)
    `;
  }

  await setSessionCookie({ id: userId, email, role, name });
  redirect(role === "parent" ? "/dashboard" : "/tutor/dashboard");
}

export async function loginAction(_prev: unknown, formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const u = await findUserByEmail(email);
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
  const sql = getSql();
  const tutorId = Number(formData.get("tutorId"));
  const message = String(formData.get("message") ?? "").trim();
  if (!tutorId || !message) return;
  await sql`
    INSERT INTO match_requests (parent_id, tutor_id, message)
    VALUES (${session.id}, ${tutorId}, ${message})
  `;
  revalidatePath("/dashboard");
  redirect("/dashboard?tab=matches");
}

export async function respondMatchAction(formData: FormData): Promise<void> {
  const session = await requireSession("tutor");
  const sql = getSql();
  const id = Number(formData.get("id"));
  const action = String(formData.get("action"));
  const status =
    action === "accept" ? "accepted" : action === "decline" ? "declined" : null;
  if (!id || !status) return;
  await sql`
    UPDATE match_requests SET status = ${status}
    WHERE id = ${id} AND tutor_id = ${session.id}
  `;
  revalidatePath("/tutor/dashboard");
}

export async function createReservationAction(formData: FormData): Promise<void> {
  const session = await requireSession("parent");
  const sql = getSql();
  const tutorId = Number(formData.get("tutorId"));
  const date = String(formData.get("date") ?? "");
  const time = String(formData.get("time") ?? "");
  const duration = Number(formData.get("duration") ?? 60);
  const note = String(formData.get("note") ?? "");
  if (!tutorId || !date || !time) return;
  const startsAt = `${date} ${time}:00`;
  await sql`
    INSERT INTO reservations (parent_id, tutor_id, starts_at, duration_min, note)
    VALUES (${session.id}, ${tutorId}, ${startsAt}, ${duration}, ${note})
  `;
  revalidatePath("/dashboard");
  redirect("/dashboard?tab=reservations");
}

export async function respondReservationAction(formData: FormData): Promise<void> {
  const session = await requireSession("tutor");
  const sql = getSql();
  const id = Number(formData.get("id"));
  const action = String(formData.get("action"));
  const map: Record<string, string> = {
    confirm: "confirmed",
    decline: "declined",
    complete: "completed",
  };
  const status = map[action];
  if (!id || !status) return;
  await sql`
    UPDATE reservations SET status = ${status}
    WHERE id = ${id} AND tutor_id = ${session.id}
  `;
  revalidatePath("/tutor/dashboard");
}

export async function cancelReservationAction(formData: FormData) {
  const session = await requireSession("parent");
  const sql = getSql();
  const id = Number(formData.get("id"));
  await sql`
    UPDATE reservations SET status = 'cancelled'
    WHERE id = ${id} AND parent_id = ${session.id}
  `;
  revalidatePath("/dashboard");
}

export async function updateTutorProfileAction(formData: FormData) {
  const session = await requireSession("tutor");
  const sql = getSql();
  const headline = String(formData.get("headline") ?? "");
  const university = String(formData.get("university") ?? "");
  const bio = String(formData.get("bio") ?? "");
  const subjects = String(formData.get("subjects") ?? "");
  const areas = String(formData.get("areas") ?? "");
  const hourly_rate = Number(formData.get("hourly_rate") ?? 0);
  const experience_years = Number(formData.get("experience_years") ?? 0);
  const passed_schools = String(formData.get("passed_schools") ?? "");
  const photo_url = String(formData.get("photo_url") ?? "");
  const published = formData.get("published") === "on" ? 1 : 0;

  await sql`
    UPDATE tutor_profiles
    SET headline = ${headline},
        university = ${university},
        bio = ${bio},
        subjects = ${subjects},
        areas = ${areas},
        hourly_rate = ${hourly_rate},
        experience_years = ${experience_years},
        passed_schools = ${passed_schools},
        photo_url = ${photo_url},
        published = ${published}
    WHERE user_id = ${session.id}
  `;
  revalidatePath("/tutor/dashboard");
  revalidatePath("/tutors");
}
