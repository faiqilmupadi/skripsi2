// lib/constants.ts
import { TimeFilter } from "@/types/realtime";

export const TIME_FILTERS: TimeFilter[] = ["24H", "7D", "1M", "3M", "CUSTOM"];

export const STOCK_COLORS = {
  AMAN: "#2563eb",
  MENIPIS: "#f59e0b",
  KRITIS: "#ef4444",
} as const;

export const CHART_CONFIG = {
  PIE_INNER_RADIUS: 55,
  PIE_OUTER_RADIUS: 75,
  LINE_STROKE_WIDTH: 2.5,
} as const;