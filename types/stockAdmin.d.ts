export type StockStatus = "aman" | "menipis" | "kritis";

export interface StockItem {
  id: number;
  nama_barang: string;
  rop: number;
  stok_saat_ini: number;
  safety_stock: number;
  satuan: string;
  status: StockStatus;   // Computed di frontend/service
  statusColor: string;   // Computed
}

export interface Supplier {
  id: number;
  nama_supplier: string;
}

export interface RestockFormPayload {
  item_id: number;
  user_id: number;       // Dari session login
  requester_name: string;// Dari session login
  supplier_name: string;
  amount: number;
}