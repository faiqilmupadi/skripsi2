import { getDb } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const db = getDb();
    // Penting: SELECT id juga
    const [rows] = await db.query("SELECT id, nama_supplier FROM suppliers ORDER BY nama_supplier ASC");
    return NextResponse.json(rows);
  } catch (error: any) {
    return NextResponse.json([], { status: 500 });
  }
}