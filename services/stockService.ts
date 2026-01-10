// services/stockService.ts
import {
  Item,
  StockStatus,
  ItemWithStatus,
  ItemComplete,
  StockDistribution,
  StockSummary,
  StockTrend,
  TimeFilter,
  Notification,
  FSNCategory,
} from "@/types/stock";
import { STOCK_COLORS } from "@/lib/constants";

/**
 * Determine stock status based on business logic
 */
export function getStockStatus(item: Item): StockStatus {
  if (item.jumlah > item.rop) {
    return "aman";
  } else if (
    item.jumlah > item.safetyStock &&
    item.jumlah <= item.rop
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
 */
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
  if (filter === "24H") points = 24;
  if (filter === "1M") points = 30;
  if (filter === "3M") points = 90;
  if (filter === "CUSTOM") points = 12;

  const trendData: StockTrend[] = [];

  for (let i = points - 1; i >= 0; i--) {
    const date = new Date();
    let dateLabel = "";

    if (filter === "24H") {
      date.setHours(date.getHours() - i);
      dateLabel = date.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else {
      date.setDate(date.getDate() - i);
      dateLabel = date.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "2-digit",
      });
    }

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

/**
 * Generate notifications based on stock status and FSN category
 */
export function generateNotifications(
  items: ItemComplete[]
): Notification[] {
  const notifications: Notification[] = [];

  items.forEach((item) => {
    // Prioritaskan notifikasi untuk barang fast moving dengan stok kritis/menipis
    if (item.category === "fast" && item.status === "kritis") {
      notifications.push({
        id: `notif-${item.id}`,
        itemId: item.id,
        itemName: item.name,
        message: `${item.name} tergolong fast moving dengan stok ${item.jumlah} yang sudah tergolong kritis, mohon di pesan!`,
        category: item.category,
        status: item.status,
        currentStock: item.jumlah,
        priority: "high",
      });
    } else if (item.category === "fast" && item.status === "menipis") {
      notifications.push({
        id: `notif-${item.id}`,
        itemId: item.id,
        itemName: item.name,
        message: `${item.name} tergolong fast moving dengan stok ${item.jumlah} yang mulai menipis, segera pesan!`,
        category: item.category,
        status: item.status,
        currentStock: item.jumlah,
        priority: "medium",
      });
    } else if (item.category === "slow" && item.status === "kritis") {
      notifications.push({
        id: `notif-${item.id}`,
        itemId: item.id,
        itemName: item.name,
        message: `${item.name} tergolong slow moving dengan stok ${item.jumlah} yang kritis, pertimbangkan untuk pesan!`,
        category: item.category,
        status: item.status,
        currentStock: item.jumlah,
        priority: "medium",
      });
    } else if (item.status === "kritis" && item.category === "non") {
      notifications.push({
        id: `notif-${item.id}`,
        itemId: item.id,
        itemName: item.name,
        message: `${item.name} memiliki stok ${item.jumlah} yang kritis namun jarang digunakan`,
        category: item.category,
        status: item.status,
        currentStock: item.jumlah,
        priority: "low",
      });
    }
  });

  // Sort by priority: high > medium > low
  return notifications.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
}