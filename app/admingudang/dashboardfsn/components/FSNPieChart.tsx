"use client";

import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Card } from "@/ui/Card";
import { FSNDistribution } from "@/types/fsn";
import { CHART_CONFIG } from "@/lib/fsnConstants";

interface FSNPieChartProps {
  data: FSNDistribution[];
}

export function FSNPieChart({ data }: FSNPieChartProps) {
  return (
    <Card
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <span style={{ fontSize: 12, color: "#888" }}>Distribusi FSN</span>

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