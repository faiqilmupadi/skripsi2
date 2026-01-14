// C:\Faiq\skripsi\skripsi2\app\api\admin\checkout\route.ts
import { getDb } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { itemId, userId, requesterName, amount } = body;

    // Validasi Dasar
    if (!itemId || !amount || amount <= 0) {
      return NextResponse.json({ error: "Data tidak valid" }, { status: 400 });
    }

    const pool = getDb();
    
    // Cek ketersediaan stok (Opsional: Admin gabisa request kalau barang kosong)
    const [rows]: any = await pool.query("SELECT stok_saat_ini FROM items WHERE id = ?", [itemId]);
    if (rows.length === 0) return NextResponse.json({ error: "Barang tidak ditemukan" }, { status: 404 });
    if (rows[0].stok_saat_ini < amount) {
      return NextResponse.json({ error: "Stok gudang kurang, tidak bisa request." }, { status: 400 });
    }

    // Insert Request (Status otomatis PENDING)
    await pool.query(
      `INSERT INTO transaction_requests 
       (item_id, user_id, requester_name, type, amount, status, created_at, updated_at) 
       VALUES (?, ?, ?, 'CHECKOUT', ?, 'PENDING', NOW(), NOW())`,
      [itemId, userId, requesterName, amount]
    );

    return NextResponse.json({ message: "Request terkirim ke Manager" });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}