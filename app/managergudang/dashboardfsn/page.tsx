"use client";

import React, { useState, useEffect } from "react";
import { fetchItems, fetchStockMovements } from "@/lib/fsn";
import { 
  calculateFSN, 
  getFSNSummary, 
  getPieChartData, 
  getTopTurnoverItems 
} from "@/services/fsnService";
import { ItemWithFSN, TimeFilter } from "@/types/fsn";

import { FSNSummaryCards } from "./components/FSNSummaryCards";
import { TopTurnoverChart, FSNDistributionChart } from "./components/FSNCharts";
import { FSNDetailTabs } from "./components/FSNDetailTabs";

export default function FSNPage() {
  const [filter, setFilter] = useState<TimeFilter>("1M");
  const [data, setData] = useState<ItemWithFSN[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
     async function init() {
        setLoading(true);
        try {
           const [items, movements] = await Promise.all([
              fetchItems(),
              fetchStockMovements()
           ]);
           const processedData = calculateFSN(items, movements, filter);
           setData(processedData);
        } catch (err) {
           console.error("Gagal memuat data FSN:", err);
        } finally {
           setLoading(false);
        }
     }
     init();
  }, [filter]);

  const summary = getFSNSummary(data);
  const pieData = getPieChartData(data);
  const topProducts = getTopTurnoverItems(data);

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-gray-50/50">
        <div className="flex flex-col items-center gap-3 bg-white p-8 rounded-2xl shadow-sm">
            <div className="w-10 h-10 border-[3px] border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
            <span className="text-gray-700 font-medium text-sm tracking-wide">Menganalisis Data Gudang...</span>
        </div>
    </div>
  );

  return (
    // UPDATE 1: Padding halaman diperbesar (p-8) dan background dibuat sedikit lebih bersih
    <div className="min-h-screen p-8 bg-gray-50/80 font-sans text-gray-800">
       
       {/* HEADER SECTION */}
       {/* UPDATE 2: items-center untuk alignment vertikal yang pas */}
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
             <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Analisis FSN</h1>
             <p className="text-sm text-gray-500 mt-2 leading-relaxed">Efisiensi perputaran stok & deteksi barang pasif (Dead Stock)</p>
          </div>
          
          {/* Filter Buttons */}
          <div className="bg-white p-1.5 rounded-xl border border-gray-200/80 flex shadow-sm">
             {(["1M", "3M", "6M"] as TimeFilter[]).map((f) => (
                <button
                   key={f}
                   onClick={() => setFilter(f)}
                   className={`px-5 py-2.5 text-sm font-semibold rounded-lg transition-all ${
                      filter === f 
                      ? "bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-indigo-200" 
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                   }`}
                >
                   {f === "1M" ? "30 Hari" : f === "3M" ? "3 Bulan" : "6 Bulan"}
                </button>
             ))}
          </div>
       </div>

       {/* SECTION 1: KPI CARDS */}
       {/* UPDATE 3: Jarak antar section diperbesar (mb-10) */}
       <div className="mb-10">
          <FSNSummaryCards data={summary} />
       </div>

       {/* SECTION 2: CHARTS AREA */}
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10 items-stretch">
          <div className="lg:col-span-2 h-full">
             <TopTurnoverChart data={topProducts} />
          </div>
          <div className="lg:col-span-1 h-full">
             <FSNDistributionChart data={pieData} />
          </div>
       </div>

       {/* SECTION 3: DETAIL TABLE */}
       <div className="grid grid-cols-1">
          <FSNDetailTabs items={data} />
       </div>

    </div>
  );
}