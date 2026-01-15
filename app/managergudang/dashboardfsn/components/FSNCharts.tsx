"use client";

import React from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, CartesianGrid
} from "recharts";
import { Card } from "@/components/ui/Card";
import { ItemWithFSN, FSNChartData } from "@/types/fsn";

// --- CHART 1: TOP TURNOVER (Batang) ---
// Saya sesuaikan containernya agar senada dengan desain Pie Chart baru (border gray-100, shadow-sm)
export function TopTurnoverChart({ data }: { data: ItemWithFSN[] }) {
  const chartData = data.map(item => ({
    name: item.nama_barang,
    freq: item.totalOutFreq,
    qty: item.totalOutQty
  }));

  return (
    <Card className="h-full p-6 bg-white border border-gray-100 shadow-sm rounded-xl flex flex-col">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-800 mb-1">Top Barang Sibuk</h3>
        <p className="text-sm text-gray-500">Berdasarkan frekuensi transaksi OUT</p>
      </div>
      <div className="flex-1 min-h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 0, right: 30, left: 10, bottom: 0 }}
            barSize={24}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
            <XAxis type="number" hide />
            <YAxis
              dataKey="name"
              type="category"
              width={130}
              tick={{ fontSize: 12, fill: '#64748b', fontWeight: 500 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              cursor={{ fill: '#f8fafc' }}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            />
            <Bar
              dataKey="freq"
              fill="#10B981"
              radius={[0, 4, 4, 0]}
              name="Frekuensi"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

// --- CHART 2: DISTRIBUSI FSN (Donut) ---
// UPDATED: Menggunakan gaya "Elegan" dari referensi StockPieChart Anda
export function FSNDistributionChart({ data }: { data: FSNChartData[] }) {
  const total = data.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <Card className="h-full p-6 bg-white border border-gray-100 shadow-sm rounded-xl flex flex-col">
      <h3 className="text-lg font-bold text-gray-800 mb-2">Komposisi Stok</h3>
      <p className="text-sm text-gray-500 mb-6">Proporsi kategori FSN</p>

      <div className="flex-1 min-h-[250px] relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={70}
              outerRadius={90}
              paddingAngle={2}
              dataKey="value"
              cornerRadius={6} // Membuat sudut chart melengkung (modern)
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

        {/* Center Text: Persis seperti referensi */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none mt-[-15px]">
           <span className="text-3xl font-bold text-gray-800 block">{total}</span>
           <span className="text-xs text-gray-400 uppercase font-semibold">Total SKU</span>
        </div>
      </div>
    </Card>
  );
}