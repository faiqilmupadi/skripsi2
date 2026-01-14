import { getDb } from "@/lib/db";
import { NextResponse } from "next/server";
// Pastikan path import ini sesuai dengan struktur folder kamu
import { enrichStockItems } from "@/services/realtimeService"; 
import { Item } from "@/types/realtime"; 

// 1. GET: Ambil SEMUA data items
export async function GET() {
  try {
    const db = getDb();
    const sql = "SELECT * FROM items";
    const [rows] = await db.query(sql);
    const rawItems = rows as Item[];
    const processedItems = enrichStockItems(rawItems);

    return NextResponse.json(processedItems);
  } catch (error: any) {
    console.error("Database Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nama_barang, stok_saat_ini, rop, safety_stock, satuan } = body;

    const db = getDb();
    const sql = `
      INSERT INTO items (nama_barang, stok_saat_ini, rop, safety_stock, satuan, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, NOW(), NOW())
    `;

    await db.query(sql, [nama_barang, stok_saat_ini, rop, safety_stock, satuan]);

    return NextResponse.json({ message: "Berhasil tambah data" }, { status: 201 });
  } catch (error: any) {
    console.error("Database Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}