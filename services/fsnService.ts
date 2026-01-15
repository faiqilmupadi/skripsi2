import { Item, StockMovement, ItemWithFSN, FSNSummary, TimeFilter, FSNChartData } from "@/types/fsn";

const FAST_THRESHOLD_FREQ = 5; 
const SLOW_THRESHOLD_FREQ = 1;

export function calculateFSN(items: Item[], movements: StockMovement[], filter: TimeFilter): ItemWithFSN[] {
    const now = new Date();
    const cutoffDate = new Date();
    
    if (filter === "1M") cutoffDate.setMonth(now.getMonth() - 1);
    else if (filter === "3M") cutoffDate.setMonth(now.getMonth() - 3);
    else if (filter === "6M") cutoffDate.setMonth(now.getMonth() - 6);

    // 1. Hitung TOTAL Transaksi Keluar (Grand Total) untuk penyebut persentase
    // Hanya movement OUT dalam periode filter
    const grandTotalMovements = movements.filter(m => 
        m.tipe === "OUT" && new Date(m.tanggal) >= cutoffDate
    ).length;

    return items.map(item => {
        // A. Filter untuk perhitungan FSN (sesuai periode waktu)
        const relevantMovements = movements.filter(m => 
            m.item_id === item.id && 
            m.tipe === "OUT" && 
            new Date(m.tanggal) >= cutoffDate
        );

        // B. Filter untuk deteksi Dead Stock (sepanjang masa)
        const allOutMoves = movements.filter(m => m.item_id === item.id && m.tipe === "OUT");
        
        // PENGAMAN: Pastikan kita mengambil tanggal paling baru, meskipun API tidak urut
        // Kita sort descending (terbaru di index 0)
        allOutMoves.sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime());
        
        const lastMove = allOutMoves.length > 0 ? allOutMoves[0] : null;
        const lastOutDate = lastMove ? lastMove.tanggal : null;
        
        // Hitung hari sejak terakhir keluar
        const daysSinceLastOut = lastOutDate 
            ? Math.floor((now.getTime() - new Date(lastOutDate).getTime()) / (1000 * 3600 * 24))
            : 999; // 999 hari jika belum pernah keluar

        const totalOutFreq = relevantMovements.length;
        const totalOutQty = relevantMovements.reduce((sum, m) => sum + m.qty, 0);

        // C. HITUNG KONTRIBUSI (%)
        // Mencegah pembagian dengan nol (Infinity/NaN)
        const contribution = grandTotalMovements > 0 
            ? (totalOutFreq / grandTotalMovements) * 100 
            : 0;

        // D. Tentukan Kategori FSN
        let category: "fast" | "slow" | "non" = "non";
        const multiplier = filter === "1M" ? 1 : (filter === "3M" ? 3 : 6);
        const adjustedFast = FAST_THRESHOLD_FREQ * multiplier;
        const adjustedSlow = SLOW_THRESHOLD_FREQ * multiplier;

        if (totalOutFreq >= adjustedFast) category = "fast";
        else if (totalOutFreq >= adjustedSlow) category = "slow";
        else category = "non";

        return {
            ...item,
            category,
            totalOutFreq,
            totalOutQty,
            lastOutDate,
            daysSinceLastOut,
            contribution // Ini properti penting untuk Table Tabs
        };
    });
}

// --- FUNGSI HELPER LAINNYA TETAP SAMA ---

export function getFSNSummary(data: ItemWithFSN[]): FSNSummary {
    return {
        fast: data.filter(i => i.category === "fast").length,
        slow: data.filter(i => i.category === "slow").length,
        non: data.filter(i => i.category === "non").length,
        totalItems: data.length, 
        totalTransactions: data.reduce((sum, i) => sum + i.totalOutFreq, 0)
    };
}

export function getPieChartData(data: ItemWithFSN[]): FSNChartData[] {
    const summary = getFSNSummary(data);
    return [
        { name: "Fast Moving", value: summary.fast, color: "#10B981" }, // Emerald
        { name: "Slow Moving", value: summary.slow, color: "#F59E0B" }, // Amber
        { name: "Non Moving", value: summary.non, color: "#EF4444" }, // Red
    ];
}

export function getTopTurnoverItems(data: ItemWithFSN[]): ItemWithFSN[] {
    return [...data]
        .filter(i => i.totalOutFreq > 0)
        .sort((a, b) => b.totalOutFreq - a.totalOutFreq)
        .slice(0, 5);
}

export function getDeadStockCandidates(data: ItemWithFSN[]): ItemWithFSN[] {
    return data
        .filter(i => i.daysSinceLastOut > 30) // Lebih dari 30 hari tidak gerak
        .sort((a, b) => b.daysSinceLastOut - a.daysSinceLastOut) // Urutkan dari yang paling lama nganggur
        .slice(0, 10);
}