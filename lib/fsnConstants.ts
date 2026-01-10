// lib/fsnConstants.ts
import { TimeFilter } from "@/types/fsn";

export const TIME_FILTERS: TimeFilter[] = ["24H", "7D", "1M", "3M", "CUSTOM"];

export const FSN_COLORS = {
  FAST: "#2563eb",
  SLOW: "#f59e0b",
  NON: "#ef4444",
} as const;

export const CHART_CONFIG = {
  PIE_INNER_RADIUS: 55,
  PIE_OUTER_RADIUS: 75,
  LINE_STROKE_WIDTH: 2.5,
} as const;

// FSN Analysis Thresholds
export const FSN_THRESHOLDS = {
  FAST_MOVING: 10,  // >= 10 movements in period
  SLOW_MOVING: 3,   // 3-9 movements in period
  NON_MOVING: 3,    // < 3 movements in period
} as const;