"use client";

import React from "react";
// 1. Import komponen dari Recharts (Ini yang hilang tadi)
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// 2. Import komponen lokal (Pastikan path-nya sesuai projek kamu)
import { Card } from "@/ui/Card"; 
import { StockTrend } from "@/types/realtime";
import { STOCK_COLORS, CHART_CONFIG } from "@/lib/constants";

interface StockTrendChartProps {
  data: StockTrend[];
  growthPercentage?: number;
}

export function StockTrendChart({
  data,
  growthPercentage = 25,
}: StockTrendChartProps) {
  return (
    <Card
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%", // Agar Card memenuhi container
      }}
    >
      <div style={{ marginBottom: "8px" }}>
        <strong style={{ fontSize: 15 }}>Tren Stok</strong>
        <span
          style={{
            marginLeft: "8px",
            color: "#10b981",
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          ↑ {growthPercentage}%
        </span>
      </div>

      {/* Bagian styling agar chart muncul */}
      <div style={{ flex: 1, minHeight: "250px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Line
              dataKey="aman"
              stroke={STOCK_COLORS.AMAN}
              strokeWidth={CHART_CONFIG.LINE_STROKE_WIDTH}
              dot={false}
            />
            <Line
              dataKey="menipis"
              stroke={STOCK_COLORS.MENIPIS}
              strokeWidth={CHART_CONFIG.LINE_STROKE_WIDTH}
              dot={false}
            />
            <Line
              dataKey="kritis"
              stroke={STOCK_COLORS.KRITIS}
              strokeWidth={CHART_CONFIG.LINE_STROKE_WIDTH}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}