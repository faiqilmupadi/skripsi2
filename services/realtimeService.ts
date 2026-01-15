import {
  Item,
  StockStatus,
  ItemWithStatus,
  StockDistribution,
  StockSummary,
  StockTrend,
  TimeFilter,
} from "@/types/realtime";
import { STOCK_COLORS } from "@/lib/realtimeConstans";

// UPDATE LOGIKA STATUS
export function getStockStatus(item: Item): StockStatus {
  // 3. Kritis: Di bawah atau sama dengan safety stock
  if (item.stok_saat_ini <= item.safety_stock) {
    return "kritis";
  } 
  // 2. Perlu Perhatian: Di bawah ROP tapi masih di atas Safety Stock
  else if (item.stok_saat_ini <= item.rop) {
    return "menipis";
  } 
  // 1. Aman: Di atas ROP (Siap distribusi)
  else {
    return "aman";
  }
}

export function getStatusColor(status: StockStatus): string {
  const colorMap = {
    aman: STOCK_COLORS.AMAN,
    menipis: STOCK_COLORS.MENIPIS,
    kritis: STOCK_COLORS.KRITIS,
  };
  return colorMap[status];
}

export function enrichStockItems(items: Item[]): ItemWithStatus[] {
  return items.map((item) => {
    const status = getStockStatus(item);
    const color = getStatusColor(status);
    return { ...item, status, color };
  });
}

// ... sisa fungsi calculateDistribution dll biarkan sama ...
// Pastikan calculateSummary dan generateTrendFromCurrentData menggunakan status yang sudah diperbarui di atas.
export function calculateDistribution(
    items: ItemWithStatus[]
  ): StockDistribution[] {
    const counts = {
      aman: 0,
      menipis: 0,
      kritis: 0,
    };
  
    items.forEach((item) => {
      counts[item.status]++;
    });
  
    return [
      { name: "Stok Aman", value: counts.aman, color: STOCK_COLORS.AMAN },
      { name: "Menipis", value: counts.menipis, color: STOCK_COLORS.MENIPIS },
      { name: "Kritis", value: counts.kritis, color: STOCK_COLORS.KRITIS },
    ];
  }
  
  export function calculateSummary(items: ItemWithStatus[]): StockSummary {
    const counts = {
      stokAman: 0,
      stokMenipis: 0,
      stokKritis: 0,
      totalStok: items.length,
    };
  
    items.forEach((item) => {
      if (item.status === "aman") counts.stokAman++;
      else if (item.status === "menipis") counts.stokMenipis++;
      else if (item.status === "kritis") counts.stokKritis++;
    });
  
    return counts;
  }

  // ... generateTrendFromCurrentData tetap sama ...
  export function generateTrendFromCurrentData(
    items: ItemWithStatus[],
    filter: TimeFilter
  ): StockTrend[] {
    let currentAman = 0;
    let currentMenipis = 0;
    let currentKritis = 0;
  
    items.forEach((item) => {
      if (item.status === "aman") currentAman++;
      else if (item.status === "menipis") currentMenipis++;
      else if (item.status === "kritis") currentKritis++;
    });
  
    let points = 7;
    if (filter === "24H") points = 12;
    if (filter === "1M") points = 30;
    if (filter === "3M") points = 12;
    if (filter === "CUSTOM") points = 10;
  
    const trendData: StockTrend[] = [];
  
    for (let i = points - 1; i >= 0; i--) {
      const date = new Date();
      let dateLabel = "";
  
      if (filter === "24H") {
        date.setHours(date.getHours() - (i * 2));
        dateLabel = date.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        });
      } else if (filter === "3M") {
         date.setDate(date.getDate() - (i * 7));
         dateLabel = `Week ${points - i}`;
      } else {
        date.setDate(date.getDate() - i);
        dateLabel = date.toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "2-digit",
        });
      }
  
      // Mock historical variation relative to current data
      const variation = i === 0 ? 0 : Math.floor((Math.random() - 0.5) * 5);
  
      trendData.push({
        date: dateLabel,
        aman: Math.max(0, currentAman + variation),
        menipis: Math.max(0, currentMenipis - variation),
        kritis: Math.max(0, currentKritis + Math.floor(Math.random() * 2)),
      });
    }
  
    return trendData;
  }