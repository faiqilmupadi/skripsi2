import { getDb } from "@/lib/db";
import { NextResponse } from "next/server";
import { PoolConnection } from "mysql2/promise";

export async function POST(request: Request) {
  let connection: PoolConnection | undefined;

  try {
    const body = await request.json();
    const { requestId, action, managerId } = body; 

    const pool = getDb();
    connection = await pool.getConnection();
    await connection.beginTransaction();

    // 1. Lock Row Request & Cek Validitas
    const [reqRows]: any = await connection.query(
      "SELECT * FROM transaction_requests WHERE id = ? FOR UPDATE", 
      [requestId]
    );

    if (reqRows.length === 0 || reqRows[0].status !== 'PENDING') {
      await connection.rollback();
      return NextResponse.json({ error: "Request tidak valid atau sudah diproses" }, { status: 400 });
    }
    const reqData = reqRows[0];

    // --- SKENARIO 1: REJECT ---
    if (action === 'REJECT') {
      await connection.query(
        "UPDATE transaction_requests SET status = 'REJECTED', updated_at = NOW() WHERE id = ?",
        [requestId]
      );
      await connection.commit();
      return NextResponse.json({ message: "Permintaan Ditolak" });
    }

    // --- SKENARIO 2: APPROVE ---
    if (action === 'APPROVE') {
      // a. Cek Stok Realtime di tabel items
      const [itemRows]: any = await connection.query(
        "SELECT stok_saat_ini FROM items WHERE id = ? FOR UPDATE",
        [reqData.item_id]
      );

      if (itemRows.length === 0) {
          await connection.rollback();
          return NextResponse.json({ error: "Barang tidak ditemukan" }, { status: 404 });
      }

      if (itemRows[0].stok_saat_ini < reqData.amount) {
        await connection.rollback();
        return NextResponse.json({ error: "Stok Gudang Habis! Tidak bisa ACC." }, { status: 400 });
      }

      // b. Kurangi Stok di tabel items (SESUAI PERMINTAAN)
      await connection.query(
        "UPDATE items SET stok_saat_ini = stok_saat_ini - ? WHERE id = ?",
        [reqData.amount, reqData.item_id]
      );

      // c. Catat History ke stock_movements (PENTING BUAT LAPORAN)
      await connection.query(
        `INSERT INTO stock_movements (item_id, user_id, tipe, qty, tanggal, keterangan) 
         VALUES (?, ?, 'OUT', ?, NOW(), ?)`,
        [reqData.item_id, managerId, reqData.amount, `ACC Checkout: ${reqData.requester_name}`]
      );
      
      // ❌ BAGIAN ERROR (Orders) SUDAH SAYA HAPUS DI SINI ❌
      // Tabel 'orders' tidak ada, jadi kita skip saja.

      // d. Update Status Request jadi APPROVED (SESUAI PERMINTAAN)
      await connection.query(
        "UPDATE transaction_requests SET status = 'APPROVED', updated_at = NOW() WHERE id = ?",
        [requestId]
      );

      await connection.commit();
      return NextResponse.json({ message: "Sukses! Disetujui & Stok Berkurang" });
    }

  } catch (error: any) {
    if (connection) await connection.rollback();
    console.error("Database Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    if (connection) connection.release();
  }
}