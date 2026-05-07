import { db } from "./db";

export interface TutorListItem {
  id: number;
  name: string;
  headline: string;
  university: string;
  subjects: string;
  areas: string;
  hourly_rate: number;
  experience_years: number;
  photo_url: string | null;
  passed_schools: string;
}

export interface TutorDetail extends TutorListItem {
  bio: string;
  passed_schools: string;
  email: string;
}

export function listTutors(filters?: {
  q?: string;
  subject?: string;
  area?: string;
  maxRate?: number;
}): TutorListItem[] {
  const where: string[] = ["t.published = 1"];
  const params: Record<string, unknown> = {};
  if (filters?.q) {
    where.push(
      "(u.name LIKE @q OR t.headline LIKE @q OR t.bio LIKE @q OR t.passed_schools LIKE @q)"
    );
    params.q = `%${filters.q}%`;
  }
  if (filters?.subject) {
    where.push("t.subjects LIKE @subject");
    params.subject = `%${filters.subject}%`;
  }
  if (filters?.area) {
    where.push("t.areas LIKE @area");
    params.area = `%${filters.area}%`;
  }
  if (filters?.maxRate) {
    where.push("t.hourly_rate <= @maxRate");
    params.maxRate = filters.maxRate;
  }
  const sql = `
    SELECT u.id, u.name, t.headline, t.university, t.subjects, t.areas,
           t.hourly_rate, t.experience_years, t.photo_url, t.passed_schools
    FROM tutor_profiles t
    JOIN users u ON u.id = t.user_id
    WHERE ${where.join(" AND ")}
    ORDER BY t.experience_years DESC, u.id ASC
  `;
  return db.prepare(sql).all(params) as TutorListItem[];
}

export function getTutorById(id: number): TutorDetail | undefined {
  return db
    .prepare(
      `SELECT u.id, u.name, u.email, t.headline, t.university, t.subjects, t.areas,
              t.hourly_rate, t.experience_years, t.photo_url, t.bio, t.passed_schools
       FROM tutor_profiles t
       JOIN users u ON u.id = t.user_id
       WHERE u.id = ? AND t.published = 1`
    )
    .get(id) as TutorDetail | undefined;
}

export function listMatchRequestsForParent(parentId: number) {
  return db
    .prepare(
      `SELECT m.*, u.name AS tutor_name
       FROM match_requests m JOIN users u ON u.id = m.tutor_id
       WHERE m.parent_id = ? ORDER BY m.created_at DESC`
    )
    .all(parentId) as Array<{
    id: number;
    parent_id: number;
    tutor_id: number;
    message: string;
    status: string;
    created_at: string;
    tutor_name: string;
  }>;
}

export function listMatchRequestsForTutor(tutorId: number) {
  return db
    .prepare(
      `SELECT m.*, u.name AS parent_name
       FROM match_requests m JOIN users u ON u.id = m.parent_id
       WHERE m.tutor_id = ? ORDER BY m.created_at DESC`
    )
    .all(tutorId) as Array<{
    id: number;
    parent_id: number;
    tutor_id: number;
    message: string;
    status: string;
    created_at: string;
    parent_name: string;
  }>;
}

export function listReservationsForParent(parentId: number) {
  return db
    .prepare(
      `SELECT r.*, u.name AS tutor_name
       FROM reservations r JOIN users u ON u.id = r.tutor_id
       WHERE r.parent_id = ? ORDER BY r.starts_at DESC`
    )
    .all(parentId) as Array<{
    id: number;
    parent_id: number;
    tutor_id: number;
    starts_at: string;
    duration_min: number;
    note: string;
    status: string;
    tutor_name: string;
  }>;
}

export function listReservationsForTutor(tutorId: number) {
  return db
    .prepare(
      `SELECT r.*, u.name AS parent_name
       FROM reservations r JOIN users u ON u.id = r.parent_id
       WHERE r.tutor_id = ? ORDER BY r.starts_at DESC`
    )
    .all(tutorId) as Array<{
    id: number;
    parent_id: number;
    tutor_id: number;
    starts_at: string;
    duration_min: number;
    note: string;
    status: string;
    parent_name: string;
  }>;
}
