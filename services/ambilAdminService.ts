// C:\Faiq\skripsi\skripsi2\services\ambilAdminService.ts
import { ItemCheckout } from "@/types/ambil"; // Asumsi tipe ItemCheckout ada di types/ambil
import { AdminRequestPayload } from "@/types/ambil";

// 1. Ambil Data Barang (Untuk Dropdown/Tabel Admin)
export async function fetchItemsForAdmin(): Promise<ItemCheckout[]> {
  const res = await fetch("/api/items", { cache: "no-store" });
  if (!res.ok) throw new Error("Gagal mengambil data barang");
  return res.json();
}

// 2. Kirim Request Checkout (Hanya Insert PENDING ke DB)
export async function sendCheckoutRequest(data: AdminRequestPayload) {
  const res = await fetch("/api/ambilAdmin/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.error || "Gagal mengirim request");
  return json;
}