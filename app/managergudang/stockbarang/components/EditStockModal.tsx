"use client";
import { useState, useEffect } from "react";
import { StockItem } from "@/types/stockAdmin";

interface Props {
  isOpen: boolean;
  initialData: any;
  onClose: () => void;
  onSave: (data: any) => void;
}

export default function EditStockModal({ isOpen, initialData, onClose, onSave }: Props) {
  const [formData, setFormData] = useState<any>({});

  // Reset form saat initialData berubah
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-fade-in">
      <div className="bg-white p-8 rounded-2xl w-full max-w-lg shadow-2xl transform scale-100 transition-all">
        <h3 className="text-xl font-bold mb-6 text-gray-800 border-b pb-4">✏️ Edit Barang</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Nama Barang</label>
            <input 
              type="text" 
              value={formData.nama_barang || ''} 
              onChange={(e) => setFormData({...formData, nama_barang: e.target.value})}
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Stok</label>
              <input 
                type="number" 
                value={formData.stok_saat_ini || 0} 
                onChange={(e) => setFormData({...formData, stok_saat_ini: e.target.value})}
                className="w-full border border-gray-300 p-3 rounded-lg bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Satuan</label>
              <input 
                type="text" 
                value={formData.satuan || ''} 
                onChange={(e) => setFormData({...formData, satuan: e.target.value})}
                className="w-full border border-gray-300 p-3 rounded-lg"
              />
            </div>
          </div>
          {/* Tambahan input ROP dan Safety Stock jika diperlukan sesuai logic lama */}
          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">ROP</label>
                <input 
                    type="number" 
                    value={formData.rop || 0}
                    onChange={(e) => setFormData({...formData, rop: e.target.value})}
                    className="w-full border border-gray-300 p-3 rounded-lg"
                />
             </div>
             <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Safety Stock</label>
                <input 
                    type="number" 
                    value={formData.safety_stock || 0}
                    onChange={(e) => setFormData({...formData, safety_stock: e.target.value})}
                    className="w-full border border-gray-300 p-3 rounded-lg"
                />
             </div>
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
            <button type="button" onClick={onClose} className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium">Batal</button>
            <button type="submit" className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-md">Simpan</button>
          </div>
        </form>
      </div>
    </div>
  );
}