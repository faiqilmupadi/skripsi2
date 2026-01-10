// types/stock.d.ts
// ✅ UNIFIED & DISESUAIKAN DENGAN DATABASE REAL

export type StockStatus = "aman" | "menipis" | "kritis";
export type TimeFilter = "24H" | "7D" | "1M" | "3M" | "CUSTOM";
export type FSNCategory = "fast" | "slow" | "non";

// ============= ITEM INTERFACE (SESUAI DB) =============
export interface Item {
  id: number;                    // ✅ int di DB (AUTO_INCREMENT) - BUKAN string!
  nama_barang: string;           // ✅ varchar di DB - BUKAN "name"!
  rop: number;                   // ✅ int di DB
  stok_saat_ini: number;         // ✅ int di DB - BUKAN "jumlah"!
  safety_stock: number;          // ✅ int di DB - BUKAN "safetyStock" (camelCase)!
  satuan: string;                // ✅ varchar di DB - FIELD BARU!
  created_at: string;            // ✅ timestamp di DB - BUKAN "createdAt"!
  updated_at: string;            // ✅ timestamp di DB - FIELD BARU!
}

// ============= ITEM WITH STATUS & FSN =============
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

// ============= STOCK MOVEMENT (SESUAI DB) =============
export interface StockMovement {
  id: number;                    // ✅ int di DB (AUTO_INCREMENT)
  item_id: number;               // ✅ int di DB - BUKAN string!
  user_id?: number;              // ✅ int di DB - optional
  tipe: "IN" | "OUT";            // ✅ enum di DB (sekarang hanya OUT, tapi support IN juga)
  qty: number;                   // ✅ int di DB
  tanggal: string;               // ✅ timestamp di DB
  keterangan?: string;           // ✅ optional (bisa ditambahkan nanti)
}

// ============= DISTRIBUTION & SUMMARY =============
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

// ============= NOTIFICATION =============
export interface Notification {
  id: string;                    // Bisa tetap string untuk frontend
  itemId: number;                // ✅ Sesuai dengan Item.id (number)
  itemName: string;
  message: string;
  category: FSNCategory;
  status: StockStatus;
  currentStock: number;
  priority: "high" | "medium" | "low";
}