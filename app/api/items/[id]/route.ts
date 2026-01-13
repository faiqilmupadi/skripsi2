import { getDb } from "@/lib/db";
import { NextResponse } from "next/server";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// ================= PUT (UPDATE) =================
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params; 
    const body = await request.json();
    const { nama_barang, stok_saat_ini, rop, safety_stock, satuan } = body;

    const db = getDb();
    const sql = `
      UPDATE items 
      SET nama_barang = ?, stok_saat_ini = ?, rop = ?, safety_stock = ?, satuan = ?, updated_at = NOW()
      WHERE id = ?
    `;

    await db.query(sql, [nama_barang, stok_saat_ini, rop, safety_stock, satuan, id]);

    return NextResponse.json({ message: "Data berhasil diupdate" });
  } catch (error: any) {
    console.error("Database Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ================= DELETE (HAPUS) =================
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params; 

    const db = getDb();
    const sql = "DELETE FROM items WHERE id = ?";

    await db.query(sql, [id]);

    return NextResponse.json({ message: "Data berhasil dihapus" });
  } catch (error: any) {
    console.error("Database Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}