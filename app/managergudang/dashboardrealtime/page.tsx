"use client";

import React, { useState, useEffect } from "react";
import { StockPieChart } from "./components/StockPieChart";
import { StockSummaryCards } from "./components/StockSummaryCards";
import { AdminActivityChart } from "./components/AdminActivityChart"; 
import { DetailedStockTable } from "./components/DetailedStockTable";
import { ItemWithStatus } from "@/types/realtime";
import { fetchStockItems } from "@/lib/realtime";
import { calculateDistribution, calculateSummary } from "@/services/realtimeService";

export default function DashboardPage() {
  const [pieData, setPieData] = useState<any[]>([]);
  const [summaryData, setSummaryData] = useState<any>(null);
  
  const [criticalItems, setCriticalItems] = useState<ItemWithStatus[]>([]);
  const [warningItems, setWarningItems] = useState<ItemWithStatus[]>([]);
  const [safeItems, setSafeItems] = useState<ItemWithStatus[]>([]); // STATE BARU
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const stockItems = await fetchStockItems();
      
      setPieData(calculateDistribution(stockItems));
      setSummaryData(calculateSummary(stockItems));
      
      // Filter logic
      setCriticalItems(stockItems.filter((i) => i.status === "kritis"));
      setWarningItems(stockItems.filter((i) => i.status === "menipis"));
      setSafeItems(stockItems.filter((i) => i.status === "aman")); // FILTER AMAN
      
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50 text-xs text-gray-500">
        Memuat Data...
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-[#FAFAFA] font-sans text-gray-800">
      
      <div className="mb-6">
           <h1 className="text-xl font-bold text-gray-900">Dashboard Gudang</h1>
           <p className="text-xs text-gray-500">Overview real-time stok & aktivitas</p>
      </div>

      {summaryData && (
        <div className="mb-6">
            <StockSummaryCards data={summaryData} />
        </div>
      )}

      <div className="grid grid-cols-12 gap-6 mb-6">
        <div className="col-span-12 lg:col-span-7">
            <AdminActivityChart /> 
        </div>
        <div className="col-span-12 lg:col-span-5">
          <StockPieChart data={pieData} />
        </div>
      </div>

      {/* Baris Tabel Prioritas (Kritis & Menipis) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <DetailedStockTable 
            title="Barang Kritis" 
            subtitle="Segera lakukan restock"
            items={criticalItems} 
            type="critical" 
        />
        
        <DetailedStockTable 
            title="Stok Menipis" 
            subtitle="Mendekati batas ROP"
            items={warningItems} 
            type="warning" 
        />
      </div>

      {/* Baris Tabel Stok Aman (Full Width di Bawah) */}
      <div className="w-full">
         <DetailedStockTable 
            title="Stok Aman / Sehat" 
            subtitle="Siap didistribusikan ke unit kerja"
            items={safeItems} 
            type="aman" 
        />
      </div>

    </div>
  );
}