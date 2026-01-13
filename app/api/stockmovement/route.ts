import { getDb } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const db = getDb();
    const sql = "SELECT * FROM stock_movements ORDER BY tanggal DESC"; 
    
    const [rows] = await db.query(sql);
    return NextResponse.json(rows);
    
  } catch (error: any) {
    console.log("Database Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}