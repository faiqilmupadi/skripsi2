"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card } from "@/components/ui/Card";
import { FSNTrend } from "@/types/fsn";
import { FSN_COLORS, CHART_CONFIG } from "@/lib/fsnConstants";

interface FSNTrendChartProps {
  data: any[];
  growthPercentage?: number;
}

export function FSNTrendChart({
  data,
  growthPercentage = 25,
}: FSNTrendChartProps) {
  return (
    <Card
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <div style={{ marginBottom: "8px" }}>
        <strong style={{ fontSize: 15 }}>Tren FSN</strong>
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

      <div style={{ flex: 1, minHeight: "250px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Line
              dataKey="fast"
              stroke={FSN_COLORS.FAST}
              strokeWidth={CHART_CONFIG.LINE_STROKE_WIDTH}
              dot={false}
            />
            <Line
              dataKey="slow"
              stroke={FSN_COLORS.SLOW}
              strokeWidth={CHART_CONFIG.LINE_STROKE_WIDTH}
              dot={false}
            />
            <Line
              dataKey="non"
              stroke={FSN_COLORS.NON}
              strokeWidth={CHART_CONFIG.LINE_STROKE_WIDTH}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}