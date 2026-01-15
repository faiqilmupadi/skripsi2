"use client";
import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { ItemWithFSN, FSNCategory } from "@/types/fsn";

export function FSNDetailTabs({ items }: { items: ItemWithFSN[] }) {
  const [activeTab, setActiveTab] = useState<FSNCategory>("fast");

  const filteredItems = items
    .filter((i) => i.category === activeTab)
    .sort((a, b) => b.contribution - a.contribution);

  const tabs = [
    { 
      id: "fast", 
      label: "Fast Moving", 
      activeText: "text-emerald-700", 
      indicatorColor: "bg-emerald-500",
      activeBg: "bg-emerald-50/40" 
    },
    { 
      id: "slow", 
      label: "Slow Moving", 
      activeText: "text-amber-700", 
      indicatorColor: "bg-amber-500", 
      activeBg: "bg-amber-50/40" 
    },
    { 
      id: "non", 
      label: "Non Moving", 
      activeText: "text-rose-700", 
      indicatorColor: "bg-rose-500", 
      activeBg: "bg-rose-50/40" 
    },
  ];

  return (
    // PENTING: h-full agar kartu mengisi ruang yang tersedia, max-h untuk membatasi tinggi total kartu
    <Card className="border-none shadow-sm overflow-hidden flex flex-col h-full max-h-[500px] bg-white rounded-xl">
      
      {/* Header Tabs (Fixed) */}
      <div className="flex border-b border-gray-100/80 shrink-0">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as FSNCategory)}
              className={`
                flex-1 py-5 text-sm font-bold transition-all relative flex items-center justify-center gap-2.5 tracking-wide
                ${isActive ? `${tab.activeText} ${tab.activeBg}` : "text-gray-500 hover:text-gray-700 hover:bg-gray-50/50"}
              `}
            >
              <span className={`w-2 h-2 rounded-full ring-2 ring-offset-1 ${isActive ? `${tab.indicatorColor} ring-transparent` : "bg-gray-300 ring-transparent"}`}></span>
              {tab.label}
              
              {isActive && (
                <div className={`absolute bottom-0 left-0 w-full h-[3px] ${tab.indicatorColor}`} />
              )}
            </button>
          );
        })}
      </div>

      {/* Table Container (Scrollable) */}
      {/* overflow-y-auto: Mengaktifkan scroll vertikal */}
      {/* flex-1: Mengambil sisa ruang dari kartu */}
      <div className="overflow-x-auto overflow-y-auto flex-1">
        <table className="w-full text-sm text-left">
          
          {/* Header Tabel Sticky agar tetap terlihat saat di-scroll */}
          <thead className="text-xs text-gray-500 uppercase bg-gray-50/90 border-b border-gray-100/80 sticky top-0 z-10 backdrop-blur-sm">
            <tr>
              <th className="px-8 py-4 font-semibold tracking-wider bg-gray-50/90">Nama Barang</th>
              <th className="px-8 py-4 font-semibold text-center tracking-wider bg-gray-50/90">Frekuensi Keluar</th>
              <th className="px-8 py-4 font-semibold text-center tracking-wider bg-gray-50/90">Kontribusi</th>
              <th className="px-8 py-4 font-semibold text-right tracking-wider bg-gray-50/90">Sisa Stok</th>
            </tr>
          </thead>
          
          <tbody className="divide-y divide-gray-50/50">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/80 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="font-bold text-gray-900 text-[15px] group-hover:text-indigo-700 transition-colors">
                        {item.nama_barang}
                    </div>
                    <div className="text-xs text-gray-400 mt-1 font-medium">
                       Terakhir keluar: {item.lastOutDate ? new Date(item.lastOutDate).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' }) : "-"}
                    </div>
                  </td>
                  
                  <td className="px-8 py-5 text-center">
                    <div className="font-bold text-gray-800 text-base">{item.totalOutFreq}x</div>
                    <div className="text-xs text-gray-400 mt-0.5 font-medium">Total: {item.totalOutQty} {item.satuan}</div>
                  </td>

                  <td className="px-8 py-5 align-middle">
                    <div className="w-full max-w-[160px] mx-auto">
                        <div className="flex justify-between text-[11px] mb-1.5 font-semibold text-gray-500">
                             <span>Share</span>
                             <span className={activeTab === 'fast' ? 'text-emerald-600' : activeTab === 'slow' ? 'text-amber-600' : 'text-rose-600'}>
                                {(item.contribution || 0).toFixed(1)}%
                             </span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden ring-1 ring-gray-100">
                            <div 
                                className={`h-full rounded-full transition-all duration-500 ${
                                    activeTab === 'fast' ? 'bg-emerald-500' : 
                                    activeTab === 'slow' ? 'bg-amber-400' : 'bg-rose-500'
                                }`} 
                                style={{ width: `${item.contribution}%` }}
                            ></div>
                        </div>
                    </div>
                  </td>

                  <td className="px-8 py-5 text-right">
                    <span className="font-bold text-gray-800 text-lg tracking-tight">{item.stok_saat_ini}</span>
                    <span className="text-sm text-gray-400 ml-1.5 font-semibold">{item.satuan}</span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-8 py-20 text-center text-gray-400">
                  <div className="flex flex-col items-center justify-center gap-3 opacity-60">
                      <span className="text-base font-semibold text-gray-400">Data Kosong</span>
                      <span className="text-sm">Tidak ada barang dalam kategori ini.</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}