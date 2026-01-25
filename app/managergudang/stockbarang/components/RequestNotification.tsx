"use client";
import { StockRequest } from "@/types/stockManager";

interface Props {
  request: StockRequest;
  index: number;
  total: number;
  isVisible: boolean;
  onProcess: (action: "APPROVE" | "REJECT") => void;
  onSkip: () => void;
}

export default function RequestNotification({ request, index, total, isVisible, onProcess, onSkip }: Props) {
  if (!request || !isVisible) return null;

  return (
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
            {index + 1} / {total}
          </span>
        </div>

        {/* Content */}
        <div className="p-5 bg-white">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Barang Masuk</p>
              <p className="text-gray-800 font-bold text-xl leading-tight">{request.nama_barang}</p>
              <p className="text-xs text-gray-500 mt-1">Oleh: <span className="font-semibold">{request.requester_name}</span></p>
            </div>
            <div className="text-right bg-orange-50 px-4 py-2 rounded-xl border border-orange-100">
              <span className="text-2xl font-bold text-orange-600 block">+{request.amount}</span>
              <span className="text-[10px] text-gray-500 font-medium uppercase">{request.satuan || 'Unit'}</span>
            </div>
          </div>

          {request.supplier_name && (
            <div className="text-xs bg-gray-50 p-3 rounded-lg text-gray-600 border border-gray-100 flex items-center gap-2 mb-4">
              🏭 Supplier: <b className="text-gray-800">{request.supplier_name}</b>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button 
              onClick={() => onProcess("APPROVE")}
              className="flex-1 bg-green-600 text-white py-3 rounded-xl text-sm font-bold hover:bg-green-700 transition shadow-lg shadow-green-100 flex items-center justify-center gap-2"
            >
              ✅ Terima Barang
            </button>
            <button 
              onClick={onSkip}
              className="px-4 bg-gray-100 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-200 transition"
            >
              ⏭
            </button>
          </div>
          <button 
            onClick={() => onProcess("REJECT")}
            className="w-full mt-3 text-xs text-red-400 hover:text-red-600 py-1 transition-colors"
          >
            Tolak Permintaan ini
          </button>
        </div>
      </div>
    </div>
  );
}