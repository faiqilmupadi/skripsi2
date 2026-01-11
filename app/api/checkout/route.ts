// app/api/checkout/route.ts
import { createConnection } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { itemId, requesterName, amount } = body;

    // Validasi input
    if (!itemId || !amount || amount <= 0) {
      return NextResponse.json({ error: "Data tidak valid" }, { status: 400 });
    }

    const db = await createConnection();

    // 1. Cek Stok Dulu
    const [rows]: any = await db.query("SELECT stok_saat_ini FROM items WHERE id = ?", [itemId]);
    if (rows.length === 0) {
      return NextResponse.json({ error: "Barang tidak ditemukan" }, { status: 404 });
    }

    const currentStock = rows[0].stok_saat_ini;
    if (currentStock < amount) {
      return NextResponse.json({ error: "Stok tidak mencukupi!" }, { status: 400 });
    }

    // 2. Kurangi Stok
    await db.query("UPDATE items SET stok_saat_ini = stok_saat_ini - ? WHERE id = ?", [amount, itemId]);

    // 3. Catat Riwayat (Stock Movement) - Tipe OUT
    // Pastikan tabel stock_movements ada kolom 'keterangan' atau 'user_id' untuk requesterName
    await db.query(
      "INSERT INTO stock_movements (item_id, tipe, qty, tanggal, keterangan) VALUES (?, 'OUT', ?, NOW(), ?)",
      [itemId, amount, `Checkout oleh: ${requesterName}`]
    );

    return NextResponse.json({ message: "Checkout berhasil" });

  } catch (error: any) {
    console.error("Checkout Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}