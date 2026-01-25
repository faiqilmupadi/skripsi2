import { getDb } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { requestId, action } = await req.json(); 
    const db = getDb();

    // 1. Jika DITOLAK
    if (action === "REJECT") {
      await db.query("UPDATE transaction_requests SET status = 'REJECTED' WHERE id = ?", [requestId]);
      return NextResponse.json({ message: "Permintaan ditolak" });
    }

    // 2. Jika DISETUJUI
    if (action === "APPROVE") {
      // A. Ambil data detail request
      const [reqData]: any = await db.query(
        "SELECT item_id, amount, user_id, requester_name FROM transaction_requests WHERE id = ?", 
        [requestId]
      );
      
      if (reqData.length === 0) {
        throw new Error("Data request tidak ditemukan di database");
      }
      
      const { item_id, amount, user_id, requester_name } = reqData[0];

      // Validasi data penting
      if (!item_id || !amount) {
        throw new Error("Data item_id atau amount invalid");
      }

      // B. Update Status Request
      await db.query(
        "UPDATE transaction_requests SET status = 'APPROVED', updated_at = NOW() WHERE id = ?", 
        [requestId]
      );

      // C. Update Stok Items
      await db.query(
        "UPDATE items SET stok_saat_ini = stok_saat_ini + ? WHERE id = ?", 
        [amount, item_id]
      );

      // D. Insert ke Stock Movements (History)
      const keterangan = `Restock Approved (Req by ${requester_name || 'Admin'})`;
      
      await db.query(
        `INSERT INTO stock_movements 
        (item_id, user_id, tipe, qty, tanggal, keterangan) 
        VALUES (?, ?, 'IN', ?, NOW(), ?)`, 
        [
          item_id, 
          user_id, 
          amount, 
          keterangan
        ]
      );

      return NextResponse.json({ message: "Stok berhasil ditambahkan & tercatat di history" });
    }

    return NextResponse.json({ message: "Aksi tidak dikenal" }, { status: 400 });

  } catch (e: any) {
    console.error("Error processing request:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}