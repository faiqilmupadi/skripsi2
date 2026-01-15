"use client";

import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Card } from "@/components/ui/Card";
import { StockDistribution } from "@/types/realtime";

interface StockPieChartProps {
  data: StockDistribution[];
}

export function StockPieChart({ data }: StockPieChartProps) {
  // Custom label renderer jika diperlukan, atau biarkan bersih
  const total = data.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <Card className="h-full p-6 bg-white border border-gray-100 shadow-sm rounded-xl flex flex-col">
      <h3 className="text-lg font-bold text-gray-800 mb-2">Distribusi Kesehatan Stok</h3>
      <p className="text-sm text-gray-500 mb-6">Persentase kondisi barang gudang saat ini</p>
      
      <div className="flex-1 min-h-[250px] relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={70}
              outerRadius={90}
              paddingAngle={2}
              dataKey="value"
              cornerRadius={6}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
              ))}
            </Pie>
            <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                itemStyle={{ color: '#333', fontWeight: 'bold' }}
            />
            <Legend 
              verticalAlign="bottom" 
              height={36} 
              iconType="circle"
              iconSize={10}
              wrapperStyle={{ fontSize: '12px', color: '#666' }}
            />
          </PieChart>
        </ResponsiveContainer>
        
        {/* Center Text */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none mt-[-15px]">
           <span className="text-3xl font-bold text-gray-800 block">{total}</span>
           <span className="text-xs text-gray-400 uppercase font-semibold">Total SKU</span>
        </div>
      </div>
    </Card>
  );
}