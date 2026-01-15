"use client";

import React, { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid
} from "recharts";
import { Card } from "@/components/ui/Card";

export function AdminActivityChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // FETCH KE API YANG BARU ANDA BUAT
        const res = await fetch("/api/dashboardRealtime"); 
        const result = await res.json();
        
        // Cek jika result berupa array, jika error kembalikan array kosong
        if (Array.isArray(result)) {
            setData(result as any);
        } else {
            console.error("Data format invalid", result);
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

  if (loading) return <div className="h-[300px] flex items-center justify-center text-xs text-gray-400">Loading metrics...</div>;

  return (
    <Card className="h-full p-5 bg-white border border-gray-100 shadow-none rounded-lg flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-base font-bold text-gray-800">Aktivitas Personil</h3>
          <p className="text-xs text-gray-400 mt-1">Frekuensi Restock (IN) vs Checkout (OUT)</p>
        </div>
      </div>

      <div className="flex-1 w-full min-h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 0, right: 10, left: 0, bottom: 0 }}
            barSize={12} 
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f8f9fa" />
            <XAxis type="number" hide />
            <YAxis 
              dataKey="name" 
              type="category" 
              width={100}
              tick={{ fontSize: 11, fill: '#64748b' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip 
              cursor={{ fill: 'transparent' }}
              contentStyle={{ borderRadius: '6px', border: '1px solid #eee', fontSize: '12px' }}
            />
            <Legend 
                verticalAlign="top" 
                align="right"
                iconType="circle" 
                iconSize={8}
                wrapperStyle={{ fontSize: '10px', paddingBottom: '20px' }} 
            />
            <Bar name="Barang Keluar" dataKey="ambil" stackId="a" fill="#fbbf24" radius={[0, 0, 0, 0]} />
            <Bar name="Restock Masuk" dataKey="supply" stackId="a" fill="#818cf8" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}