// types/fsn.d.ts
// ✅ DISESUAIKAN DENGAN DATABASE REAL

export interface StockMovement {
  id: number;                    // ✅ int di DB
  item_id: number;               // ✅ int di DB (bukan string!)
  user_id?: number;              // ✅ optional, ada di DB
  tipe: "IN" | "OUT";            // ✅ enum di DB (sekarang hanya OUT, tapi bisa ditambah IN)
  qty: number;                   // ✅ int di DB
  tanggal: string;               // ✅ timestamp di DB
  keterangan?: string;           // ✅ optional (tidak ada di DB tapi bisa ditambah)
}

export interface Item {
  id: number;                    // ✅ int di DB (AUTO_INCREMENT)
  nama_barang: string;           // ✅ varchar di DB
  rop: number;                   // ✅ int di DB
  safety_stock: number;          // ✅ int di DB
  stok_saat_ini: number;         // ✅ int di DB
  satuan: string;                // ✅ varchar di DB
  created_at: string;            // ✅ timestamp di DB
  updated_at: string;            // ✅ timestamp di DB
}

export interface User {
  id: number;                    // ✅ int di DB
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