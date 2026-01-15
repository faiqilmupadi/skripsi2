import { ReportFilterType } from "@/types/laporanBarang";
import { FileText, Calendar, Download, Printer } from "lucide-react";

interface HeaderSectionProps {
    filter: ReportFilterType;
    setFilter: (f: ReportFilterType) => void;
    onExport: () => void;
}

export default function HeaderSection({ filter, setFilter, onExport }: HeaderSectionProps) {
    const handlePrint = () => window.print();

    return (
        <>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6 print:hidden">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <FileText className="w-8 h-8 text-indigo-600" />
                        Laporan Kinerja Gudang
                    </h1>
                    <p className="text-sm text-gray-500 mt-1 ml-10">Analisis komprehensif aktivitas, stok, dan kinerja personil.</p>
                </div>

                <div className="flex flex-wrap gap-3 items-center">
                    <div className="bg-white p-1 rounded-lg border border-gray-200 shadow-sm flex items-center">
                        <Calendar className="w-4 h-4 text-gray-400 ml-2 mr-1" />
                        {(["1D", "7D", "30D"] as ReportFilterType[]).map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                                    filter === f ? "bg-indigo-50 text-indigo-700 shadow-sm" : "text-gray-500 hover:bg-gray-50"
                                }`}
                            >
                                {f === "1D" ? "24 Jam" : f === "7D" ? "7 Hari" : "30 Hari"}
                            </button>
                        ))}
                    </div>

                    <button onClick={onExport} className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition shadow-sm">
                        <Download className="w-4 h-4" /> Export CSV
                    </button>
                    <button onClick={handlePrint} className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition shadow-md">
                        <Printer className="w-4 h-4" /> Cetak PDF
                    </button>
                </div>
            </div>

            <div className="hidden print:block mb-8 border-b pb-4">
                <h1 className="text-3xl font-bold text-black">Laporan Operasional Gudang</h1>
                <div className="flex justify-between mt-2 text-sm text-gray-600">
                    <p>Periode: {filter === "1D" ? "Hari Ini" : filter === "7D" ? "7 Hari Terakhir" : "30 Hari Terakhir"}</p>
                    <p>Dicetak: {new Date().toLocaleDateString("id-ID", { dateStyle: 'full' })}</p>
                </div>
            </div>
        </>
    );
}