
export interface ItemCheckout {
  id: number;
  nama_barang: string;
  rop: number;
  stok_saat_ini: number;
  created_at: string;
}

export interface CheckoutPayload {
  itemId: number;
  requesterName: string; 
  amount: number;      
}

export type TimeFilter = "24H" | "7D" | "1M" | "3M" | "CUSTOM";