import { getSql } from './db';

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

export async function listTutors(filters?: {
  q?: string;
  subject?: string;
  area?: string;
  maxRate?: number;
}): Promise<TutorListItem[]> {
  const sql = getSql();
  const conditions: string[] = ['t.published = 1'];
  const params: unknown[] = [];
  let idx = 1;

  if (filters?.q) {
    conditions.push(`(u.name ILIKE $${idx} OR t.headline ILIKE $${idx} OR t.bio ILIKE $${idx} OR t.passed_schools ILIKE $${idx})`);
    params.push(`%${filters.q}%`);
    idx++;
  }
  if (filters?.subject) {
    conditions.push(`t.subjects ILIKE $${idx}`);
    params.push(`%${filters.subject}%`);
    idx++;
  }
  if (filters?.area) {
    conditions.push(`t.areas ILIKE $${idx}`);
    params.push(`%${filters.area}%`);
    idx++;
  }
  if (filters?.maxRate) {
    conditions.push(`t.hourly_rate <= $${idx}`);
    params.push(filters.maxRate);
    idx++;
  }

  const query = `
    SELECT u.id, u.name, t.headline, t.university, t.subjects, t.areas,
           t.hourly_rate, t.experience_years, t.photo_url, t.passed_schools
    FROM tutor_profiles t
    JOIN users u ON u.id = t.user_id
    WHERE ${conditions.join(' AND ')}
    ORDER BY t.experience_years DESC, u.id ASC
  `;
  const rows = await sql(query, params);
  return rows as TutorListItem[];
}

export async function getTutorById(id: number): Promise<TutorDetail | undefined> {
  const sql = getSql();
  const rows = await sql`
    SELECT u.id, u.name, u.email, t.headline, t.university, t.subjects, t.areas,
           t.hourly_rate, t.experience_years, t.photo_url, t.bio, t.passed_schools
    FROM tutor_profiles t
    JOIN users u ON u.id = t.user_id
    WHERE u.id = ${id} AND t.published = 1
  `;
  return rows[0] as TutorDetail | undefined;
}

export async function listMatchRequestsForParent(parentId: number) {
  const sql = getSql();
  const rows = await sql`
    SELECT m.*, u.name AS tutor_name
    FROM match_requests m JOIN users u ON u.id = m.tutor_id
    WHERE m.parent_id = ${parentId} ORDER BY m.created_at DESC
  `;
  return rows as Array<{
    id: number;
    parent_id: number;
    tutor_id: number;
    message: string;
    status: string;
    created_at: string;
    tutor_name: string;
  }>;
}

export async function listMatchRequestsForTutor(tutorId: number) {
  const sql = getSql();
  const rows = await sql`
    SELECT m.*, u.name AS parent_name
    FROM match_requests m JOIN users u ON u.id = m.parent_id
    WHERE m.tutor_id = ${tutorId} ORDER BY m.created_at DESC
  `;
  return rows as Array<{
    id: number;
    parent_id: number;
    tutor_id: number;
    message: string;
    status: string;
    created_at: string;
    parent_name: string;
  }>;
}

export async function listReservationsForParent(parentId: number) {
  const sql = getSql();
  const rows = await sql`
    SELECT r.*, u.name AS tutor_name
    FROM reservations r JOIN users u ON u.id = r.tutor_id
    WHERE r.parent_id = ${parentId} ORDER BY r.starts_at DESC
  `;
  return rows as Array<{
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

export async function listReservationsForTutor(tutorId: number) {
  const sql = getSql();
  const rows = await sql`
    SELECT r.*, u.name AS parent_name
    FROM reservations r JOIN users u ON u.id = r.parent_id
    WHERE r.tutor_id = ${tutorId} ORDER BY r.starts_at DESC
  `;
  return rows as Array<{
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
