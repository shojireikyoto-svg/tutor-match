import "server-only";
import { getSql } from "./db";

export type Item = {
  id: string;
  seller_id: string;
  buyer_id: string | null;
  title: string;
  category: string;
  item_status: string;
  price: number;
  images: string[];
  description: string;
  pickup_address: string;
  pickup_date: string | null;
  pickup_time_slot: string | null;
  created_at: string;
  seller_name: string;
};

export type Matching = {
  id: string;
  item_id: string;
  pickup_date: string;
  pickup_time_slot: string;
  delivery_date: string;
  delivery_time_slot: string;
  pickup_address: string;
  delivery_address: string;
  delivery_fee: number;
  stripe_intent_id: string | null;
  driver_id: string | null;
  matching_status: string;
  created_at: string;
};

export async function listAvailableItems(category?: string): Promise<Item[]> {
  const sql = getSql();
  const rows = category
    ? await sql`
        SELECT i.*, u.name as seller_name
        FROM items i JOIN users u ON u.id = i.seller_id
        WHERE i.item_status = 'available' AND i.category = ${category}
        ORDER BY i.created_at DESC
      `
    : await sql`
        SELECT i.*, u.name as seller_name
        FROM items i JOIN users u ON u.id = i.seller_id
        WHERE i.item_status = 'available'
        ORDER BY i.created_at DESC
      `;
  return rows.map((r) => ({ ...r, images: r.images ?? [] })) as Item[];
}

export async function getItemById(id: string): Promise<Item | null> {
  const sql = getSql();
  const rows = await sql`
    SELECT i.*, u.name as seller_name
    FROM items i JOIN users u ON u.id = i.seller_id
    WHERE i.id = ${id}
  `;
  if (!rows[0]) return null;
  const r = rows[0];
  return { ...r, images: r.images ?? [] } as Item;
}

export async function getMyListings(sellerId: string): Promise<Item[]> {
  const sql = getSql();
  const rows = await sql`
    SELECT i.*, u.name as seller_name
    FROM items i JOIN users u ON u.id = i.seller_id
    WHERE i.seller_id = ${sellerId}
    ORDER BY i.created_at DESC
  `;
  return rows.map((r) => ({ ...r, images: r.images ?? [] })) as Item[];
}

export async function getMyPurchases(buyerId: string): Promise<(Item & { matching_id: string; matching_status: string; delivery_date: string; delivery_fee: number })[]> {
  const sql = getSql();
  const rows = await sql`
    SELECT i.*, u.name as seller_name,
      m.id as matching_id, m.delivery_date, m.delivery_time_slot,
      m.delivery_address, m.delivery_fee, m.matching_status
    FROM items i
    JOIN users u ON u.id = i.seller_id
    JOIN matchings m ON m.item_id = i.id
    WHERE i.buyer_id = ${buyerId}
    ORDER BY m.created_at DESC
  `;
  return rows.map((r) => ({ ...r, images: r.images ?? [] })) as (Item & { matching_id: string; matching_status: string; delivery_date: string; delivery_fee: number })[];
}

export async function getMatchingByItemId(itemId: string): Promise<Matching | null> {
  const sql = getSql();
  const rows = await sql`SELECT * FROM matchings WHERE item_id = ${itemId}`;
  return (rows[0] as Matching) ?? null;
}
