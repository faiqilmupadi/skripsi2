import { getDb } from "@/lib/db";
import { NextResponse } from "next/server";
import { PoolConnection } from "mysql2/promise";

export async function POST(request: Request) {
  let connection: PoolConnection | undefined;

  try {
    const body = await request.json();
    const { itemId, requesterName, amount } = body;

    if (!itemId || !amount || amount <= 0) {
      return NextResponse.json({ error: "Data tidak valid" }, { status: 400 });
    }

    const pool = getDb();
    connection = await pool.getConnection();

    await connection.beginTransaction();

    const [rows]: any = await connection.query(
      "SELECT stok_saat_ini FROM items WHERE id = ? FOR UPDATE",
      [itemId]
    );

    if (rows.length === 0) {
      await connection.rollback();
      return NextResponse.json({ error: "Barang tidak ditemukan" }, { status: 404 });
    }

    const currentStock = rows[0].stok_saat_ini;
    if (currentStock < amount) {
      await connection.rollback();
      return NextResponse.json({ error: "Stok tidak mencukupi!" }, { status: 400 });
    }

    await connection.query(
      "UPDATE items SET stok_saat_ini = stok_saat_ini - ? WHERE id = ?",
      [amount, itemId]
    );

    await connection.query(
      "INSERT INTO stock_movements (item_id, user_id, tipe, qty, tanggal, keterangan) VALUES (?, 1, 'OUT', ?, NOW(), ?)",
      [itemId, amount, `Checkout oleh: ${requesterName}`]
    );

    await connection.query(
      "INSERT INTO orders (nama, users_id, items_id, jumlah, tanggal) VALUES (?, 1, ?, ?, NOW())",
      [requesterName, itemId, amount]
    );

    await connection.commit();

    return NextResponse.json({ message: "Checkout berhasil dan tercatat di orders" });

  } catch (error: any) {
    if (connection) await connection.rollback();

    console.error("Checkout Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    if (connection) connection.release();
  }
}