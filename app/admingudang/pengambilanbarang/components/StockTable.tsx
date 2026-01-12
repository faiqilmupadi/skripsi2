import { ItemCheckout } from "@/types/ambil";
import { ShoppingBagIcon } from "@heroicons/react/24/outline";

interface StockTableProps {
  items: ItemCheckout[];
  onCheckout: (item: ItemCheckout) => void;
}

export default function StockTable({ items, onCheckout }: StockTableProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500 font-bold tracking-wider">
            <tr>
              <th className="px-6 py-5">Name</th>
              <th className="px-6 py-5">ROP</th>
              <th className="px-6 py-5">Jumlah</th>
              <th className="px-6 py-5">Created At</th>
              <th className="px-6 py-5 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {items.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-gray-400">
                  Tidak ada barang tersedia.
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/80 transition-colors group">
                  <td className="px-6 py-4 font-medium text-gray-700">
                    {item.nama_barang}
                  </td>
                  <td className="px-6 py-4 text-gray-500 font-medium">
                    {item.rop}
                  </td>
                  <td className="px-6 py-4 text-gray-700 font-bold">
                    {item.stok_saat_ini}
                  </td>
                  <td className="px-6 py-4 text-gray-400 text-xs">
                    {new Date(item.created_at).toLocaleString('id-ID')}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => onCheckout(item)}
                      className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
                      title="Checkout Barang Ini"
                    >
                      <ShoppingBagIcon className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}