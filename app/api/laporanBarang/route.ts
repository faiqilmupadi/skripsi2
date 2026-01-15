// C:\Faiq\skripsi\skripsi2\app\api\laporan\route.ts

import { getDb } from "@/lib/db";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const filterType = searchParams.get("filter") || "7D";

    const db = getDb();
    
    // Tentukan Interval Waktu
    let intervalSQL = "INTERVAL 7 DAY";
    if (filterType === "1D") intervalSQL = "INTERVAL 1 DAY";
    if (filterType === "30D") intervalSQL = "INTERVAL 30 DAY";

    // 1. SUMMARY
    const [summaryRows] = await db.query(`
      SELECT 
        COUNT(*) as total_transaksi,
        COALESCE(SUM(CASE WHEN tipe = 'OUT' THEN qty ELSE 0 END), 0) as total_keluar,
        COALESCE(SUM(CASE WHEN tipe = 'IN' THEN qty ELSE 0 END), 0) as total_masuk
      FROM stock_movements 
      WHERE tanggal >= DATE_SUB(NOW(), ${intervalSQL})
    `);
    const summary = (summaryRows as any[])[0];

    // 2. TOP USER ACTIVITY (Dipecah IN & OUT)
    // Kita hitung berapa kali dia input IN dan berapa kali OUT
    const [topUserRows] = await db.query(`
      SELECT 
        u.nama, 
        u.role,
        COUNT(sm.id) as total_activity,
        SUM(CASE WHEN sm.tipe = 'IN' THEN 1 ELSE 0 END) as count_in,
        SUM(CASE WHEN sm.tipe = 'OUT' THEN 1 ELSE 0 END) as count_out
      FROM stock_movements sm
      LEFT JOIN users u ON sm.user_id = u.id
      WHERE sm.tanggal >= DATE_SUB(NOW(), ${intervalSQL})
      GROUP BY sm.user_id
      ORDER BY total_activity DESC
      LIMIT 10
    `);

    // 3. LOG DETIL TRANSAKSI (Untuk CSV)
    // Ambil semua data lengkap dalam periode tersebut
    const [logRows] = await db.query(`
      SELECT 
        sm.tanggal, sm.tipe, sm.qty, sm.keterangan,
        i.nama_barang,
        u.nama as user_name, u.role as user_role
      FROM stock_movements sm
      JOIN items i ON sm.item_id = i.id
      LEFT JOIN users u ON sm.user_id = u.id
      WHERE sm.tanggal >= DATE_SUB(NOW(), ${intervalSQL})
      ORDER BY sm.tanggal DESC
    `);

    // 4. TOP ITEMS & KRITIS (Tetap sama)
    const [criticalRows] = await db.query(`SELECT COUNT(*) as total_kritis FROM items WHERE stok_saat_ini <= rop`);
    const totalKritis = (criticalRows as any[])[0].total_kritis;

    const [topItemsRows] = await db.query(`
      SELECT i.nama_barang, i.satuan, SUM(sm.qty) as total_qty, COUNT(sm.id) as frekuensi
      FROM stock_movements sm JOIN items i ON sm.item_id = i.id
      WHERE sm.tipe = 'OUT' AND sm.tanggal >= DATE_SUB(NOW(), ${intervalSQL})
      GROUP BY sm.item_id ORDER BY total_qty DESC LIMIT 5
    `);

    const [criticalList] = await db.query(`
      SELECT nama_barang, stok_saat_ini as sisa_stok, rop as min_stok,
      CASE WHEN stok_saat_ini <= safety_stock THEN 'kritis' ELSE 'menipis' END as status
      FROM items WHERE stok_saat_ini <= rop ORDER BY stok_saat_ini ASC LIMIT 10
    `);

    const responseData = {
      periode: { filter: filterType, start: "", end: "" }, // Placeholder
      summary: {
        totalTransaksi: summary.total_transaksi,
        totalBarangKeluar: Number(summary.total_keluar),
        totalBarangMasuk: Number(summary.total_masuk),
        totalStokKritis: totalKritis
      },
      topMovingItems: topItemsRows,
      topUsers: topUserRows,
      criticalItems: criticalList,
      detailedLogs: logRows // <--- DATA PENTING UNTUK CSV
    };

    return NextResponse.json(responseData);

  } catch (error: any) {
    console.error("Report API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}