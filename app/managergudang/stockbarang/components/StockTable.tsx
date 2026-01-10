// app/managergudang/stockbarang/components/StockTable.tsx
import { ItemComplete } from "@/types/stock";

interface StockTableProps {
  items: ItemComplete[];
  onEdit: (item: ItemComplete) => void;
  onDelete: (id: string) => void;
}

export default function StockTable({ items, onEdit, onDelete }: StockTableProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
              Name
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
              ROP
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
              Jumlah
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
              Safety Stock
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
              Status
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
              Category
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
              Created At
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {items.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-3 text-sm text-gray-800">
                {item.name}
              </td>
              <td className="px-6 py-3 text-sm text-gray-800">{item.rop}</td>
              <td className="px-6 py-3 text-sm text-gray-800">
                {item.jumlah}
              </td>
              <td className="px-6 py-3 text-sm text-gray-800">
                {item.safetyStock}
              </td>
              <td className="px-6 py-3 text-sm">
                <span
                  className="px-2 py-1 rounded-full text-xs font-medium"
                  style={{ backgroundColor: item.statusColor + "20", color: item.statusColor }}
                >
                  {item.status.toUpperCase()}
                </span>
              </td>
              <td className="px-6 py-3 text-sm">
                <span
                  className="px-2 py-1 rounded-full text-xs font-medium"
                  style={{ backgroundColor: item.categoryColor + "20", color: item.categoryColor }}
                >
                  {item.category.toUpperCase()}
                </span>
              </td>
              <td className="px-6 py-3 text-sm text-gray-800">
                {item.createdAt}
              </td>
              <td className="px-6 py-3">
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(item)}
                    className="p-1.5 hover:bg-blue-50 rounded transition-colors"
                    title="Edit"
                  >
                    <svg
                      className="w-4 h-4 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => onDelete(item.id)}
                    className="p-1.5 hover:bg-red-50 rounded transition-colors"
                    title="Delete"
                  >
                    <svg
                      className="w-4 h-4 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-2 py-3 border-t border-gray-200 bg-gray-50">
        <button className="px-3 py-1 text-sm text-gray-600 hover:bg-white rounded border border-gray-200 transition-colors">
          «
        </button>
        <button className="px-3 py-1 text-sm bg-blue-500 text-white rounded">
          1
        </button>
        <button className="px-3 py-1 text-sm text-gray-600 hover:bg-white rounded border border-gray-200 transition-colors">
          2
        </button>
        <button className="px-3 py-1 text-sm text-gray-600 hover:bg-white rounded border border-gray-200 transition-colors">
          »
        </button>
      </div>
    </div>
  );
}