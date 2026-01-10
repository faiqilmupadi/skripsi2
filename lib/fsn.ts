import { Item, StockMovement } from "@/types/fsn";

export async function fetchItems(): Promise<Item[]> {
  try {
    const res = await fetch("http://localhost:3000/api/items", { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch items");
    return res.json();
  } catch (error) {
    console.error("Error fetching items:", error);
    return [];
  }
}

export async function fetchStockMovements(): Promise<StockMovement[]> {
  try {
    const res = await fetch("http://localhost:3000/api/stockmovement", { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch movements");
    return res.json();
  } catch (error) {
    console.error("Error fetching movements:", error);
    return [];
  }
}