import { ItemCheckout } from "@/types/ambil";
// Pastikan install lucide-react: npm i lucide-react
import { ShoppingBag, Eye } from "lucide-react"; 

interface StockTableProps {
  items: ItemCheckout[];
  onCheckout: (item: ItemCheckout) => void;
  mode?: "checkout" | "info"; // ✅ Tambah Prop Mode
}

export default function StockTable({ items, onCheckout, mode = "checkout" }: StockTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Nama Barang</th>
            <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">ROP</th>
            <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Jumlah</th>
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Created At</th>
            <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Action</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {items.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                {item.nama_barang}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                {item.rop ?? "-"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-bold text-gray-800">
                {item.stok_saat_ini}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-400">
                9/1/2026, 19.29.48 {/* Hardcode sementara sesuai gambar */}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                <button
                  onClick={() => onCheckout(item)}
                  className={`p-2 rounded-lg transition-colors shadow-sm ${
                    mode === "checkout" 
                      ? "text-blue-600 bg-blue-50 hover:bg-blue-100" // Warna Tas
                      : "text-purple-600 bg-purple-50 hover:bg-purple-100" // Warna Mata
                  }`}
                  title={mode === "checkout" ? "Ambil Barang" : "Lihat Detail"}
                >
                  {/* LOGIKA GANTI ICON */}
                  {mode === "checkout" ? (
                    <ShoppingBag className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}