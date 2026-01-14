"use client";

import { useState, useEffect } from "react";
import { TransactionRequestData, ItemCheckout } from "@/types/ambil";
import { fetchPendingRequests, executeManagerAction, fetchItemsForManager } from "@/services/ambilManagerService";

// Import Components
import StockTable from "./components/StockTable"; 
import InfoModal from "./components/InfoModal";

export default function ManagerPage() {
  const [requests, setRequests] = useState<TransactionRequestData[]>([]);
  const [items, setItems] = useState<ItemCheckout[]>([]);
  const [loading, setLoading] = useState(true);

  // --- State untuk Modal Info ---
  const [selectedInfoItem, setSelectedInfoItem] = useState<ItemCheckout | null>(null);
  const [showInfoModal, setShowInfoModal] = useState(false);

  const loadAllData = async () => {
    setLoading(true);
    try {
        const [reqData, itemData] = await Promise.all([
            fetchPendingRequests(),
            fetchItemsForManager()
        ]);
        setRequests(reqData);
        setItems(itemData);
    } catch(e) { console.error(e); } finally { setLoading(false); }
  };

  useEffect(() => { loadAllData(); }, []);

  const handleDecision = async (req: TransactionRequestData, action: "APPROVE" | "REJECT") => {
    if(!confirm(`Yakin ingin ${action}?`)) return;
    try {
      await executeManagerAction({ requestId: req.id, action, managerId: 1 });
      alert("Berhasil!");
      loadAllData();
    } catch (e: any) { alert("Gagal: " + e.message); }
  };

  // ✅ Handler klik Icon Mata
  const handleViewDetail = (item: ItemCheckout) => {
    setSelectedInfoItem(item);
    setShowInfoModal(true);
  };

  if (loading) return <div className="p-8 text-gray-500">Memuat Dashboard...</div>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen space-y-10">
      
      {/* SECTION 1: APPROVAL (Kode sama seperti sebelumnya, disingkat biar fokus) */}
      <section>
          <div className="flex items-center gap-3 mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Approval Pengambilan Barang</h1>
            <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold">{requests.length} Pending</span>
          </div>
          {/* ... (Kode Card Request tetap sama) ... */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {requests.map(req => (
                 /* ... Render Card Request ... */
                 <div key={req.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="font-bold">{req.nama_barang}</h3>
                    <p className="text-sm">Minta: {req.amount}</p>
                    <div className="flex gap-2 mt-4">
                        <button onClick={() => handleDecision(req, "REJECT")} className="flex-1 bg-red-50 text-red-600 py-1 rounded">Tolak</button>
                        <button onClick={() => handleDecision(req, "APPROVE")} className="flex-1 bg-blue-600 text-white py-1 rounded">ACC</button>
                    </div>
                 </div>
             ))}
          </div>
      </section>

      {/* SECTION 2: MONITORING STOK */}
      <section>
          <div className="mb-4">
              <h2 className="text-xl font-bold text-gray-800">Monitoring Stok Gudang</h2>
              <p className="text-sm text-gray-500">Klik ikon mata untuk melihat detail ROP & Safety Stock.</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
             {/* ✅ TABEL MODE INFO (ICON MATA) */}
             <StockTable 
                items={items} 
                mode="info" 
                onCheckout={handleViewDetail} 
             />
          </div>
      </section>

      {/* ✅ MODAL POPUP INFO */}
      <InfoModal 
        show={showInfoModal} 
        item={selectedInfoItem} 
        onClose={() => setShowInfoModal(false)} 
      />

    </div>
  );
}