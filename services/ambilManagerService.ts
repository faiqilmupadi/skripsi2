// C:\Faiq\skripsi\skripsi2\services\ambilManagerService.ts
import { TransactionRequestData, ManagerActionPayload, ItemCheckout } from "@/types/ambil";

// 1. Ambil Daftar Request Pending
export async function fetchPendingRequests(): Promise<TransactionRequestData[]> {
  const res = await fetch("/api/ambilManager/pending", { cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}

// 2. Ambil Daftar Stok Barang (BARU: Untuk Manager melihat stok)
export async function fetchItemsForManager(): Promise<ItemCheckout[]> {
  const res = await fetch("/api/items", { cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}

// 3. Eksekusi (ACC / TOLAK)
export async function executeManagerAction(data: ManagerActionPayload) {
  const res = await fetch("/api/ambilManager/action", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.error || "Gagal memproses aksi");
  return json;
}