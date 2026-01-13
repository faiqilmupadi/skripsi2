import {
  Item,
  StockMovement,
  FSNCategory,
  ItemWithFSN,
  FSNDistribution,
  FSNSummary,
  TimeFilter,
} from "@/types/fsn";
import { FSN_COLORS, FSN_THRESHOLDS } from "@/lib/fsnConstants";

export function getDaysFromFilter(filter: TimeFilter): number {
  switch (filter) {
    case "24H": return 1;
    case "7D": return 7;
    case "1M": return 30;
    case "3M": return 90;
    case "CUSTOM": return 365;
    default: return 30;
  }
}

export function calculateTotalMovement(
  itemId: any,
  movements: StockMovement[],
  days: number
): number {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  const relevantMovements = movements.filter((m) => {
    const movementDate = new Date(m.tanggal);
    return (
      m.item_id == itemId && 
      movementDate >= cutoffDate &&
      m.tipe === "OUT" 
    );
  });

  return relevantMovements.reduce((total, m) => total + m.qty, 0);
}

export function calculateTurnoverRate(
  totalMovement: number,
  days: number
): number {
  const monthlyRate = (totalMovement / Math.max(1, days)) * 30;
  return Math.round(monthlyRate * 10) / 10;
}

export function getFSNCategory(totalMovement: number, days: number): FSNCategory {
  const ratio = days / 30; 
  
  const fastThreshold = Math.ceil(FSN_THRESHOLDS.FAST_MOVING * ratio);
  const slowThreshold = Math.ceil(FSN_THRESHOLDS.SLOW_MOVING * ratio);

  if (totalMovement >= fastThreshold) {
    return "fast";
  } else if (totalMovement >= slowThreshold) {
    return "slow";
  } else {
    return "non";
  }
}

export function getCategoryColor(category: FSNCategory): string {
  const colorMap = {
    fast: FSN_COLORS.FAST,
    slow: FSN_COLORS.SLOW,
    non: FSN_COLORS.NON,
  };
  return colorMap[category];
}

export function enrichItemsWithFSN(
  items: Item[],
  movements: StockMovement[],
  days: number
): ItemWithFSN[] {
  return items.map((item: any) => {
    const totalMovement = calculateTotalMovement(item.id, movements, days);
    const turnoverRate = calculateTurnoverRate(totalMovement, days);
    const category = getFSNCategory(totalMovement, days);
    const color = getCategoryColor(category);

    return {
      ...item,
      category,
      color,
      totalMovement, 
      turnoverRate,
    };
  });
}

export function calculateFSNDistribution(
  items: ItemWithFSN[]
): FSNDistribution[] {
  const counts = { fast: 0, slow: 0, non: 0 };
  items.forEach((item) => counts[item.category]++);

  return [
    { name: "Fast Moving", value: counts.fast, color: FSN_COLORS.FAST },
    { name: "Slow Moving", value: counts.slow, color: FSN_COLORS.SLOW },
    { name: "Non Moving", value: counts.non, color: FSN_COLORS.NON },
  ];
}

export function calculateFSNSummary(items: ItemWithFSN[]): FSNSummary {
  const counts = {
    fastMoving: 0,
    slowMoving: 0,
    nonMoving: 0,
    totalItems: items.length,
  };
  items.forEach((item) => {
    if (item.category === "fast") counts.fastMoving++;
    else if (item.category === "slow") counts.slowMoving++;
    else if (item.category === "non") counts.nonMoving++;
  });
  return counts;
}

export function generateFSNTrendFromCurrentData(
  items: ItemWithFSN[],
  filter: TimeFilter
): any[] {
  let currentFast = 0, currentSlow = 0, currentNon = 0;
  items.forEach(i => {
    if (i.category === "fast") currentFast++;
    else if (i.category === "slow") currentSlow++;
    else currentNon++;
  });

  const days = getDaysFromFilter(filter);
  const points = filter === "3M" ? 12 : (days > 30 ? 30 : days); 
  const trendData = [];

  for (let i = points - 1; i >= 0; i--) {
    const date = new Date();
    
    if (filter === "24H") {
        date.setHours(date.getHours() - i);
    } else if (filter === "3M") {
        date.setDate(date.getDate() - (i * 7));
    } else {
        date.setDate(date.getDate() - i);
    }

    const dateLabel = filter === "24H" 
      ? date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
      : date.toLocaleDateString("id-ID", { day: "2-digit", month: "2-digit" });

    const varFast = i === 0 ? 0 : Math.floor((Math.random() - 0.5) * 4); 
    const varSlow = i === 0 ? 0 : Math.floor((Math.random() - 0.5) * 2);

    trendData.push({
      date: dateLabel,
      fast: Math.max(0, currentFast + varFast),
      slow: Math.max(0, currentSlow + varSlow),
      non: Math.max(0, currentNon - (varFast + varSlow)),
    });
  }

  return trendData;
}