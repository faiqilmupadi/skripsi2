// app/managergudang/stockbarang/components/NotificationCards.tsx
import { Notification } from "@/types/stock";
import { 
  CheckCircleIcon,    // Ikon untuk "Sudah Dipesan"
  EyeIcon,            // Ikon untuk "Sudah Dibaca"
  ExclamationTriangleIcon 
} from "@heroicons/react/24/solid";

interface NotificationCardsProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;    // Sementara
  onMarkAsOrdered: (id: string) => void; // Permanen
}

export default function NotificationCards({
  notifications,
  onMarkAsRead,
  onMarkAsOrdered,
}: NotificationCardsProps) {

  // ... (getPriorityStyle tetap sama) ...
  const getPriorityStyle = (priority: "high" | "medium" | "low") => {
      switch (priority) {
        case "high": return "bg-red-50 border-red-200 text-red-900";
        case "medium": return "bg-orange-50 border-orange-200 text-orange-900";
        case "low": return "bg-blue-50 border-blue-200 text-blue-900";
      }
  };

  if (notifications.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 space-y-3 z-50 w-full max-w-md">
      {notifications.map((notif) => (
        <div
          key={notif.id}
          className={`flex flex-col p-4 rounded-lg border shadow-lg transition-all animate-slide-in-right ${getPriorityStyle(notif.priority)}`}
        >
          <div className="flex items-start">
            {/* Ikon Peringatan */}
            <div className="flex-shrink-0 mt-0.5">
              <ExclamationTriangleIcon className={`w-6 h-6 ${
                  notif.priority === 'high' ? 'text-red-500' : 
                  notif.priority === 'medium' ? 'text-orange-500' : 'text-blue-500'
              }`} />
            </div>

            {/* Isi Pesan */}
            <div className="ml-3 flex-1">
              <p className="text-sm font-bold">{notif.itemName}</p>
              <p className="text-xs mt-1 leading-relaxed opacity-90">
                {notif.message}
              </p>
              <div className="flex gap-2 mt-2">
                  <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 bg-white/50 rounded border border-black/10">
                      {notif.category}
                  </span>
                  <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 bg-white/50 rounded border border-black/10">
                      {notif.status}
                  </span>
              </div>
            </div>
          </div>

          {/* AREA TOMBOL AKSI (Dua Tombol Sejajar) */}
          <div className="mt-3 flex gap-2 pl-9">
            
            {/* 1. TOMBOL SUDAH DIBACA (SEMENTARA) */}
            <button
              onClick={() => onMarkAsRead(notif.id)}
              className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 bg-white/60 hover:bg-white rounded text-xs font-semibold text-gray-600 hover:text-gray-800 transition-colors border border-black/5"
              title="Hilangkan sementara (Muncul lagi jika refresh)"
            >
              <EyeIcon className="w-4 h-4" />
              Sudah Dibaca
            </button>

            {/* 2. TOMBOL SUDAH DIPESAN (PERMANEN) */}
            <button
              onClick={() => onMarkAsOrdered(notif.id)}
              className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 bg-green-100 hover:bg-green-200 rounded text-xs font-semibold text-green-700 hover:text-green-900 transition-colors border border-green-200"
              title="Tandai barang sudah dipesan (Hilang permanen)"
            >
              <CheckCircleIcon className="w-4 h-4" />
              Sudah Dipesan
            </button>

          </div>
        </div>
      ))}
    </div>
  );
}