export interface WeeklySummary {
  totalTransaksi: number;
  totalBarangKeluar: number;
  totalBarangMasuk: number; 
  totalStokKritis: number;
}

export interface TopUser {
  nama: string;
  total_activity: number; 
  role: string;
}

export interface TopItem {
  nama_barang: string;
  total_qty: number; 
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