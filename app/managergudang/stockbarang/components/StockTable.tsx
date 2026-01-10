import { ItemComplete } from "@/types/stock";
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon, MinusIcon } from "@heroicons/react/24/solid";

interface StockTableProps {
  items: ItemComplete[];
  onEdit: (item: ItemComplete) => void;
  onDelete: (item: ItemComplete) => void;
}

export default function StockTable({ items, onEdit, onDelete }: StockTableProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 font-semibold text-gray-700">Nama Barang</th>
              <th className="px-6 py-4 font-semibold text-gray-700">Kategori FSN</th>
              <th className="px-6 py-4 font-semibold text-gray-700">Stok Saat Ini</th>
              <th className="px-6 py-4 font-semibold text-gray-700">ROP</th>
              <th className="px-6 py-4 font-semibold text-gray-700">Status</th>
              <th className="px-6 py-4 font-semibold text-gray-700">Turnover</th>
              <th className="px-6 py-4 font-semibold text-gray-700 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {items.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                  Tidak ada data barang.
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {item.nama_barang}
                    <div className="text-xs text-gray-400 mt-0.5 font-normal">
                      ID: {item.id} • {item.satuan}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className="px-2.5 py-1 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor: `${item.categoryColor}20`,
                        color: item.categoryColor,
                      }}
                    >
                      {item.category === "fast" && "Fast Moving"}
                      {item.category === "slow" && "Slow Moving"}
                      {item.category === "non" && "Non Moving"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{item.stok_saat_ini}</div>
                    <div className="text-xs text-gray-500">Safety: {item.safety_stock}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{item.rop}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${item.statusColor.replace("text-", "bg-")}`}
                      ></div>
                      <span className={`font-medium ${item.statusColor}`}>
                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      {item.category === "fast" ? (
                        <ArrowTrendingUpIcon className="w-4 h-4 text-green-500" />
                      ) : item.category === "slow" ? (
                        <ArrowTrendingDownIcon className="w-4 h-4 text-orange-500" />
                      ) : (
                        <MinusIcon className="w-4 h-4 text-gray-400" />
                      )}
                      <span className="font-medium text-gray-700">{item.turnoverRate}x</span>
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">per bulan</div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => onEdit(item)}
                        className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => onDelete(item)}
                        className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
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