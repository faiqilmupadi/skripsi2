import { ItemWithStatus } from "@/types/realtime"; // Gunakan tipe yang sudah ada statusnya

export async function fetchStockItems(): Promise<ItemWithStatus[]> {
  try {
    // Arahkan ke endpoint API yang kita buat di Langkah 1
    // Gunakan { cache: 'no-store' } agar data selalu fresh (real-time)
    const res = await fetch("http://localhost:3000/api/items", { cache: "no-store" }); 
    
    if (!res.ok) {
        throw new Error("Failed to fetch stock items");
    }

    // Ini akan mengembalikan array items yang SUDAH punya status & warna
    return res.json();
    
  } catch (error) {
    console.error("Error fetching stock items:", error);
    return [];
  }
}