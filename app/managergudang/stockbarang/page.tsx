"use client";
import { useState, useEffect } from "react";
import { StockItem } from "@/types/stockAdmin"; // Sesuaikan path type
import { StockRequest } from "@/types/stockManager"; // Sesuaikan path type
import { fetchAdminItems } from "@/services/stockAdminService"; 
import { 
  fetchPendingRequests, 
  processManagerAction, 
  updateItemManager, 
  deleteItemManager 
} from "@/services/stockManagerService";

export default function StockManagerPage() {
  // --- STATE ---
  const [items, setItems] = useState<StockItem[]>([]);
  const [requests, setRequests] = useState<StockRequest[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal Edit
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editForm, setEditForm] = useState<any>({});

  // Notifikasi
  const [currentRequestIndex, setCurrentRequestIndex] = useState(0);
  const [isNotifVisible, setIsNotifVisible] = useState(true);

  // --- LOAD DATA ---
  async function loadData() {
    // Jangan set loading true agar tidak kedip-kedip saat refresh background
    try {
      const [dataItems, dataRequests] = await Promise.all([
        fetchAdminItems(),
        fetchPendingRequests()
      ]);
      setItems(dataItems);
      setRequests(dataRequests);
      
      // Jika ada request baru, reset index notif
      if (dataRequests.length > 0 && requests.length === 0) {
        setIsNotifVisible(true);
        setCurrentRequestIndex(0);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  // Load awal
  useEffect(() => { loadData(); }, []);

  // Opsional: Cek request baru setiap 10 detik (Realtime-ish)
  useEffect(() => {
    const interval = setInterval(() => {
        loadData();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // --- HANDLERS ---
  const handleEditClick = (item: StockItem) => {
    setEditForm(item);
    setIsEditOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateItemManager(editForm.id, {
        nama_barang: editForm.nama_barang,
        stok_saat_ini: Number(editForm.stok_saat_ini),
        rop: Number(editForm.rop),
        safety_stock: Number(editForm.safety_stock),
        satuan: editForm.satuan
      });
      alert("✅ Data Barang Berhasil Diupdate!");
      setIsEditOpen(false);
      loadData();
    } catch (error) {
      alert("❌ Gagal update barang.");
    }
  };

  const handleDelete = async (id: number) => {
    if(!confirm("⚠️ Yakin hapus barang ini?")) return;
    try {
      await deleteItemManager(id);
      loadData();
    } catch (error) {
      alert("Gagal menghapus.");
    }
  };

  // --- LOGIKA NOTIFIKASI REQUEST ---
  const activeRequest = requests.length > 0 ? requests[currentRequestIndex] : null;

  const handleProcessRequest = async (action: "APPROVE" | "REJECT") => {
    if (!activeRequest) return;
    
    // Sembunyikan notif biar UI responsif
    setIsNotifVisible(false);

    try {
      await processManagerAction({ requestId: activeRequest.id, action });
      
      const updatedRequests = requests.filter(r => r.id !== activeRequest.id);
      setRequests(updatedRequests);

      // Handle next notification
      if (updatedRequests.length > 0) {
        if (currentRequestIndex >= updatedRequests.length) {
            setCurrentRequestIndex(0);
        }
        setTimeout(() => setIsNotifVisible(true), 300);
      }
      
      // Refresh stok karena pasti berubah
      if (action === "APPROVE") {
        const newItems = await fetchAdminItems();
        setItems(newItems);
        alert(`✅ Stok ${activeRequest.nama_barang} bertambah +${activeRequest.amount}`);
      }

    } catch (error) {
      setIsNotifVisible(true);
      alert("Gagal memproses request.");
    }
  };

  const handleLihatNanti = () => {
    if (requests.length > 1) {
        setIsNotifVisible(false);
        setTimeout(() => {
            setCurrentRequestIndex((prev) => (prev + 1) % requests.length);
            setIsNotifVisible(true);
        }, 300);
    } else {
        setIsNotifVisible(false);
    }
  };

  // --- RENDER ---
  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans relative">
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <div>
           <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Master Stok Barang</h1>
           <p className="text-gray-500 mt-1">Kelola data inventaris dan persetujuan stok masuk.</p>
        </div>
        <div className="flex gap-3">
             {/* Indikator Request Pending */}
            {requests.length > 0 && (
                <div className="px-4 py-2 bg-orange-100 text-orange-700 rounded-lg flex items-center gap-2 animate-pulse border border-orange-200">
                    <span className="font-bold">{requests.length}</span> Permintaan Pending
                </div>
            )}
            <button 
            onClick={() => { setLoading(true); loadData(); }} 
            className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-blue-50 transition shadow-sm font-medium"
            >
            🔄 Refresh
            </button>
        </div>
      </div>

      {/* --- TABEL --- */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {loading && items.length === 0 ? (
            <div className="p-20 text-center text-gray-400">Memuat data...</div>
        ) : (
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-slate-800 text-white">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Nama Barang</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Stok Gudang</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Satuan</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Parameter (ROP/SS)</th>
              <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {items.map((item, index) => (
              <tr key={item.id} className={`hover:bg-blue-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-bold text-gray-800">{item.nama_barang}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`font-mono font-bold text-lg ${item.stok_saat_ini <= item.safety_stock ? "text-red-600" : "text-gray-700"}`}>
                        {item.stok_saat_ini}
                    </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500 text-sm">{item.satuan}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col text-xs text-gray-500 gap-1">
                        <span>ROP: <b>{item.rop}</b></span>
                        <span>Safety: <b>{item.safety_stock}</b></span>
                    </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="flex justify-center gap-2">
                    <button onClick={() => handleEditClick(item)} className="text-blue-600 hover:text-blue-800 font-medium text-sm">Edit</button>
                    <span className="text-gray-300">|</span>
                    <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-800 font-medium text-sm">Hapus</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        )}
      </div>

      {/* --- NOTIFIKASI POP-UP REQUEST (Fixed Bottom Right) --- */}
      {activeRequest && isNotifVisible && (
        <div className="fixed bottom-8 right-8 z-[100] animate-slide-in-right">
           <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-96 overflow-hidden">
             
             {/* Header */}
             <div className="bg-gradient-to-r from-orange-500 to-red-500 px-5 py-4 flex justify-between items-center text-white shadow-md">
               <div className="flex items-center gap-3">
                 <div className="bg-white/20 p-1.5 rounded-lg animate-bounce">🔔</div>
                 <div>
                    <h4 className="font-bold text-sm leading-tight">Konfirmasi Pesanan</h4>
                    <p className="text-[10px] text-orange-50 opacity-90">Permintaan dari Admin</p>
                 </div>
               </div>
               <span className="text-xs bg-white text-orange-600 px-2.5 py-1 rounded-full font-bold">
                 {currentRequestIndex + 1} / {requests.length}
               </span>
             </div>

             {/* Content */}
             <div className="p-5 bg-white">
               <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Barang Masuk</p>
                    <p className="text-gray-800 font-bold text-xl leading-tight">{activeRequest.nama_barang}</p>
                    <p className="text-xs text-gray-500 mt-1">Oleh: <span className="font-semibold">{activeRequest.requester_name}</span></p>
                  </div>
                  <div className="text-right bg-orange-50 px-4 py-2 rounded-xl border border-orange-100">
                     <span className="text-2xl font-bold text-orange-600 block">+{activeRequest.amount}</span>
                     <span className="text-[10px] text-gray-500 font-medium uppercase">{activeRequest.satuan || 'Unit'}</span>
                  </div>
               </div>

               {activeRequest.supplier_name && (
                   <div className="text-xs bg-gray-50 p-3 rounded-lg text-gray-600 border border-gray-100 flex items-center gap-2 mb-4">
                       🏭 Supplier: <b className="text-gray-800">{activeRequest.supplier_name}</b>
                   </div>
               )}

               {/* Actions */}
               <div className="flex gap-3 pt-2">
                 <button 
                   onClick={() => handleProcessRequest("APPROVE")}
                   className="flex-1 bg-green-600 text-white py-3 rounded-xl text-sm font-bold hover:bg-green-700 transition shadow-lg shadow-green-100 flex items-center justify-center gap-2"
                 >
                   ✅ Terima Barang
                 </button>
                 <button 
                   onClick={handleLihatNanti}
                   className="px-4 bg-gray-100 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-200 transition"
                 >
                   ⏭
                 </button>
               </div>
               <button 
                   onClick={() => handleProcessRequest("REJECT")}
                   className="w-full mt-3 text-xs text-red-400 hover:text-red-600 py-1 transition-colors"
               >
                   Tolak Permintaan ini
               </button>
             </div>
           </div>
        </div>
      )}

      {/* --- MODAL EDIT --- */}
      {isEditOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-fade-in">
          <div className="bg-white p-8 rounded-2xl w-full max-w-lg shadow-2xl transform scale-100 transition-all">
            <h3 className="text-xl font-bold mb-6 text-gray-800 border-b pb-4">✏️ Edit Barang</h3>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Nama Barang</label>
                <input 
                  type="text" 
                  value={editForm.nama_barang} 
                  onChange={(e) => setEditForm({...editForm, nama_barang: e.target.value})}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Stok</label>
                  <input 
                    type="number" 
                    value={editForm.stok_saat_ini} 
                    onChange={(e) => setEditForm({...editForm, stok_saat_ini: e.target.value})}
                    className="w-full border border-gray-300 p-3 rounded-lg bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Satuan</label>
                  <input 
                    type="text" 
                    value={editForm.satuan} 
                    onChange={(e) => setEditForm({...editForm, satuan: e.target.value})}
                    className="w-full border border-gray-300 p-3 rounded-lg"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                <button type="button" onClick={() => setIsEditOpen(false)} className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium">Batal</button>
                <button type="submit" className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-md">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}