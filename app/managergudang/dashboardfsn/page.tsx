"use client";

import React, { useState, useEffect } from "react";
import { TimeFilterButtons } from "@/components/TimeFilterButtons";
import { FSNPieChart } from "./components/FSNPieChart";
import { FSNSummaryCards } from "./components/FSNSummaryCards";
import { FSNTrendChart } from "./components/FSNTrendChart";
import { TIME_FILTERS } from "@/lib/fsnConstants";
import { TimeFilter, Item, StockMovement } from "@/types/fsn";
import { fetchItems, fetchStockMovements } from "@/lib/fsn";
import {
  enrichItemsWithFSN,
  calculateFSNDistribution,
  calculateFSNSummary,
  generateFSNTrendFromCurrentData,
  getDaysFromFilter
} from "@/services/fsnService";

export default function FSNPage() {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("1M");
  const [pieData, setPieData] = useState<any[]>([]);
  const [summaryData, setSummaryData] = useState<any>(null);
  const [trendData, setTrendData] = useState<any[]>([]);
  const [rawItems, setRawItems] = useState<Item[]>([]);
  
  // Kita simpan movements yang sudah difilter 'OUT' saja di state
  const [outMovements, setOutMovements] = useState<StockMovement[]>([]); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function initData() {
      setLoading(true);
      try {
        const items = await fetchItems();
        const allMovements = await fetchStockMovements();
        
        // FILTER DATA: Hanya ambil tipe "OUT" (Penjualan/Pemakaian)
        // Ini memastikan logic FSN bersih dari data Restock
        const onlyOutMovements = allMovements.filter((m: StockMovement) => m.tipe === "OUT");
        
        setRawItems(items);
        setOutMovements(onlyOutMovements);
        
        processData(items, onlyOutMovements, "1M");
      } catch (error) {
        console.error("Error loading FSN data:", error);
      } finally {
        setLoading(false);
      }
    }
    initData();
  }, []);

  useEffect(() => {
    if (rawItems.length > 0) {
      // Gunakan outMovements yang sudah difilter
      processData(rawItems, outMovements, timeFilter);
    }
  }, [timeFilter]); // Hapus dependency rawMovements karena kita pakai outMovements

  function processData(items: Item[], movements: StockMovement[], filter: TimeFilter) {
    const days = getDaysFromFilter(filter);
    
    // Service akan menghitung usage rate dari movements yang diberikan
    const enrichedItems = enrichItemsWithFSN(items, movements, days);

    setPieData(calculateFSNDistribution(enrichedItems));
    setSummaryData(calculateFSNSummary(enrichedItems));
    setTrendData(generateFSNTrendFromCurrentData(enrichedItems, filter));
  }

  if (loading) {
    return (
      <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span>Loading FSN Analysis...</span>
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
        <FSNPieChart data={pieData} />
        {/* Summary Card akan menampilkan data yang lebih akurat karena berbasis qty keluar */}
        <FSNSummaryCards data={summaryData} />
      </div>

      <div style={{ flex: 1 }}>
        <FSNTrendChart data={trendData} growthPercentage={15} />
      </div>
    </div>
  );
}