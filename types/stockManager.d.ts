export type RequestStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface StockRequest {
  id: number;
  item_id: number;
  nama_barang: string;      
  stok_gudang_saat_ini: number; 
  satuan: string;           // <--- TAMBAHKAN INI
  requester_name: string;
  supplier_name: string;
  amount: number;
  status: RequestStatus;
  created_at: string;
}

export interface ManagerActionPayload {
  requestId: number;
  action: "APPROVE" | "REJECT";
}