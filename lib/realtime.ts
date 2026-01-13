import { ItemWithStatus } from "@/types/realtime"; 

export async function fetchStockItems(): Promise<ItemWithStatus[]> {
  try {
    const res = await fetch("http://localhost:3000/api/items", { cache: "no-store" }); 
    
    if (!res.ok) {
        throw new Error("Failed to fetch stock items");
    }

    return res.json();
    
  } catch (error) {
    console.error("Error fetching stock items:", error);
    return [];
  }
}