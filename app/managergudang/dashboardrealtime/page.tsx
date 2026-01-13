"use client";

import React, { useState, useEffect } from "react";
import { TimeFilterButtons } from "@/components/TimeFilterButtons";
import { StockPieChart } from "./components/StockPieChart";
import { StockSummaryCards } from "./components/StockSummaryCards";
import { StockTrendChart } from "./components/StockTrendChart";
import { DetailedStockTable } from "./components/DetailedStockTable";
import { TIME_FILTERS } from "@/lib/realtimeConstans";
import { TimeFilter, ItemWithStatus } from "@/types/realtime";
import { fetchStockItems } from "@/lib/realtime";
import {
  calculateDistribution,
  calculateSummary,
  generateTrendFromCurrentData,
} from "@/services/realtimeService";

export default function DashboardPage() {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("24H");
  
  const [pieData, setPieData] = useState<any[]>([]);
  const [summaryData, setSummaryData] = useState<any>(null);
  const [trendData, setTrendData] = useState<any[]>([]);
  const [rawItems, setRawItems] = useState<ItemWithStatus[]>([]);
  
  const [criticalItems, setCriticalItems] = useState<ItemWithStatus[]>([]);
  const [warningItems, setWarningItems] = useState<ItemWithStatus[]>([]);
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (rawItems.length > 0) {
      const newTrend = generateTrendFromCurrentData(rawItems, timeFilter);
      setTrendData(newTrend);
    }
  }, [timeFilter, rawItems]);

  async function loadData() {
    setLoading(true);
    try {
      const stockItems = await fetchStockItems();
      setRawItems(stockItems); 
      
      setPieData(calculateDistribution(stockItems));
      setSummaryData(calculateSummary(stockItems));
      setTrendData(generateTrendFromCurrentData(stockItems, timeFilter));
      
      setCriticalItems(stockItems.filter(i => i.status === "kritis"));
      setWarningItems(stockItems.filter(i => i.status === "menipis"));
      
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <div className="text-blue-600 font-semibold animate-pulse">Memuat Data Dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-slate-50 flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
           <h1 className="text-2xl font-bold text-gray-800">Dashboard Monitoring Stok</h1>
           <p className="text-sm text-gray-500">Real-time update kondisi gudang</p>
        </div>
        <TimeFilterButtons
          filters={TIME_FILTERS}
          activeFilter={timeFilter}
          onFilterChange={setTimeFilter}
        />
      </div>

      {summaryData && <StockSummaryCards data={summaryData} />}

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-8">
          <StockTrendChart data={trendData} />
        </div>
        <div className="col-span-4">
          <StockPieChart data={pieData} />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-6">
          <DetailedStockTable 
            title="⚠️ Barang Kritis (Segera Restock)" 
            items={criticalItems} 
            type="critical" 
          />
        </div>
        <div className="col-span-6">
           <DetailedStockTable 
            title="⚡ Barang Menipis (Warning)" 
            items={warningItems} 
            type="warning" 
          />
        </div>
      </div>
    </div>
  );
}