"use client";

import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid
} from "recharts";
import { Card } from "@/components/ui/Card";

export function AdminActivityChart() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/dashboardRealtime");
        const result = await res.json();
        
        if (Array.isArray(result)) {
            // SORTING: Urutkan dari aktivitas terbanyak ke paling sedikit
            // Agar yang paling rajin muncul di paling ATAS
            const sortedData = result.sort((a, b) => 
                (b.supply + b.ambil) - (a.supply + a.ambil)
            );
            setData(sortedData);
        } else {
            setData([]);
        }
      } catch (err) {
        console.error("Failed to fetch activity", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return (
    <Card className="h-full p-6 flex items-center justify-center border-none shadow-sm">
        <span className="text-xs text-gray-400 animate-pulse">Memuat Aktivitas...</span>
    </Card>
  );

  return (
    <Card className="h-full p-6 bg-white border-none shadow-sm rounded-xl flex flex-col">
      <div className="mb-2">
        <h3 className="font-bold text-lg text-gray-800">Aktivitas Personil</h3>
        <p className="text-sm text-gray-500">Leaderboard aktivitas gudang</p>
      </div>

      <div className="flex-1 w-full min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical" // PENTING: Membuat grafik menyamping (Horizontal)
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            barSize={20} // Ukuran bar "ramping" seperti referensi Anda
          >
            {/* Grid Vertikal Tipis */}
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />

            {/* Sumbu X: Angka disembunyikan agar bersih */}
            <XAxis type="number" hide />

            {/* Sumbu Y: Nama Orang di Kiri */}
            <YAxis 
              dataKey="name" 
              type="category" 
              width={110} // Lebar area nama
              tick={{ fontSize: 13, fill: '#475569', fontWeight: 500 }}
              axisLine={false} // Hilangkan garis sumbu vertikal
              tickLine={false} // Hilangkan garis strip kecil
            />

            <Tooltip 
              cursor={{ fill: '#f8fafc' }} // Highlight background saat di-hover
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            />
            
            <Legend 
                verticalAlign="top" 
                align="right"
                iconType="circle" 
                iconSize={8}
                wrapperStyle={{ fontSize: '11px', paddingBottom: '20px' }} 
            />

            {/* Bar 1: Barang Keluar (Orange) */}
            {/* stackId="a" membuat mereka satu baris */}
            <Bar 
              name="Barang Keluar" 
              dataKey="ambil" 
              stackId="a" 
              fill="#F59E0B" // Warna Orange
              radius={[0, 0, 0, 0]} 
            />

            {/* Bar 2: Supply Masuk (Biru/Indigo) */}
            <Bar 
              name="Restock Masuk" 
              dataKey="supply" 
              stackId="a" 
              fill="#6366F1" // Warna Indigo
              // Radius hanya di ujung kanan (kanan atas, kanan bawah) agar terlihat kapsul utuh
              radius={[0, 4, 4, 0]} 
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}