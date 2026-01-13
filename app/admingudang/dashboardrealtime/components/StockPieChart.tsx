// app/dashboard/components/StockPieChart.tsx
"use client";

import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Card } from "@/components/ui/Card";
import { StockDistribution } from "@/types/realtime";
import { CHART_CONFIG } from "@/lib/realtimeConstans";

interface StockPieChartProps {
  data: StockDistribution[];
}

export function StockPieChart({ data }: StockPieChartProps) {
  return (
    <Card
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <span style={{ fontSize: 12, color: "#888" }}>Distribusi Stok</span>

      <div style={{ flex: 1 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={CHART_CONFIG.PIE_INNER_RADIUS}
              outerRadius={CHART_CONFIG.PIE_OUTER_RADIUS}
              dataKey="value"
            >
              {data.map((d, i) => (
                <Cell key={i} fill={d.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}