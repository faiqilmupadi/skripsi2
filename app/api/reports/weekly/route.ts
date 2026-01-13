import { getDb } from "@/lib/db";
import { NextResponse } from "next/server";

// GET: Ambil laporan pergerakan stok 7 hari terakhir
export async function GET() {
  try {
    const db = getDb();
    
    // Query: Ambil data stok masuk/keluar dalam 7 hari terakhir
    const sql = `
      SELECT 
        DATE(tanggal) as date,
        tipe,
        SUM(qty) as total_qty
      FROM stock_movements
      WHERE tanggal >= DATE_SUB(NOW(), INTERVAL 7 DAY)
      GROUP BY DATE(tanggal), tipe
      ORDER BY date ASC
    `;

    const [rows] = await db.query(sql);
    
    return NextResponse.json(rows);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}