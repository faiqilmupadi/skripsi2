import { Package, Users } from "lucide-react";

export default function ReportTables({ topItems, topUsers }: { topItems: any[], topUsers: any[] }) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 print:grid-cols-2">
            <div className="bg-white p-6 rounded-xl border border-gray-200/60 shadow-sm print:border-gray-300 print:shadow-none">
                <h2 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Package className="w-5 h-5 text-gray-500" /> Barang Paling Sering Keluar
                </h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
                            <tr>
                                <th className="px-4 py-3 rounded-tl-lg">Nama Barang</th>
                                <th className="px-4 py-3 text-right">Qty Keluar</th>
                                <th className="px-4 py-3 text-right rounded-tr-lg">Frekuensi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {topItems.map((item, idx) => (
                                <tr key={idx} className="hover:bg-gray-50/50">
                                    <td className="px-4 py-3 font-semibold text-gray-700">{item.nama_barang}</td>
                                    <td className="px-4 py-3 text-right font-bold text-gray-900">{item.total_qty} <span className="text-xs font-normal text-gray-400">{item.satuan}</span></td>
                                    <td className="px-4 py-3 text-right text-gray-500">{item.frekuensi}x</td>
                                </tr>
                            ))}
                            {topItems.length === 0 && <tr><td colSpan={3} className="text-center py-6 text-gray-400 italic">Tidak ada data keluar</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200/60 shadow-sm print:border-gray-300 print:shadow-none">
                <h2 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5 text-gray-500" /> Kinerja Personil
                </h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
                            <tr>
                                <th className="px-3 py-3 rounded-tl-lg">Nama</th>
                                <th className="px-3 py-3 text-center">In</th>
                                <th className="px-3 py-3 text-center">Out</th>
                                <th className="px-3 py-3 text-right rounded-tr-lg">Dominasi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {topUsers.map((user, idx) => {
                                let desc = "Seimbang";
                                let descColor = "text-gray-500";
                                if (user.count_in > user.count_out * 1.5) { desc = "Fokus Restock"; descColor = "text-indigo-600"; }
                                else if (user.count_out > user.count_in * 1.5) { desc = "Fokus Distribusi"; descColor = "text-amber-600"; }

                                return (
                                    <tr key={idx} className="hover:bg-gray-50/50">
                                        <td className="px-3 py-3">
                                            <div className="font-semibold text-gray-700">{user.nama || 'System'}</div>
                                            <div className="text-[10px] text-gray-400 uppercase">{user.role}</div>
                                        </td>
                                        <td className="px-3 py-3 text-center">
                                            <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded text-xs font-bold">{user.count_in}</span>
                                        </td>
                                        <td className="px-3 py-3 text-center">
                                            <span className="bg-amber-50 text-amber-700 px-2 py-0.5 rounded text-xs font-bold">{user.count_out}</span>
                                        </td>
                                        <td className={`px-3 py-3 text-right font-medium text-xs ${descColor}`}>{desc}</td>
                                    </tr>
                                );
                            })}
                            {topUsers.length === 0 && <tr><td colSpan={4} className="text-center py-6 text-gray-400 italic">Belum ada aktivitas personil</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}