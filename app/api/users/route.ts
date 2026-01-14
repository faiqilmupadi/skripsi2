import { getDb } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const db = getDb();
    // SESUAIKAN DB: Ambil kolom 'nama' bukan 'username'
    const [rows] = await db.query("SELECT id, nama, role FROM users ORDER BY nama ASC");
    return NextResponse.json(rows);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}