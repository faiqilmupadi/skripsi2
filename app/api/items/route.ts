import { createConnection } from "@/lib/db";
import { NextResponse } from "next/server";
import { enrichStockItems } from "@/services/realtimeService";
import { Item } from "@/types/stock";


// 1. GET: Ambil data dari Database
export async function GET() {
  try {
    const db = await createConnection();
    const sql = "SELECT * FROM items";
    const [rows] = await db.query(sql);
    const rawItems = rows as Item[];
    const processedItems = enrichStockItems(rawItems);

    return NextResponse.json(processedItems);
  } catch (error: any) {
    console.log("Database Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 2. POST: Tambah data ke Database (Dipanggil oleh createStockItem di lib/stock.ts)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nama_barang, stok_saat_ini, rop, safety_stock, satuan } = body;

    const db = await createConnection();
    const sql = `
      INSERT INTO items (nama_barang, stok_saat_ini, rop, safety_stock, satuan, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, NOW(), NOW())
    `;

    // Eksekusi Query
    await db.query(sql, [nama_barang, stok_saat_ini, rop, safety_stock, satuan]);

    return NextResponse.json({ message: "Berhasil tambah data" }, { status: 201 });
  } catch (error: any) {
    console.log("Database Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}