import { ItemCheckout } from "@/types/ambil";

interface InfoModalProps {
  show: boolean;
  item: ItemCheckout | null;
  onClose: () => void;
}

export default function InfoModal({ show, item, onClose }: InfoModalProps) {
  if (!show || !item) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all scale-100">
        
        {/* Header Warna */}
        <div className="bg-purple-600 px-6 py-4 flex justify-between items-center">
            <h3 className="text-white font-bold text-lg">Detail Barang</h3>
            <button onClick={onClose} className="text-purple-200 hover:text-white text-2xl font-bold">&times;</button>
        </div>

        <div className="p-6 space-y-6">
            <div className="text-center">
                <h2 className="text-xl font-bold text-gray-800">{item.nama_barang}</h2>
                <span className="text-xs text-gray-400 uppercase tracking-wide">Informasi Inventori</span>
            </div>

            {/* Grid Informasi */}
            <div className="grid grid-cols-3 gap-2 text-center">
                {/* 1. STOK */}
                <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
                    <span className="block text-2xl font-bold text-blue-600">{item.stok_saat_ini}</span>
                    <span className="text-[10px] font-bold text-blue-400 uppercase">Stok Aktif</span>
                </div>
                
                {/* 2. ROP */}
                <div className="p-3 bg-orange-50 rounded-xl border border-orange-100">
                    <span className="block text-2xl font-bold text-orange-600">{item.rop ?? 0}</span>
                    <span className="text-[10px] font-bold text-orange-400 uppercase">ROP</span>
                </div>

                {/* 3. SAFETY STOCK */}
                <div className="p-3 bg-red-50 rounded-xl border border-red-100">
                    <span className="block text-2xl font-bold text-red-600">{item.safety_stock ?? 0}</span>
                    <span className="text-[10px] font-bold text-red-400 uppercase">Safety Stok</span>
                </div>
            </div>
            
            <button 
                onClick={onClose} 
                className="w-full py-3 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition"
            >
                Tutup
            </button>
        </div>
      </div>
    </div>
  );
}