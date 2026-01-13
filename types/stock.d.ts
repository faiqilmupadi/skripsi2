export type StockStatus = "aman" | "menipis" | "kritis";
export type TimeFilter = "24H" | "7D" | "1M" | "3M" | "CUSTOM";
export type FSNCategory = "fast" | "slow" | "non";

export interface Item {
  id: number;
  nama_barang: string;
  rop: number;
  stok_saat_ini: number;
  safety_stock: number;
  satuan: string;
  created_at: string;
  updated_at: string;
}

export interface ItemWithStatus extends Item {
  status: StockStatus;
  color: string;
}

export interface ItemWithFSN extends Item {
  category: FSNCategory;
  color: string;
  totalMovement: number;
  turnoverRate: number;
}

export interface ItemComplete extends Item {
  status: StockStatus;
  statusColor: string;
  category: FSNCategory;
  categoryColor: string;
  totalMovement: number;
  turnoverRate: number;
}

export interface StockMovement {
  id: number;
  item_id: number;
  user_id?: number;
  tipe: "IN" | "OUT";
  qty: number;
  tanggal: string;
  keterangan?: string;
}

export interface StockDistribution {
  name: string;
  value: number;
  color: string;
}

export interface StockSummary {
  stokAman: number;
  stokMenipis: number;
  stokKritis: number;
  totalStok: number;
}

export interface StockTrend {
  date: string;
  aman: number;
  menipis: number;
  kritis: number;
}

export interface Notification {
  id: string;
  itemId: number;
  itemName: string;
  message: string;
  category: FSNCategory;
  status: StockStatus;
  currentStock: number;
  priority: "high" | "medium" | "low";
}