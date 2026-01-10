"use client";

import React, { useState, useEffect } from "react";
import { TimeFilterButtons } from "@/components/TimeFilterButtons";
import { StockPieChart } from "./components/StockPieChart";
import { StockSummaryCards } from "./components/StockSummaryCards";
import { StockTrendChart } from "./components/StockTrendChart";
import { TIME_FILTERS } from "@/lib/realtimeConstans";
import { TimeFilter, ItemWithStatus } from "@/types/realtime"; // Pastikan import ItemWithStatus
import { fetchStockItems } from "@/lib/realtime";
import {
  calculateDistribution,
  calculateSummary,
  generateTrendFromCurrentData, // <-- GUNAKAN FUNGSI BARU INI
} from "@/services/realtimeService";

export default function DashboardPage() {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("24H");
  
  // State Data Visualisasi
  const [pieData, setPieData] = useState<any[]>([]);
  const [summaryData, setSummaryData] = useState<any>(null);
  const [trendData, setTrendData] = useState<any[]>([]);
  
  // State Data Mentah (Supaya tidak perlu fetch ulang saat ganti filter)
  const [rawItems, setRawItems] = useState<ItemWithStatus[]>([]);
  
  const [loading, setLoading] = useState(true);

  // 1. Fetch Data Utama saat halaman dimuat
  useEffect(() => {
    loadData();
  }, []);

  // 2. Efek Khusus: Update Trend saat Filter Berubah (Tanpa Fetch Ulang)
  useEffect(() => {
    if (rawItems.length > 0) {
      // Hitung ulang trend berdasarkan filter baru (24H/7D/1M)
      const newTrend = generateTrendFromCurrentData(rawItems, timeFilter);
      setTrendData(newTrend);
    }
  }, [timeFilter, rawItems]); // Akan jalan kalau timeFilter berubah ATAU data baru masuk

  async function loadData() {
    setLoading(true);
    try {
      // A. Fetch data dari API (Data ini SUDAH memiliki status & warna)
      const stockItems = await fetchStockItems();
      
      // B. Simpan ke state mentah
      setRawItems(stockItems); 
      
      // C. Hitung Pie Chart & Summary (Statik)
      setPieData(calculateDistribution(stockItems));
      setSummaryData(calculateSummary(stockItems));
      
      // D. Generate Trend Awal (Sesuai filter default '24H')
      setTrendData(generateTrendFromCurrentData(stockItems, timeFilter));
      
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div style={{ 
        height: "100vh", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center" 
      }}>
        <span>Loading Realtime Data...</span>
      </div>
    );
  }

  return (
    <div
      style={{
        height: "100vh",
        padding: "20px",
        background: "#f8fafc",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        overflow: "hidden",
      }}
    >
      <TimeFilterButtons
        filters={TIME_FILTERS}
        activeFilter={timeFilter}
        onFilterChange={setTimeFilter}
      />

      <div
        style={{
          flex: "0 0 40%",
          display: "grid",
          gridTemplateColumns: "60% 40%",
          gap: "16px",
        }}
      >
        {/* Pie Chart Realtime */}
        <StockPieChart data={pieData} />
        <StockSummaryCards data={summaryData} />
      </div>

      <div style={{ flex: 1 }}>
        {/* Trend Chart dengan Logika Simulasi Realtime */}
        <StockTrendChart data={trendData} growthPercentage={25} />
      </div>
    </div>
  );
}