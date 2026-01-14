import { getDb } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const db = getDb();
    const sql = `
      SELECT tr.*, i.nama_barang, i.stok_saat_ini as stok_gudang_saat_ini, i.satuan
      FROM transaction_requests tr
      JOIN items i ON tr.item_id = i.id
      WHERE tr.status = 'PENDING'
      ORDER BY tr.created_at ASC
    `;
    
    const [rows] = await db.query(sql);
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error fetching requests:", error);
    return NextResponse.json([], { status: 500 });
  }
}