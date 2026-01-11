
export interface ItemCheckout {
  id: number;
  nama_barang: string;
  rop: number;
  stok_saat_ini: number;
  created_at: string;
}

// Data yang dikirim saat checkout
export interface CheckoutPayload {
  itemId: number;
  requesterName: string; // Nama peminjam/pengambil (sesuai screenshot "Name")
  amount: number;        // Jumlah yang diambil
}

export type TimeFilter = "24H" | "7D" | "1M" | "3M" | "CUSTOM";