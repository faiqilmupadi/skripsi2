import { StockRequest, ManagerActionPayload } from "@/types/stockManager"; // Sesuaikan path types
// Jika path types anda di stockManager.ts ganti import di atas.

const BASE_URL = "/api/stockManager"; // Base URL biar rapi

// Ambil Request Pending
export async function fetchPendingRequests(): Promise<StockRequest[]> {
  // URL ini harus sama persis dengan nama folder di step 1
  const res = await fetch(`${BASE_URL}/requests`, { cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}

// Proses ACC / REJECT
export async function processManagerAction(payload: ManagerActionPayload) {
  const res = await fetch(`${BASE_URL}/action`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Gagal memproses aksi");
  return res.json();
}

// Update Barang (Edit)
export async function updateItemManager(id: number, data: any) {
  // Pastikan route ini ada di /api/items/[id]/route.ts atau sejenisnya
  const res = await fetch(`/api/items/${id}`, { 
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Gagal update barang");
  return res.json();
}

// Delete Barang
export async function deleteItemManager(id: number) {
  const res = await fetch(`/api/items/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Gagal hapus barang");
  return res.json();
}