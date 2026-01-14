"use client";

import { useState, useEffect } from "react";
import { ItemCheckout } from "@/types/ambil";
import { jwtDecode } from "jwt-decode"; // ✅ IMPORT JWT DECODE

// Service Admin
import { fetchItemsForAdmin, sendCheckoutRequest } from "@/services/ambilAdminService";

// Components
import StockTable from "./components/StockTable"; 
import { CheckoutModal } from "./components/StockModals";

export default function AdminPage() {
  const [items, setItems] = useState<ItemCheckout[]>([]);
  const [loading, setLoading] = useState(true);
  
  // --- STATE USER AUTH (OTOMATIS) ---
  const [currentUser, setCurrentUser] = useState({ id: 0, name: "", role: "" });

  // UI State
  const [selectedItem, setSelectedItem] = useState<ItemCheckout | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [amount, setAmount] = useState("");

  // --- 1. LOAD USER DARI TOKEN & LOAD ITEMS ---
  useEffect(() => {
    async function initData() {
      try {
        setLoading(true);

        // A. AMBIL TOKEN & DECODE USER
        const token = localStorage.getItem("token"); // Sesuaikan nama key token Anda
        if (token) {
            try {
                const decoded: any = jwtDecode(token);
                // Sesuaikan field decoded dengan isi token Anda (misal: sub, id, username, nama)
                setCurrentUser({
                    id: decoded.id || decoded.sub, 
                    name: decoded.name || decoded.username || decoded.nama, 
                    role: decoded.role
                });
            } catch (err) {
                console.error("Token invalid:", err);
                // Opsional: Redirect ke login jika token rusak
            }
        } else {
            console.warn("⚠️ Tidak ada token login ditemukan.");
        }

        // B. LOAD DATA BARANG
        const dItems = await fetchItemsForAdmin();
        setItems(dItems);

      } catch (e) {
        console.error("Gagal memuat data:", e);
      } finally {
        setLoading(false);
      }
    }
    initData();
  }, []);

  // --- 2. HANDLER REQUEST ---
  const handleRequest = async () => {
    // Validasi User Login
    if (currentUser.id === 0) {
        alert("⚠️ Sesi Anda habis atau belum login. Silakan login ulang.");
        return;
    }
    if (!selectedItem) return;
    
    try {
      await sendCheckoutRequest({
        itemId: selectedItem.id,
        userId: currentUser.id,      // <--- AMBIL OTOMATIS DARI STATE
        requesterName: currentUser.name, // <--- AMBIL OTOMATIS DARI STATE
        amount: parseInt(amount)
      });

      alert(`✅ Permintaan atas nama "${currentUser.name}" terkirim ke Manager!`);
      setShowModal(false);
    } catch (e: any) {
      alert("❌ Error: " + e.message);
    }
  };

  const handleItemClick = (item: ItemCheckout) => {
    setSelectedItem(item);
    setAmount("");
    setShowModal(true);
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
           <h1 className="text-2xl font-bold text-gray-800">Request Pengambilan Barang</h1>
           <p className="text-sm text-gray-500">Admin Gudang</p>
        </div>
        
        {/* INFO USER LOGIN (OTOMATIS) */}
        <div className="bg-white px-4 py-2 rounded-lg border flex items-center gap-3 shadow-sm">
           <div className="text-right">
             <p className="text-xs text-gray-400 font-bold uppercase">Pelaksana</p>
             <p className={`font-bold text-sm ${currentUser.id !== 0 ? 'text-blue-600' : 'text-red-500'}`}>
                {currentUser.id !== 0 ? currentUser.name : "Guest / Belum Login"}
             </p>
           </div>
           <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
              {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : "?"}
           </div>
        </div>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center text-gray-500 animate-pulse">
            Memuat Data Stok...
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white p-8 text-center text-gray-500 border rounded-lg">
            Tidak ada barang ditemukan atau API error.
        </div>
      ) : (
        <StockTable items={items} onCheckout={handleItemClick} />
      )}

      {/* MODAL CHECKOUT */}
      <CheckoutModal 
         show={showModal}
         selectedItem={selectedItem}
         form={{ 
            // Nama user otomatis muncul di form (Read Only)
            requesterName: currentUser.name || "Guest", 
            amount 
         }}
         onChange={(f, v) => setAmount(v)}
         onSubmit={handleRequest}
         onClose={() => setShowModal(false)}
         title="Ajukan Pengambilan"
         buttonLabel="Kirim Request"
      />
    </div>
  );
}