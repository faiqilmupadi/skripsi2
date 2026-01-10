import { createConnection } from "@/lib/db"; // Import koneksi
import { NextResponse } from "next/server";
import { enrichStockItems } from "@/services/realtimeService"; // Import logika bisnis
import { Item } from "@/types/realtime"; // Pastikan path type sesuai

export async function GET() {
  try {
    // 1. Konek ke Database
    const db = await createConnection();
    
    // 2. Ambil Data Mentah
    const sql = "SELECT * FROM items"; // Sesuaikan nama tabel
    const [rows] = await db.query(sql);

    // 3. Masukkan ke Logika Bisnis (enrichStockItems)
    // Kita casting 'rows' sebagai Item[] agar TypeScript tidak marah
    const rawItems = rows as Item[];
    const processedItems = enrichStockItems(rawItems); 

    // 4. Return data yang sudah ada status & warnanya ke Frontend
    return NextResponse.json(processedItems);
    
  } catch (error: any) {
    console.log("Database Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}