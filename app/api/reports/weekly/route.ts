// app/api/reports/weekly/route.ts
import { createConnection } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const db = await createConnection();

    // 1. Hitung Summary (Total Transaksi Minggu Ini)
    const [summaryRows]: any = await db.query(`
      SELECT 
        (SELECT COUNT(*) FROM stock_movements WHERE tanggal >= DATE_SUB(NOW(), INTERVAL 7 DAY)) as total_movements,
        (SELECT COALESCE(SUM(qty), 0) FROM stock_movements WHERE tipe = 'OUT' AND tanggal >= DATE_SUB(NOW(), INTERVAL 7 DAY)) as total_out,
        (SELECT COALESCE(SUM(jumlah), 0) FROM orders WHERE tanggal >= DATE_SUB(NOW(), INTERVAL 7 DAY)) as total_in,
        (SELECT COUNT(*) FROM items WHERE stok_saat_ini <= safety_stock) as critical_count
    `);

    // 2. User Paling Aktif
    const [userRows]: any = await db.query(`
      SELECT u.nama, u.role, COUNT(m.id) as total_activity
      FROM stock_movements m
      JOIN users u ON m.user_id = u.id
      WHERE m.tanggal >= DATE_SUB(NOW(), INTERVAL 7 DAY)
      GROUP BY m.user_id
      ORDER BY total_activity DESC
      LIMIT 5
    `);

    // 3. Barang Paling Sering Keluar (Top Movers)
    const [itemRows]: any = await db.query(`
      SELECT i.nama_barang, i.satuan, SUM(m.qty) as total_qty
      FROM stock_movements m
      JOIN items i ON m.item_id = i.id
      WHERE m.tipe = 'OUT' 
      AND m.tanggal >= DATE_SUB(NOW(), INTERVAL 7 DAY)
      GROUP BY m.item_id
      ORDER BY total_qty DESC
      LIMIT 5
    `);

    // 4. Barang Kritis
    const [criticalRows]: any = await db.query(`
      SELECT nama_barang, stok_saat_ini as sisa_stok,
      CASE 
        WHEN stok_saat_ini <= 0 THEN 'kritis'
        ELSE 'menipis'
      END as status
      FROM items
      WHERE stok_saat_ini <= safety_stock
      ORDER BY stok_saat_ini ASC
      LIMIT 10
    `);

    const data = {
      summary: {
        totalTransaksi: summaryRows[0]?.total_movements || 0,
        totalBarangKeluar: summaryRows[0]?.total_out || 0,
        totalBarangMasuk: summaryRows[0]?.total_in || 0,
        totalStokKritis: summaryRows[0]?.critical_count || 0,
      },
      topUsers: userRows,
      topMovingItems: itemRows,
      criticalItems: criticalRows,
    };

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Report Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}