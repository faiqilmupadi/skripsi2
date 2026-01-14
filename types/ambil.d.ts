export type RequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export type RequestType = 'CHECKOUT';

// --- Tipe untuk Data Barang (YANG HILANG TADI) ---
export interface ItemCheckout {
  id: number;
  nama_barang: string;
  stok_saat_ini: number;
  satuan?: string;
  rop?: number; 
  safety_stock?: number;
}

// --- Tipe untuk Admin (Pengirim Request) ---
export interface AdminRequestPayload {
  itemId: number;
  userId: number;       // ID User yang melakukan pengambilan
  requesterName: string; // Nama User
  amount: number;
}

// --- Tipe untuk Manager (Penerima/Validator) ---
export interface ManagerActionPayload {
  requestId: number;
  action: 'APPROVE' | 'REJECT';
  managerId: number; // ID Manager yang klik tombol
}

// --- Tipe Data Tampilan (Shared) ---
export interface TransactionRequestData {
  id: number;
  item_id: number;
  nama_barang: string; // dari join
  stok_gudang: number; // dari join (untuk info manager)
  requester_name: string;
  amount: number;
  status: RequestStatus;
  created_at: string;
}