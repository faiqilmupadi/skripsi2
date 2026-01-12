// lib/stock.ts

import { ItemWithStatus } from "@/types/stock"; // Pastikan path ini sesuai

const API_URL = "/api/items"; // Relative path untuk API items

// ================= GET (READ) =================
export async function fetchStockItems(): Promise<ItemWithStatus[]> {
  try {
    // Gunakan no-store agar data selalu fresh (tidak dicache browser)
    const res = await fetch(API_URL, { cache: "no-store" });

    if (!res.ok) {
      throw new Error("Failed to fetch stock items");
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching stock items:", error);
    return [];
  }
}

// ================= POST (CREATE) =================
export async function createStockItem(data: {
  nama_barang: string;
  stok_saat_ini: number;
  rop: number;
  safety_stock: number;
  satuan: string;
}): Promise<boolean> {
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Failed to create item");
    return true;
  } catch (error) {
    console.error("Error create item:", error);
    throw error;
  }
}

// ================= PUT (UPDATE) =================
export async function updateStockItem(
  id: number,
  data: {
    nama_barang: string;
    stok_saat_ini: number;
    rop: number;
    safety_stock: number;
    satuan: string;
  }
): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Failed to update item");
    return true;
  } catch (error) {
    console.error("Error update item:", error);
    throw error;
  }
}

// ================= DELETE =================
export async function deleteStockItem(id: number): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) throw new Error("Failed to delete item");
    return true;
  } catch (error) {
    console.error("Error delete item:", error);
    throw error;
  }
}

// ================= NOTIFICATION LOGIC =================

// Ambil list ID yang sudah ada di tabel notification
export async function fetchNotifiedItemIds(): Promise<number[]> {
  try {
    const res = await fetch("/api/notification", { cache: "no-store" });
    if (!res.ok) throw new Error("Gagal mengambil data notifikasi");
    return await res.json();
  } catch (error) {
    console.error("Error fetch notification IDs:", error);
    return [];
  }
}

// Simpan ke tabel notification
export async function saveNotificationDB(itemId: number, namaBarang: string): Promise<void> {
  try {
    const res = await fetch("/api/notification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemId, namaBarang }),
    });

    if (!res.ok) throw new Error("Gagal menyimpan notifikasi");
  } catch (error) {
    console.error("Error saving notification:", error);
    throw error;
  }
}