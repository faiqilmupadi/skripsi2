
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
import { STOCK_COLORS } from "@/lib/realtimeConstans";

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

 export function generateNotifications(items: ItemComplete[]): Notification[] {
  const notifications: Notification[] = [];

  items.forEach((item) => {
    if (item.status === "aman") return;
    const uniqueId = `notif-${item.id}-${item.status}`;

    // 1. FAST MOVING
    if (item.category === "fast") {
      if (item.status === "kritis") {
        notifications.push({
          id: uniqueId,
          itemId: item.id,
          itemName: item.nama_barang,
          message: `URGENT! ${item.nama_barang} (Fast Moving) sisa ${item.stok_saat_ini}. Stok KRITIS, segera pesan sekarang!`,
          category: item.category,
          status: item.status,
          currentStock: item.stok_saat_ini,
          priority: "high",
        });
      } else if (item.status === "menipis") {
        notifications.push({
          id: uniqueId,
          itemId: item.id,
          itemName: item.nama_barang,
          message: `Info: ${item.nama_barang} (Fast Moving) sisa ${item.stok_saat_ini}. Stok mulai menipis.`,
          category: item.category,
          status: item.status,
          currentStock: item.stok_saat_ini,
          priority: "medium",
        });
      }
    } 
    // 2. SLOW MOVING
    else if (item.category === "slow" && item.status === "kritis") {
      notifications.push({
        id: uniqueId,
        itemId: item.id,
        itemName: item.nama_barang,
        message: `Peringatan: ${item.nama_barang} (Slow Moving) sisa ${item.stok_saat_ini}. Sudah masuk batas kritis.`,
        category: item.category,
        status: item.status,
        currentStock: item.stok_saat_ini,
        priority: "medium",
      });
    } 
    // 3. NON MOVING
    else if (item.category === "non" && item.status === "kritis") {
      notifications.push({
        id: uniqueId,
        itemId: item.id,
        itemName: item.nama_barang,
        message: `${item.nama_barang} sisa ${item.stok_saat_ini} (Kritis). Santai saja, barang jarang keluar.`,
        category: item.category,
        status: item.status,
        currentStock: item.stok_saat_ini,
        priority: "low",
      });
    }
  });

  // Sort: High priority paling atas
  return notifications.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
}