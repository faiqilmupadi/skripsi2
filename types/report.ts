// types/report.ts
export interface WeeklySummary {
  totalTransaksi: number;
  totalBarangKeluar: number;
  totalBarangMasuk: number; // Dari restock orders
  totalStokKritis: number;
}

export interface TopUser {
  nama: string;
  total_activity: number; // Jumlah transaksi yang dilakukan
  role: string;
}

export interface TopItem {
  nama_barang: string;
  total_qty: number; // Total item yang bergerak (Out)
  satuan: string;
}

export interface CriticalItem {
  nama_barang: string;
  sisa_stok: number;
  status: "menipis" | "kritis";
}

export interface WeeklyReportData {
  summary: WeeklySummary;
  topUsers: TopUser[];
  topMovingItems: TopItem[];
  criticalItems: CriticalItem[];
}