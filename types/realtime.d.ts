export interface Item {
  id: number;
  nama_barang: string;
  rop: number;
  safety_stock: number;
  stok_saat_ini: number;
  satuan: string;
  created_at: string;
  updated_at: string;
}

export type StockStatus = "aman" | "menipis" | "kritis";

export interface ItemWithStatus extends Item {
  status: StockStatus;
  color: string;
}

// UPDATE DI SINI: Tambahkan [key: string]: any
export interface StockDistribution {
  name: string;
  value: number;
  color: string;
  [key: string]: any; // <--- INI PENTING UNTUK RECHARTS
}

export interface StockTrend {
  date: string;
  aman: number;
  menipis: number;
  kritis: number;
}

export interface StockSummary {
  stokAman: number;
  stokMenipis: number;
  stokKritis: number;
  totalStok: number;
}

export type TimeFilter = "24H" | "7D" | "1M" | "3M" | "CUSTOM";