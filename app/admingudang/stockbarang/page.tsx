"use client";
import { useState, useEffect } from "react";
import { StockItem, Supplier } from "@/types/stockAdmin"; 
import { fetchAdminItems, fetchSuppliers, calculateStockStatus, sendRestockRequest, STATUS_COLORS } from "@/services/stockAdminService";
import { jwtDecode } from "jwt-decode"; // ✅ IMPORT INI

export default function StockAdminPage() {
  const [items, setItems] = useState<StockItem[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  
  // State Modal & Notif
  const [isRestockModalOpen, setRestockModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<StockItem | null>(null);
  const [criticalNotification, setCriticalNotification] = useState<StockItem | null>(null);
  const [tempDismissedIds, setTempDismissedIds] = useState<number[]>([]);
  
  const [form, setForm] = useState({ supplier_id: 0, supplier_name: "", amount: 0 });
  const [isLoading, setIsLoading] = useState(true);

  // --- LOGIKA AUTH JWT ---
  const [currentUser, setCurrentUser] = useState({ id: 0, name: "" });

  useEffect(() => {
    // 1. Ambil Token dari localStorage
    const token = localStorage.getItem("token"); 

    if (token) {
       try {
         // 2. Decode Token untuk ambil isinya
         const decoded: any = jwtDecode(token);
         
         // 3. Set User Data
         setCurrentUser({
            id: decoded.id,
            name: decoded.name
         });
       } catch (e) {
         console.error("Token tidak valid", e);
         // Token rusak/expired -> Bisa redirect ke login
         // window.location.href = "/login";
       }
    } else {
       console.warn("⚠️ Belum login / Token hilang");
    }
  }, []);
  // -----------------------

  // Load Data
  async function loadData() {
    try {
      setIsLoading(true);
      const [dataItems, dataSuppliers] = await Promise.all([ fetchAdminItems(), fetchSuppliers() ]);
      
      const processedItems = dataItems.map(item => ({
        ...item,
        status: calculateStockStatus(item),
        statusColor: STATUS_COLORS[calculateStockStatus(item)]
      }));
      
      setItems(processedItems);
      setSuppliers(dataSuppliers);

      const critical = processedItems.find(i => 
        (i.status === "kritis" || i.status === "menipis") && !tempDismissedIds.includes(i.id)
      );
      if (critical) setCriticalNotification(critical);

    } catch (e) { console.error(e); } finally { setIsLoading(false); }
  }

  useEffect(() => { loadData(); }, [tempDismissedIds]);

  const openRestockModal = (item: StockItem) => {
    setSelectedItem(item);
    setForm({ supplier_id: 0, supplier_name: "", amount: 0 });
    setRestockModalOpen(true);
    setCriticalNotification(null);
  };

  const handleSupplierChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
     const selectedId = parseInt(e.target.value);
     if (selectedId === 0) {
        setForm({ ...form, supplier_id: 0, supplier_name: "" });
        return;
     }
     const selectedObj = suppliers.find(s => s.id === selectedId);
     if (selectedObj) {
         setForm({ ...form, supplier_id: selectedObj.id, supplier_name: selectedObj.nama_supplier });
     }
  };

  const handleRestockSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;

    // VALIDASI USER (JWT)
    if (currentUser.id === 0) {
        alert("❌ Sesi habis atau belum login. Silakan login ulang.");
        return;
    }

    try {
      await sendRestockRequest({
        item_id: selectedItem.id,
        user_id: currentUser.id, 
        requester_name: currentUser.name, 
        supplier_id: form.supplier_id,    
        supplier_name: form.supplier_name,
        amount: Number(form.amount)
      });
      alert(`✅ Order Berhasil!`);
      setRestockModalOpen(false);
    } catch (error) {
      alert("❌ Gagal restock.");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      <div className="flex justify-between items-center mb-8">
        <div>
           <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Stok Gudang (JWT)</h1>
           <p className="text-gray-500 text-sm mt-1">
             Login: {currentUser.id !== 0 ? <span className="text-blue-600 font-bold">{currentUser.name}</span> : <span className="text-red-500">Guest</span>}
           </p>
        </div>
        <button onClick={loadData} className="px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm">🔄 Refresh</button>
      </div>

      {/* --- NOTIFIKASI POPUP --- */}
      {criticalNotification && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce-in">
          <div className="bg-white rounded-xl shadow-2xl border-l-4 border-red-500 w-80 p-5">
            <h3 className="font-bold text-red-600">⚠️ Stok Kritis</h3>
            <p className="text-sm mt-1">{criticalNotification.nama_barang} sisa {criticalNotification.stok_saat_ini}.</p>
            <div className="mt-3 flex gap-2">
               <button onClick={() => openRestockModal(criticalNotification)} className="flex-1 bg-red-600 text-white text-xs py-2 rounded">Pesan</button>
               <button onClick={() => { setTempDismissedIds(prev => [...prev, criticalNotification.id]); setCriticalNotification(null); }} className="flex-1 bg-gray-200 text-xs py-2 rounded">Nanti</button>
            </div>
          </div>
        </div>
      )}

      {/* --- TABEL --- */}
      <div className="bg-white rounded-xl shadow border overflow-hidden">
        {isLoading ? <div className="p-10 text-center">Loading...</div> : (
        <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-800 text-white">
                <tr>
                    <th className="px-6 py-3 text-left text-xs uppercase">Barang</th>
                    <th className="px-6 py-3 text-left text-xs uppercase">Stok</th>
                    <th className="px-6 py-3 text-center text-xs uppercase">Status</th>
                    <th className="px-6 py-3 text-center text-xs uppercase">Aksi</th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {items.map(item => (
                    <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-bold text-gray-800">{item.nama_barang}</td>
                        <td className="px-6 py-4">{item.stok_saat_ini} {item.satuan}</td>
                        <td className="px-6 py-4 text-center">
                            <span className={`px-2 py-1 rounded text-xs font-bold ${item.statusColor}`}>{item.status.toUpperCase()}</span>
                        </td>
                        <td className="px-6 py-4 text-center">
                             <button onClick={() => openRestockModal(item)} className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm">Pesan</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
        )}
      </div>

      {/* --- MODAL --- */}
      {isRestockModalOpen && selectedItem && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-md p-6">
                <h2 className="text-xl font-bold mb-4">Form Restock</h2>
                <form onSubmit={handleRestockSubmit} className="space-y-4">
                    <div><label className="text-sm text-gray-600">Barang</label><input disabled value={selectedItem.nama_barang} className="w-full border p-2 rounded bg-gray-100"/></div>
                    <div>
                        <label className="text-sm text-gray-600">Supplier</label>
                        <select required className="w-full border p-2 rounded" onChange={handleSupplierChange} value={form.supplier_id}>
                            <option value={0} disabled={form.supplier_name !== ""}>Pilih Supplier</option>
                            {suppliers.map(s => <option key={s.id} value={s.id}>{s.nama_supplier}</option>)}
                            <option value={0} className="text-blue-600">Manual Input</option>
                        </select>
                        {form.supplier_id === 0 && <input placeholder="Nama Supplier Manual" className="w-full border p-2 rounded mt-2" onChange={e => setForm({...form, supplier_name: e.target.value})}/>}
                    </div>
                    <div><label className="text-sm text-gray-600">Jumlah</label><input type="number" required min="1" className="w-full border p-2 rounded" onChange={e => setForm({...form, amount: parseInt(e.target.value)})}/></div>
                    <div className="flex gap-2 justify-end mt-4">
                        <button type="button" onClick={() => setRestockModalOpen(false)} className="px-4 py-2 bg-gray-200 rounded">Batal</button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Kirim</button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
}