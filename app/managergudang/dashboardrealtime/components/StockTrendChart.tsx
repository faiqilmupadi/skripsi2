"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";
import { Card } from "@/components/ui/Card";
import { StockTrend } from "@/types/realtime";
import { STOCK_COLORS } from "@/lib/realtimeConstans";

interface StockTrendChartProps {
  data: StockTrend[];
}

export function StockTrendChart({ data }: StockTrendChartProps) {
  return (
    <Card className="h-full p-6 border-none shadow-sm flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-800">Tren Pergerakan Stok</h3>
          <p className="text-sm text-gray-500">Pemantauan konsistensi level stok</p>
        </div>
      </div>

      <div className="flex-1 min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barSize={20}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis 
              dataKey="date" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: '#888' }} 
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: '#888' }} 
            />
            <Tooltip 
              cursor={{ fill: '#f4f4f5' }}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            />
            <Legend verticalAlign="top" height={36} iconType="circle"/>
            
            <Bar 
              name="Aman" 
              dataKey="aman" 
              stackId="a" 
              fill={STOCK_COLORS.AMAN} 
              radius={[0, 0, 4, 4]} 
            />
            <Bar 
              name="Menipis" 
              dataKey="menipis" 
              stackId="a" 
              fill={STOCK_COLORS.MENIPIS} 
            />
            <Bar 
              name="Kritis" 
              dataKey="kritis" 
              stackId="a" 
              fill={STOCK_COLORS.KRITIS} 
              radius={[4, 4, 0, 0]} 
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}