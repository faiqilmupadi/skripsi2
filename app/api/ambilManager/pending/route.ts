// C:\Faiq\skripsi\skripsi2\app\api\manager\pending\route.ts
import { getDb } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const pool = getDb();
    // Join tabel request dengan items supaya manager tau nama barang & stok sisa
    const [rows] = await pool.query(`
      SELECT 
        tr.id, tr.item_id, tr.requester_name, tr.amount, tr.status, tr.created_at,
        i.nama_barang, 
        i.stok_saat_ini as stok_gudang
      FROM transaction_requests tr
      JOIN items i ON tr.item_id = i.id
      WHERE tr.type = 'CHECKOUT' AND tr.status = 'PENDING'
      ORDER BY tr.created_at DESC
    `);

    return NextResponse.json(rows);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}