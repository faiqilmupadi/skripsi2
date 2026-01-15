import { AlertTriangle } from "lucide-react";

export default function StockWarning({ items }: { items: any[] }) {
    if (items.length === 0) return null;

    return (
        <div className="bg-rose-50 p-6 rounded-xl border border-rose-100 print:border-gray-300 print:bg-white print:break-inside-avoid">
            <h2 className="text-base font-bold text-rose-700 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" /> Stok Perlu Perhatian
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 bg-white border border-rose-100 rounded-lg shadow-sm">
                        <div>
                            <p className="font-bold text-gray-800 text-sm">{item.nama_barang}</p>
                            <p className="text-xs text-rose-500 mt-0.5 font-medium">Min: {item.min_stok}</p>
                        </div>
                        <div className="text-right">
                            <span className="block text-lg font-bold text-rose-700">{item.sisa_stok}</span>
                            <span className="text-[10px] bg-rose-100 px-1.5 py-0.5 rounded text-rose-700 font-bold uppercase tracking-wide">
                                {item.status}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}