"use client";

import { useState, useEffect } from "react";
import { ReportData, ReportFilterType } from "@/types/laporanBarang";
import { fetchReportData } from "@/services/laporanBarangService";
import { Activity, TrendingDown, TrendingUp, AlertTriangle } from "lucide-react";

// Import Komponen UI (Pastikan path folder components ini benar sesuai posisi file kamu)
// Kalau components ada di dalam folder laporanbarang, pakai ./components
import HeaderSection from "./components/HeaderSection";
import SummaryCard from "./components/SummaryCard";
import ReportTables from "./components/ReportTables";
import StockWarning from "./components/StockWarning";

export default function LaporanPage() {
  const [filter, setFilter] = useState<ReportFilterType>("7D");
  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchReportData(filter).then(setData).finally(() => setLoading(false));
  }, [filter]);

  // --- LOGIKA CSV LANGSUNG DISINI (TANPA UTILS) ---
  const handleExportCSV = () => {
    // 1. Cek data
    if (!data || !data.detailedLogs || data.detailedLogs.length === 0) {
        alert("Tidak ada data untuk diekspor.");
        return;
    }
    
    // 2. Header & Judul
    let csv = "Laporan Log Aktivitas Gudang\n";
    csv += `Periode Filter: ${filter === "1D" ? "Hari Ini" : filter === "7D" ? "7 Hari Terakhir" : "30 Hari Terakhir"}\n`;
    csv += `Tanggal Cetak: ${new Date().toLocaleDateString('id-ID')}\n\n`;
    csv += "Tanggal,Jam,Nama Personil,Role,Aksi (Tipe),Nama Barang,Jumlah (Qty),Keterangan Tambahan\n";

    // 3. Isi Data
    data.detailedLogs.forEach(log => {
        const dateObj = new Date(log.tanggal);
        const dateStr = dateObj.toLocaleDateString('id-ID');
        const timeStr = dateObj.toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'});
        const action = log.tipe === 'IN' ? 'Barang Masuk (Restock)' : 'Barang Keluar (Checkout)';
        
        // Bersihkan koma agar CSV rapi
        const cleanItem = log.nama_barang ? log.nama_barang.replace(/,/g, " ") : "-";
        const cleanUser = (log.user_name || "Admin").replace(/,/g, " ");
        const cleanKet = (log.keterangan || "-").replace(/,/g, " ");

        csv += `${dateStr},${timeStr},${cleanUser},${log.user_role},${action},${cleanItem},${log.qty},${cleanKet}\n`;
    });

    // 4. Download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Laporan_Gudang_${filter}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  // ------------------------------------------------

  if (loading) return (
     <div className="h-screen flex flex-col items-center justify-center bg-gray-50 gap-3">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        <span className="text-gray-500 font-medium text-sm">Menyiapkan Laporan...</span>
     </div>
  );

  if (!data) return <div className="p-8 text-center text-red-500">Gagal memuat data laporan.</div>;

  return (
    <div className="min-h-screen bg-gray-50/50 p-8 font-sans text-gray-800 print:bg-white print:p-0">
      
      {/* Panggil fungsi handleExportCSV yang ada di file ini juga */}
      <HeaderSection 
        filter={filter} 
        setFilter={setFilter} 
        onExport={handleExportCSV} 
      />
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
         <SummaryCard 
            title="Total Transaksi" 
            value={data.summary.totalTransaksi} 
            icon={<Activity className="w-5 h-5 text-blue-600" />} 
            color="bg-blue-50 border-blue-100 text-blue-700" 
         />
         <SummaryCard 
            title="Barang Keluar" 
            value={data.summary.totalBarangKeluar} 
            icon={<TrendingDown className="w-5 h-5 text-amber-600" />} 
            color="bg-amber-50 border-amber-100 text-amber-700" 
         />
         <SummaryCard 
            title="Barang Masuk" 
            value={data.summary.totalBarangMasuk} 
            icon={<TrendingUp className="w-5 h-5 text-emerald-600" />} 
            color="bg-emerald-50 border-emerald-100 text-emerald-700" 
         />
         <SummaryCard 
            title="Stok Kritis" 
            value={data.summary.totalStokKritis} 
            icon={<AlertTriangle className="w-5 h-5 text-rose-600" />} 
            color="bg-rose-50 border-rose-100 text-rose-700" 
         />
      </div>

      <ReportTables topItems={data.topMovingItems} topUsers={data.topUsers} />
      <StockWarning items={data.criticalItems} />
    </div>
  );
}