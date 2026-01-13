"use client";

import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Card } from "@/components/ui/Card";
import { StockDistribution } from "@/types/realtime";

interface StockPieChartProps {
  data: StockDistribution[];
}

export function StockPieChart({ data }: StockPieChartProps) {
  return (
    <Card className="h-full p-6 border-none shadow-sm flex flex-col">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Distribusi Kondisi</h3>
      
      <div className="flex-1 min-h-[250px] relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={60}
              outerRadius={85}
              paddingAngle={5}
              dataKey="value"
              cornerRadius={5}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
              ))}
            </Pie>
            <Tooltip />
            <Legend 
              verticalAlign="bottom" 
              height={36} 
              iconType="circle"
              layout="horizontal"
            />
          </PieChart>
        </ResponsiveContainer>
        
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none mb-6">
           <span className="text-2xl font-bold text-gray-800">
             {data.reduce((acc, curr) => acc + curr.value, 0)}
           </span>
           <p className="text-xs text-gray-500">Total Item</p>
        </div>
      </div>
    </Card>
  );
}