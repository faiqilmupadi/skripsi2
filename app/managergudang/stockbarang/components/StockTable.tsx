"use client";
import { StockItem } from "@/types/stockAdmin";

interface Props {
  items: StockItem[];
  loading: boolean;
  onEdit: (item: StockItem) => void;
  onDelete: (id: number) => void;
}

export default function StockTable({ items, loading, onEdit, onDelete }: Props) {
  if (loading && items.length === 0) {
    return <div className="p-20 text-center text-gray-400">Memuat data...</div>;
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
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
                  <button onClick={() => onEdit(item)} className="text-blue-600 hover:text-blue-800 font-medium text-sm">Edit</button>
                  <span className="text-gray-300">|</span>
                  <button onClick={() => onDelete(item.id)} className="text-red-600 hover:text-red-800 font-medium text-sm">Hapus</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}