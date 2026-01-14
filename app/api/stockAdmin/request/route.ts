import { getDb } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Ambil supplier_id dari body juga
    const { item_id, user_id, requester_name, supplier_id, supplier_name, amount } = body;

    if (!item_id || !amount || !supplier_name || !user_id) {
        return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
    }

    const db = getDb();

    // UPDATE SQL QUERY: Tambahkan kolom supplier_id
    // supplier_id bisa NULL jika manual input (0), jadi kita handle dengan logika if/null
    const finalSupplierId = supplier_id === 0 ? null : supplier_id;

    await db.query(
      `INSERT INTO transaction_requests 
      (item_id, user_id, requester_name, supplier_id, supplier_name, amount, type, status, created_at) 
      VALUES (?, ?, ?, ?, ?, ?, 'RESTOCK', 'PENDING', NOW())`,
      [item_id, user_id, requester_name, finalSupplierId, supplier_name, amount]
    );

    return NextResponse.json({ message: "Order berhasil dibuat ke Supplier" });
  } catch (e: any) {
    console.error("Error restock request:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}