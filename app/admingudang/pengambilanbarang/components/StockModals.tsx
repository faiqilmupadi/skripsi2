import { ItemCheckout } from "@/types/ambil";

interface CheckoutModalProps {
  show: boolean;
  selectedItem: ItemCheckout | null;
  form: { 
    requesterName: string; 
    amount: string 
  };
  onChange: (field: string, value: string) => void;
  onSubmit: () => void;
  onClose: () => void;
  // ✅ TAMBAHKAN 2 BARIS INI (tanda ? artinya opsional)
  title?: string;
  buttonLabel?: string;
}

export const CheckoutModal = ({ 
  show, 
  selectedItem, 
  form, 
  onChange, 
  onSubmit, 
  onClose,
  // ✅ Berikan nilai default jika tidak diisi
  title = "Form Pengambilan",
  buttonLabel = "Submit"
}: CheckoutModalProps) => {
  
  if (!show || !selectedItem) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
        
        {/* ✅ Gunakan variable title di sini */}
        <h2 className="text-xl font-bold text-gray-800 mb-4">{title}</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Barang</label>
            <input 
              disabled 
              value={selectedItem.nama_barang} 
              className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 text-gray-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">User Pelaksana</label>
            <input 
              disabled 
              value={form.requesterName} 
              className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 text-gray-600 font-medium"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Jumlah Ambil (Stok: {selectedItem.stok_saat_ini})
            </label>
            <input 
              type="number" 
              autoFocus
              value={form.amount}
              onChange={(e) => onChange("amount", e.target.value)}
              placeholder="0"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 font-medium"
          >
            Batal
          </button>
          <button 
            onClick={onSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-sm"
          >
            {/* ✅ Gunakan variable buttonLabel di sini */}
            {buttonLabel}
          </button>
        </div>

      </div>
    </div>
  );
};