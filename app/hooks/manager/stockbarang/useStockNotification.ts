import { useState, useEffect } from "react";
import { StockRequest } from "@/types/stockManager";
import { processManagerAction } from "@/services/stockManagerService";
import { fetchAdminItems } from "@/services/stockAdminService";

export function useStockNotification(
  initialRequests: StockRequest[], 
  setItems: (items: any) => void
) {
  const [requests, setRequests] = useState<StockRequest[]>([]);
  const [currentRequestIndex, setCurrentRequestIndex] = useState(0);
  const [isNotifVisible, setIsNotifVisible] = useState(true);

  // Sinkronisasi state saat data baru masuk dari page utama
  useEffect(() => {
    setRequests(initialRequests);
    if (initialRequests.length > 0) {
      setIsNotifVisible(true);
      // Reset index jika melebihi panjang array baru
      if (currentRequestIndex >= initialRequests.length) {
        setCurrentRequestIndex(0);
      }
    }
  }, [initialRequests]); // Dependency array penting di sini

  const activeRequest = requests.length > 0 ? requests[currentRequestIndex] : null;

  // Logic: Proses (Terima/Tolak)
  const handleProcess = async (action: "APPROVE" | "REJECT") => {
    if (!activeRequest) return;
    
    // Hide UI sementara
    setIsNotifVisible(false);

    try {
      // 1. Panggil Service API
      await processManagerAction({ requestId: activeRequest.id, action });

      // 2. Hapus request yang sudah diproses dari state lokal
      const updatedRequests = requests.filter((r) => r.id !== activeRequest.id);
      setRequests(updatedRequests);

      // 3. Atur notifikasi berikutnya (jika masih ada sisa)
      if (updatedRequests.length > 0) {
        // Logika index agar tidak error jika hapus item terakhir
        let nextIndex = currentRequestIndex;
        if (nextIndex >= updatedRequests.length) {
            nextIndex = 0; 
        }
        setCurrentRequestIndex(nextIndex);
        
        // Munculkan lagi notif setelah animasi selesai (300ms)
        setTimeout(() => setIsNotifVisible(true), 300);
      } else {
        setCurrentRequestIndex(0);
      }

      // 4. Update tabel stok di background jika diapprove
      if (action === "APPROVE") {
        const newItems = await fetchAdminItems();
        setItems(newItems); // Update state tabel di Page utama
        alert(`✅ Stok ${activeRequest.nama_barang} bertambah +${activeRequest.amount}`);
      }

    } catch (error) {
      console.error(error);
      setIsNotifVisible(true); // Munculkan lagi jika error
      alert("Gagal memproses request.");
    }
  };

  // Logic: Tombol Skip (Lihat Nanti)
  const handleSkip = () => {
    if (requests.length > 1) {
      setIsNotifVisible(false);
      setTimeout(() => {
        setCurrentRequestIndex((prev) => (prev + 1) % requests.length);
        setIsNotifVisible(true);
      }, 300);
    } else {
      setIsNotifVisible(false); // Kalau cuma 1, ya tutup aja
    }
  };

  return {
    requests,         // Data request terupdate (lokal)
    activeRequest,    // Request yang sedang tampil
    isNotifVisible,   // Status visibility
    currentIndex: currentRequestIndex,
    handleProcess,    // Fungsi Action
    handleSkip        // Fungsi Skip
  };
}