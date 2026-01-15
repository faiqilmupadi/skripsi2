import { getDb } from "@/lib/db";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic'; 

export async function GET() {
  try {
    const db = getDb();

    // UPDATE SQL: Tambahkan kolom 'u.role' untuk pengecekan
    const sql = `
      SELECT 
        sm.tipe, 
        sm.tanggal,
        sm.keterangan, 
        u.nama as db_user_name,
        u.role as user_role
      FROM stock_movements sm
      LEFT JOIN users u ON sm.user_id = u.id
      ORDER BY sm.tanggal DESC 
      LIMIT 100
    `;
    
    const [rows] = await db.query(sql);
    
    if (!Array.isArray(rows)) {
        return NextResponse.json([]);
    }

    const userStats: Record<string, { name: string, supply: number, ambil: number }> = {};

    (rows as any[]).forEach((row) => {
      const desc = row.keterangan || "";
      let realActor = row.db_user_name || "Manager Gudang";
      
      // Default Status: Apakah data ini harus disembunyikan?
      // Jika role-nya admin_gudang, kita tandai TRUE (sembunyikan) dulu.
      // Nanti kalau ternyata ini punya 'Bagas', kita ubah jadi FALSE (tampilkan).
      let shouldHide = (row.user_role === 'manager_gudang');

      // --- LOGIKA DETEKSI PELAKU ---

      // 1. Cek "ACC Checkout:" (Prioritas Tertinggi)
      if (desc.includes("ACC Checkout:")) {
          const parts = desc.split("ACC Checkout:");
          if (parts[1]) {
             realActor = parts[1].trim();
             shouldHide = false; // TAMPILKAN! Karena ini punya orang lain (Bagas)
          }
      }
      // 2. Cek "Req by"
      else if (desc.includes("Req by")) {
          const parts = desc.split("Req by");
          if (parts[1]) {
             realActor = parts[1].replace(")", "").trim();
             shouldHide = false; // TAMPILKAN! Ini request spesifik orang
          }
      }
      // 3. Cek "Checkout oleh:" (Email)
      else if (desc.includes("Checkout oleh:")) {
          const parts = desc.split("Checkout oleh:");
          if (parts[1]) {
             realActor = parts[1].trim().split("@")[0];
             shouldHide = false; // TAMPILKAN!
          }
      }
      
      // Jika setelah cek semua kondisi di atas 'shouldHide' masih TRUE,
      // Berarti ini murni aktivitas Admin (misal: Restock stok gudang, atau testing).
      // Kita SKIP (return) agar tidak masuk grafik.
      if (shouldHide) {
          return; 
      }

      // --- CLEANING NAMA ---
      realActor = realActor
        .toLowerCase()
        .split(' ')
        .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      // --- RECORD DATA ---
      if (!userStats[realActor]) {
        userStats[realActor] = { name: realActor, supply: 0, ambil: 0 };
      }

      if (row.tipe === "IN") {
        userStats[realActor].supply += 1;
      } else if (row.tipe === "OUT") {
        userStats[realActor].ambil += 1;
      }
    });

    const chartData = Object.values(userStats);
    
    return NextResponse.json(chartData);

  } catch (error: any) {
    console.error("Database Error:", error);
    return NextResponse.json([]); 
  }
}