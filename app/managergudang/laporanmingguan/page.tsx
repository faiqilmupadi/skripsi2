"use client";

import { useState, useEffect } from "react";
import { WeeklyReportData } from "@/types/report";
import { fetchWeeklyReport } from "@/lib/report";

export default function LaporanMingguanPage() {
  const [data, setData] = useState<WeeklyReportData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const reportData = await fetchWeeklyReport();
      setData(reportData);
      setLoading(false);
    }
    load();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-gray-500 animate-pulse">Menyiapkan Laporan Mingguan...</p>
      </div>
    );
  }

  if (!data) return <p className="p-8 text-red-500">Gagal memuat laporan.</p>;

  // Hitung tanggal minggu ini
  const today = new Date();
  const lastWeek = new Date();
  lastWeek.setDate(today.getDate() - 7);
  const dateOptions: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };

  return (
    <div className="p-8 bg-gray-50 min-h-screen print:bg-white print:p-0">
      {/* HEADER */}
      <div className="flex justify-between items-start mb-8 print:mb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Laporan Mingguan Gudang</h1>
          <p className="text-gray-500 mt-1">
            Periode: {lastWeek.toLocaleDateString("id-ID", dateOptions)} - {today.toLocaleDateString("id-ID", dateOptions)}
          </p>
        </div>
        <button
          onClick={handlePrint}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition print:hidden"
        >
          🖨️ Cetak Laporan
        </button>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <SummaryCard title="Total Transaksi" value={data.summary.totalTransaksi} color="bg-blue-50 text-blue-600" />
        <SummaryCard title="Barang Keluar (Qty)" value={data.summary.totalBarangKeluar} color="bg-red-50 text-red-600" />
        <SummaryCard title="Barang Masuk (Order)" value={data.summary.totalBarangMasuk} color="bg-green-50 text-green-600" />
        <SummaryCard title="Item Kritis" value={data.summary.totalStokKritis} color="bg-yellow-50 text-yellow-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* 1. TOP MOVING ITEMS */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 print:shadow-none print:border">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            🚀 Barang Paling Sering Keluar
          </h2>
          <div className="space-y-4">
            {data.topMovingItems.length === 0 ? (
              <p className="text-gray-400 text-sm">Tidak ada pergerakan minggu ini.</p>
            ) : (
              data.topMovingItems.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-700">{item.nama_barang}</p>
                    <div className="w-48 h-2 bg-gray-100 rounded-full mt-1 overflow-hidden">
                      <div 
                        className="h-full bg-blue-500" 
                        style={{ width: `${Math.min((item.total_qty / data.topMovingItems[0].total_qty) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className="font-bold text-gray-800">{item.total_qty} <span className="text-xs font-normal text-gray-500">{item.satuan}</span></span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 2. TOP ACTIVE USERS */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 print:shadow-none print:border">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            👷 User Paling Aktif
          </h2>
          <table className="w-full text-sm text-left text-gray-600">
            <thead className="bg-gray-50 text-gray-700 uppercase">
              <tr>
                <th className="px-4 py-2">Nama</th>
                <th className="px-4 py-2">Role</th>
                <th className="px-4 py-2 text-right">Aktivitas</th>
              </tr>
            </thead>
            <tbody>
              {data.topUsers.length === 0 ? (
                 <tr><td colSpan={3} className="text-center py-4 text-gray-400">Data tidak tersedia</td></tr>
              ) : (
                data.topUsers.map((user, idx) => (
                  <tr key={idx} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-800">{user.nama}</td>
                    <td className="px-4 py-3 text-xs">
                        <span className="bg-gray-100 px-2 py-1 rounded-md">{user.role}</span>
                    </td>
                    <td className="px-4 py-3 text-right font-bold">{user.total_activity}x</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. CRITICAL STOCK ALERT */}
      <div className="mt-8 bg-white p-6 rounded-xl shadow-sm border border-red-100 print:shadow-none print:border-gray-300">
        <h2 className="text-lg font-bold text-red-600 mb-4 flex items-center gap-2">
          ⚠️ Perlu Restock Segera (Stok Kritis)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.criticalItems.length === 0 ? (
             <p className="text-green-500 text-sm">Semua stok aman!</p>
          ) : (
            data.criticalItems.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100 print:border-gray-200">
                <span className="font-medium text-gray-800">{item.nama_barang}</span>
                <div className="text-right">
                  <p className="text-xl font-bold text-red-600">{item.sisa_stok}</p>
                  <p className="text-xs text-red-400 uppercase tracking-wider">{item.status}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}

// Komponen Kecil untuk Kartu Summary
function SummaryCard({ title, value, color }: { title: string, value: number, color: string }) {
  return (
    <div className={`p-6 rounded-xl ${color} print:border print:border-gray-200 print:bg-white`}>
      <p className="text-sm font-medium opacity-80 print:text-gray-600">{title}</p>
      <p className="text-3xl font-bold mt-1 print:text-black">{value}</p>
    </div>
  );
}