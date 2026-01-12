// app/api/checkout/route.ts
import { createConnection } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  let db;
  try {
    const body = await request.json();
    const { itemId, requesterName, amount } = body;

    // Validasi input
    if (!itemId || !amount || amount <= 0) {
      return NextResponse.json({ error: "Data tidak valid" }, { status: 400 });
    }

    db = await createConnection();
    await db.beginTransaction(); // Mulai transaksi

    // 1. Cek Stok Dulu
    const [rows]: any = await db.query("SELECT stok_saat_ini FROM items WHERE id = ? FOR UPDATE", [itemId]);
    if (rows.length === 0) {
      await db.rollback();
      return NextResponse.json({ error: "Barang tidak ditemukan" }, { status: 404 });
    }

    const currentStock = rows[0].stok_saat_ini;
    if (currentStock < amount) {
      await db.rollback();
      return NextResponse.json({ error: "Stok tidak mencukupi!" }, { status: 400 });
    }

    // 2. Kurangi Stok Barang
    await db.query("UPDATE items SET stok_saat_ini = stok_saat_ini - ? WHERE id = ?", [amount, itemId]);

    // 3. Catat ke Table 'stock_movements' (Log Teknis Keluar Masuk)
    // User ID di-hardcode '1' (Admin) sesuai request sebelumnya
    await db.query(
      "INSERT INTO stock_movements (item_id, user_id, tipe, qty, tanggal, keterangan) VALUES (?, 1, 'OUT', ?, NOW(), ?)",
      [itemId, amount, `Checkout oleh: ${requesterName}`]
    );

    // 4. ✅ UPDATE BARU: Catat juga ke Table 'orders'
    // Sesuai permintaan: Masukkan data pengambilan ini sebagai order
    await db.query(
      "INSERT INTO orders (nama, users_id, items_id, jumlah, tanggal) VALUES (?, 1, ?, ?, NOW())",
      [requesterName, itemId, amount]
    );

    await db.commit(); // Simpan semua perubahan permanen
    return NextResponse.json({ message: "Checkout berhasil dan tercatat di orders" });

  } catch (error: any) {
    if (db) await db.rollback(); // Batalkan semua jika error
    console.error("Checkout Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}