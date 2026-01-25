"use client";
import { useState, useEffect } from "react";
import { StockItem } from "@/types/stockAdmin";
import { StockRequest } from "@/types/stockManager";
import { fetchAdminItems } from "@/services/stockAdminService"; 
import { fetchPendingRequests, updateItemManager, deleteItemManager } from "@/services/stockManagerService";

// Import Components
import StockTable from "./components/StockTable";
import RequestNotification from "./components/RequestNotification";
import EditStockModal from "./components/EditStockModal";

// Import Custom Hook Baru
import { useStockNotification } from "@/app/hooks/manager/stockbarang/useStockNotification";

export default function StockManagerPage() {
  // --- STATE DASAR ---
  const [items, setItems] = useState<StockItem[]>([]);
  const [rawRequests, setRawRequests] = useState<StockRequest[]>([]); // Data mentah dari API
  const [loading, setLoading] = useState(true);
  
  // Modal Edit
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>({});

  // --- LOGIC HOOK NOTIFIKASI (DISINI KITA PANGGIL) ---
  const { 
    activeRequest, 
    isNotifVisible, 
    currentIndex, 
    requests: displayedRequests, // Rename biar gak bingung
    handleProcess, 
    handleSkip 
  } = useStockNotification(rawRequests, setItems);

  // --- LOAD DATA ---
  async function loadData() {
    try {
      const [dataItems, dataRequests] = await Promise.all([
        fetchAdminItems(),
        fetchPendingRequests()
      ]);
      setItems(dataItems);
      setRawRequests(dataRequests);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadData(); }, []);
  
  // Realtime Polling
  useEffect(() => {
    const interval = setInterval(() => { loadData(); }, 10000);
    return () => clearInterval(interval);
  }, []);

  // --- HANDLERS LAIN (EDIT & DELETE) ---
  const handleEditSubmit = async (formData: any) => {
    try {
      await updateItemManager(formData.id, formData);
      alert("✅ Data Update!");
      setIsEditOpen(false);
      loadData();
    } catch (error) { alert("❌ Gagal update."); }
  };

  const handleDelete = async (id: number) => {
    if(!confirm("⚠️ Hapus barang?")) return;
    await deleteItemManager(id);
    loadData();
  };

  // --- RENDER ---
  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans relative">
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <div>
           <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Master Stok Barang</h1>
           <p className="text-gray-500 mt-1">Kelola data inventaris.</p>
        </div>
        <div className="flex gap-3">
            {displayedRequests.length > 0 && (
                <div className="px-4 py-2 bg-orange-100 text-orange-700 rounded-lg flex items-center gap-2 animate-pulse border border-orange-200">
                    <span className="font-bold">{displayedRequests.length}</span> Permintaan Pending
                </div>
            )}
            <button onClick={() => { setLoading(true); loadData(); }} className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-blue-50 transition shadow-sm font-medium">
            🔄 Refresh
            </button>
        </div>
      </div>

      <StockTable 
        items={items} 
        loading={loading} 
        onEdit={(item) => { setEditingItem(item); setIsEditOpen(true); }} 
        onDelete={handleDelete} 
      />

      {/* Logic notifikasi sekarang tinggal panggil hasil Hook */}
      <RequestNotification 
          request={activeRequest!} // Tanda seru karena kita handle null di komponen
          index={currentIndex}
          total={displayedRequests.length}
          isVisible={isNotifVisible}
          onProcess={handleProcess}
          onSkip={handleSkip}
      />

      <EditStockModal 
        isOpen={isEditOpen}
        initialData={editingItem}
        onClose={() => setIsEditOpen(false)}
        onSave={handleEditSubmit}
      />
    </div>
  );
}