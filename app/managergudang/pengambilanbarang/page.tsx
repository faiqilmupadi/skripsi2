// app/managergudang/pengambilanbarang/page.tsx
"use client";

import { useState, useEffect } from "react";
import { ItemCheckout } from "@/types/ambil";
import { fetchItemsForCheckout, processCheckoutItem } from "@/lib/ambilAdmin";
import StockTable from "./components/StockTable";
import { CheckoutModal } from "./components/StockModals";

export default function CheckoutPage() {
  const [items, setItems] = useState<ItemCheckout[]>([]);
  const [loading, setLoading] = useState(true);

  // State Modal Checkout
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ItemCheckout | null>(null);
  const [checkoutForm, setCheckoutForm] = useState({ requesterName: "", amount: "" });

  // Load Data Barang
  async function loadData() {
    setLoading(true);
    const data = await fetchItemsForCheckout();
    setItems(data);
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  // Handler Buka Modal
  const handleCheckoutClick = (item: ItemCheckout) => {
    setSelectedItem(item);
    setCheckoutForm({ requesterName: "", amount: "" }); // Reset form
    setShowCheckoutModal(true);
  };

  // Handler Submit Checkout
  const handleSubmitCheckout = async () => {
    if (!selectedItem) return;

    // Validasi sederhana
    const qty = parseInt(checkoutForm.amount);
    if (!checkoutForm.requesterName || isNaN(qty) || qty <= 0) {
      alert("Mohon isi Nama dan Jumlah dengan benar.");
      return;
    }

    if (qty > selectedItem.stok_saat_ini) {
      alert(`Stok tidak cukup! Hanya tersedia ${selectedItem.stok_saat_ini}`);
      return;
    }

    try {
      await processCheckoutItem({
        itemId: selectedItem.id,
        requesterName: checkoutForm.requesterName,
        amount: qty
      });

      alert("✅ Checkout Berhasil!");
      setShowCheckoutModal(false);
      loadData(); // Refresh tabel agar stok berkurang
    } catch (error: any) {
      alert("❌ Gagal Checkout: " + error.message);
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header Filter */}
      <div className="flex gap-2 mb-8">
        {["24H", "7D", "1M", "3M", "CUSTOM"].map((filter, index) => (
          <button
            key={filter}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
              index === 0
                ? "bg-blue-500 text-white shadow-md"
                : "bg-blue-100/50 text-blue-400 hover:bg-blue-100"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <p className="text-gray-400 animate-pulse">Memuat Data Barang...</p>
        </div>
      ) : (
        <StockTable 
          items={items} 
          onCheckout={handleCheckoutClick} 
        />
      )}

      {/* Modal Checkout */}
      <CheckoutModal
        show={showCheckoutModal}
        selectedItem={selectedItem}
        form={checkoutForm}
        onChange={(field, value) => setCheckoutForm({ ...checkoutForm, [field]: value })}
        onSubmit={handleSubmitCheckout}
        onClose={() => setShowCheckoutModal(false)}
      />
    </div>
  );
}