import { getDb } from "@/lib/db"; // Sesuaikan dengan koneksi DB Anda
import { NextResponse } from "next/server";

export async function GET() {
  const db = getDb();
  // Query dasar ambil semua item
  const [rows] = await db.query("SELECT * FROM items ORDER BY id DESC");
  return NextResponse.json(rows);
}
