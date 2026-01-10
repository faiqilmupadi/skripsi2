// services/stockService.ts
import {
  Item,
  StockStatus,
  ItemWithStatus,
  StockDistribution,
  StockSummary,
  StockTrend, // Ditambahkan
  TimeFilter, // Ditambahkan
} from "@/types/realtime";
import { STOCK_COLORS } from "@/lib/constants";

/**
 * Determine stock status based on business logic
 */
export function getStockStatus(item: Item): StockStatus {
  if (item.stok_saat_ini > item.rop) {
    return "aman";
  } else if (
    item.stok_saat_ini > item.safety_stock &&
    item.stok_saat_ini <= item.rop
  ) {
    return "menipis";
  } else {
    return "kritis";
  }
}

/**
 * Get color based on stock status
 */
export function getStatusColor(status: StockStatus): string {
  const colorMap = {
    aman: STOCK_COLORS.AMAN,
    menipis: STOCK_COLORS.MENIPIS,
    kritis: STOCK_COLORS.KRITIS,
  };
  return colorMap[status];
}

/**
 * Add status and color to stock items
 */
export function enrichStockItems(items: Item[]): ItemWithStatus[] {
  return items.map((item) => {
    const status = getStockStatus(item);
    const color = getStatusColor(status);
    return { ...item, status, color };
  });
}

/**
 * Calculate distribution for pie chart
 */
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
    { name: "Aman", value: counts.aman, color: STOCK_COLORS.AMAN },
    { name: "Menipis", value: counts.menipis, color: STOCK_COLORS.MENIPIS },
    { name: "Kritis", value: counts.kritis, color: STOCK_COLORS.KRITIS },
  ];
}

/**
 * Calculate summary statistics
 */
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

/**
 * Generate trend data from current data (Logic Simulasi)
 * Menggunakan data real hari ini, lalu membuat variasi random mundur ke belakang
 */
export function generateTrendFromCurrentData(
  items: ItemWithStatus[],
  filter: TimeFilter
): StockTrend[] {
  // 1. Hitung Status Real HARI INI
  let currentAman = 0;
  let currentMenipis = 0;
  let currentKritis = 0;

  items.forEach((item) => {
    if (item.status === "aman") currentAman++;
    else if (item.status === "menipis") currentMenipis++;
    else if (item.status === "kritis") currentKritis++;
  });

  // 2. Tentukan jumlah titik data
  let points = 7; // Default 7D
  if (filter === "24H") points = 24;
  if (filter === "1M") points = 30;
  if (filter === "3M") points = 90;
  if (filter === "CUSTOM") points = 12; // Misal custom jadi 12 bulan/minggu

  const trendData: StockTrend[] = [];

  // 3. Loop mundur untuk bikin data dummy
  for (let i = points - 1; i >= 0; i--) {
    const date = new Date();
    let dateLabel = "";

    // LOGIKA TANGGAL & WAKTU
    if (filter === "24H") {
      // Jika filter 24H, kurangi JAM, bukan hari
      date.setHours(date.getHours() - i);
      // Format: "14:00"
      dateLabel = date.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else {
      // Jika filter lain, kurangi HARI
      date.setDate(date.getDate() - i);
      // Format: "10/01"
      dateLabel = date.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "2-digit",
      });
    }

    // LOGIKA "KARANG INDAH" (Variasi Random)
    // Hari ini (i=0) pakai data asli. Hari lalu pakai random variation.
    const variation = i === 0 ? 0 : Math.floor((Math.random() - 0.5) * 5); // Variation range -2 sampai +2

    trendData.push({
      date: dateLabel,
      // Math.max(0, ...) biar angkanya ga minus
      aman: Math.max(0, currentAman + variation),
      menipis: Math.max(0, currentMenipis - variation),
      kritis: Math.max(0, currentKritis + Math.floor(Math.random() * 2)),
    });
  }

  return trendData;
}