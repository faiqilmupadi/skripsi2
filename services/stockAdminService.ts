import { StockItem, StockStatus } from "@/types/stockAdmin";

// Warna Status
export const STATUS_COLORS = {
  aman: "bg-green-100 text-green-800",
  menipis: "bg-yellow-100 text-yellow-800",
  kritis: "bg-red-100 text-red-800",
};

// Hitung Status Barang
export function calculateStockStatus(item: any): StockStatus {
  if (item.stok_saat_ini <= item.safety_stock) return "kritis";
  if (item.stok_saat_ini <= item.rop) return "menipis";
  return "aman";
}

// Fetch Data Barang untuk Admin
export async function fetchAdminItems(): Promise<StockItem[]> {
  const res = await fetch("/api/stockAdmin/items", { cache: "no-store" });
  if (!res.ok) throw new Error("Gagal ambil data barang");
  return res.json();
}

// Fetch Suppliers
export async function fetchSuppliers(): Promise<any[]> {
  const res = await fetch("/api/stockAdmin/suppliers", { cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}

// Kirim Request Restock (Admin -> Manager)
export async function sendRestockRequest(payload: any) {
  const res = await fetch("/api/stockAdmin/request", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Gagal mengirim permintaan restock");
  return res.json();
}