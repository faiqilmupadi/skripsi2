import { ItemCheckout, CheckoutPayload } from "@/types/ambil";

const API_URL = "/api/items"; 
const CHECKOUT_URL = "/api/checkout"; 


export async function fetchItemsForCheckout(): Promise<ItemCheckout[]> {
  try {
    const res = await fetch(API_URL, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch items");
    const data = await res.json();
    return data; 
  } catch (error) {
    console.error("Error fetching items:", error);
    return [];
  }
}

export async function processCheckoutItem(data: CheckoutPayload): Promise<boolean> {
  try {
    const res = await fetch(CHECKOUT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Failed to checkout");
    }
    
    return true;
  } catch (error) {
    console.error("Error processing checkout:", error);
    throw error;
  }
}