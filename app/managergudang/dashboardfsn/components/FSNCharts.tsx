"use client";

import React from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, CartesianGrid
} from "recharts";
import { Card } from "@/components/ui/Card";
import { ItemWithFSN, FSNChartData } from "@/types/fsn";

// --- CHART 1: TOP TURNOVER (Batang) ---
export function TopTurnoverChart({ data }: { data: ItemWithFSN[] }) {
  const chartData = data.map(item => ({
    name: item.nama_barang,
    freq: item.totalOutFreq,
    qty: item.totalOutQty
  }));

  return (
    <Card className="p-6 h-full bg-white shadow-sm border-none rounded-xl">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900">Top Barang Sibuk</h3>
        <p className="text-sm text-gray-500">Berdasarkan frekuensi transaksi OUT</p>
      </div>
      <div className="h-[320px] w-full">
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
// UPDATED: Chart Tengah, Legenda Bawah Horizontal
export function FSNDistributionChart({ data }: { data: FSNChartData[] }) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload;
      const percent = total > 0 ? ((dataPoint.value / total) * 100).toFixed(1) : 0;
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-100">
          <p className="text-sm font-bold" style={{ color: dataPoint.color }}>{dataPoint.name}</p>
          <div className="flex gap-2 items-end">
             <p className="text-xl font-bold leading-none">{dataPoint.value}</p>
             <span className="text-xs text-gray-500">Item ({percent}%)</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="p-6 h-full bg-white shadow-sm border-none rounded-xl flex flex-col">
      <div className="mb-2 text-center md:text-left">
        <h3 className="text-lg font-bold text-gray-900">Komposisi Stok</h3>
        <p className="text-sm text-gray-500">Proporsi kategori FSN</p>
      </div>

      <div className="flex-1 min-h-[320px] relative w-full flex flex-col justify-center items-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={80} // Diperbesar sedikit biar teks tengah muat
              outerRadius={105}
              paddingAngle={4}
              dataKey="value"
              cx="50%" // Posisi Tengah Horizontal
              cy="45%" // Posisi Tengah Vertikal (sedikit ke atas biar muat legenda)
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            
            {/* LEGENDA DI BAWAH (Horizontal) */}
            <Legend
              verticalAlign="bottom"
              align="center"
              layout="horizontal" 
              iconType="circle"
              iconSize={10}
              wrapperStyle={{ paddingTop: "20px" }} // Jarak dari chart
              formatter={(value, entry: any) => (
                <span className="text-sm text-gray-600 font-medium ml-1 mr-3">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Teks Total di Tengah Donut */}
        {/* Kita atur posisinya absolute di tengah chart, bukan container */}
        <div className="absolute top-[45%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
          <span className="text-4xl font-extrabold text-gray-800 block leading-none">
            {total}
          </span>
          <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mt-1">
            Total SKU
          </p>
        </div>
      </div>
    </Card>
  );
}