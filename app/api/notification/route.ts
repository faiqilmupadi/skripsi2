// app/api/notification/route.ts
import { createConnection } from "@/lib/db";
import { NextResponse } from "next/server";

// GET: Ambil daftar ID barang yang sudah ada di tabel notification
export async function GET() {
  try {
    const db = await createConnection();
    // Kita ambil item_id nya saja untuk filter di frontend
    const [rows]: any = await db.query("SELECT item_id FROM notification WHERE sudah_di_pesan = 1");
    
    // Hasilnya array angka: [1, 5, 12]
    const notifiedItemIds = rows.map((row: any) => row.item_id);
    
    return NextResponse.json(notifiedItemIds);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Simpan data ke tabel notification saat tombol diklik
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { itemId, namaBarang } = body;

    if (!itemId || !namaBarang) {
        return NextResponse.json({ error: "Data kurang lengkap" }, { status: 400 });
    }

    const db = await createConnection();

    // Cek duplikasi dulu
    const [existing]: any = await db.query("SELECT id FROM notification WHERE item_id = ?", [itemId]);

    if (existing.length > 0) {
      // Update tanggal saja jika sudah ada
      await db.query("UPDATE notification SET created_at = NOW(), sudah_di_pesan = 1 WHERE item_id = ?", [itemId]);
    } else {
      // Insert baru sesuai request kolom kamu
      await db.query(
        "INSERT INTO notification (item_id, nama_barang, sudah_di_pesan) VALUES (?, ?, 1)", 
        [itemId, namaBarang]
      );
    }

    return NextResponse.json({ message: "Notifikasi berhasil disimpan" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}