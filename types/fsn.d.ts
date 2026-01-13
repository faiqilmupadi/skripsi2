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
  rop: number;
  safety_stock: number;
  stok_saat_ini: number;
  satuan: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: number;
  nama: string;
  username: string;
  password: string;
  role: "admin_gudang" | "manajer_gudang";
}

export type FSNCategory = "fast" | "slow" | "non";

export interface ItemWithFSN extends Item {
  category: FSNCategory;
  color: string;
  totalMovement: number;
  turnoverRate: number;
}

export interface FSNDistribution {
  name: string;
  value: number;
  color: string;
}

export interface FSNTrend {
  date: string;
  fast: number;
  slow: number;
  non: number;
}

export interface FSNSummary {
  fastMoving: number;
  slowMoving: number;
  nonMoving: number;
  totalItems: number;
}

export type TimeFilter = "24H" | "7D" | "1M" | "3M" | "CUSTOM";