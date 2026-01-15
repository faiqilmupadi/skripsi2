export interface StockMovement {
  id: number;
  item_id: number;
  user_id?: number;
  tipe: "IN" | "OUT";
  qty: number;
  tanggal: string;
  keterangan?: string;
}

export interface Item {
  id: number;
  nama_barang: string;
  stok_saat_ini: number;
  satuan: string;
  rop: number;
  safety_stock: number;
  created_at: string;
  updated_at?: string;
}

export type FSNCategory = "fast" | "slow" | "non";

export interface ItemWithFSN extends Item {
  category: FSNCategory;
  totalOutFreq: number;
  totalOutQty: number;
  lastOutDate: string | null;
  daysSinceLastOut: number;
  contribution: number; 
  [key: string]: any; 
}

// PERBAIKAN DI SINI (Ganti 'total' jadi 'totalItems')
export interface FSNSummary {
  fast: number;
  slow: number;
  non: number;
  totalItems: number; // <--- Ganti nama ini
  totalTransactions: number;
}

export interface FSNChartData {
  name: string;
  value: number;
  color: string;
  [key: string]: any; 
}

export type TimeFilter = "1M" | "3M" | "6M";