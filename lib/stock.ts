// lib/stock.ts

import { ItemWithStatus } from "@/types/stock"; // Pastikan path ini sesuai file type kamu

const API_URL = "/api/items"; // Gunakan relative path agar aman saat deploy

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
    throw error; // Lempar error agar bisa ditangkap di UI (alert)
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