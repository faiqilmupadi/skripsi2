import { getDb } from "@/lib/db";
import { NextResponse } from "next/server";

// PENTING: Agar data selalu fresh saat di-refresh (mencegah cache)
export const dynamic = 'force-dynamic'; 

export async function GET() {
  try {
    const db = getDb();
    const sql = `
      SELECT * FROM stock_movements 
      WHERE tanggal >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
      ORDER BY tanggal DESC
    `; 
    
    const [rows] = await db.query(sql);
    return NextResponse.json(rows);
    
  } catch (error: any) {
    console.error("Database Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}