// C:\Faiq\skripsi\skripsi2\types\report.ts

export interface ReportSummary {
  totalTransaksi: number;
  totalBarangKeluar: number;
  totalBarangMasuk: number;
  totalStokKritis: number;
}

export interface TopMovingItem {
  nama_barang: string;
  total_qty: number;
  satuan: string;
  frekuensi: number;
}

export interface TopUserActivity {
  nama: string;
  role: string;
  total_activity: number;
  count_in: number;  // Baru: Jumlah melakukan Restock
  count_out: number; // Baru: Jumlah melakukan Checkout
}

export interface CriticalItem {
  nama_barang: string;
  sisa_stok: number;
  min_stok: number;
  status: "kritis" | "menipis";
}

// Baru: Tipe untuk Log Detil di CSV
export interface TransactionLog {
  tanggal: string;
  tipe: "IN" | "OUT";
  qty: number;
  nama_barang: string;
  user_name: string;
  user_role: string;
  keterangan?: string;
}

export interface ReportData {
  periode: {
    start: string;
    end: string;
    filter: string;
  };
  summary: ReportSummary;
  topMovingItems: TopMovingItem[];
  topUsers: TopUserActivity[];
  criticalItems: CriticalItem[];
  detailedLogs: TransactionLog[]; // Data mentah untuk CSV
}

export type ReportFilterType = "1D" | "7D" | "30D";