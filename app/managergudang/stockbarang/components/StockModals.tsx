// app/managergudang/stockbarang/components/StockModals.tsx
import { Item } from "@/types/stock";

interface AddModalProps {
  show: boolean;
  form: {
    name: string;
    jumlah: string;
    rop: string;
    safetyStock: string;
  };
  onChange: (field: string, value: string) => void;
  onSubmit: () => void;
  onClose: () => void;
}

export function AddModal({ show, form, onChange, onSubmit, onClose }: AddModalProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          Tambah Barang
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name :
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => onChange("name", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ROP :
            </label>
            <input
              type="number"
              value={form.rop}
              onChange={(e) => onChange("rop", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Safety Stock :
            </label>
            <input
              type="number"
              value={form.safetyStock}
              onChange={(e) => onChange("safetyStock", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Jumlah :
            </label>
            <input
              type="number"
              value={form.jumlah}
              onChange={(e) => onChange("jumlah", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors text-sm font-medium"
          >
            Batal
          </button>
          <button
            onClick={onSubmit}
            className="px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}

interface EditModalProps {
  show: boolean;
  form: {
    name: string;
    rop: string;
    safetyStock: string;
    jumlah: string;
  };
  onChange: (field: string, value: string) => void;
  onSubmit: () => void;
  onClose: () => void;
}

export function EditModal({ show, form, onChange, onSubmit, onClose }: EditModalProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          Edit Barang
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name :
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => onChange("name", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ROP :
            </label>
            <input
              type="number"
              value={form.rop}
              onChange={(e) => onChange("rop", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Safety Stock :
            </label>
            <input
              type="number"
              value={form.safetyStock}
              onChange={(e) => onChange("safetyStock", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Jumlah :
            </label>
            <input
              type="number"
              value={form.jumlah}
              onChange={(e) => onChange("jumlah", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors text-sm font-medium"
          >
            Batal
          </button>
          <button
            onClick={onSubmit}
            className="px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}

interface OrderModalProps {
  show: boolean;
  notification: {
    itemName: string;
    message: string;
  } | null;
  form: {
    supplier: string;
    jumlahOrder: string;
  };
  onChange: (field: string, value: string) => void;
  onSubmit: () => void;
  onClose: () => void;
}

export function OrderModal({ show, notification, form, onChange, onSubmit, onClose }: OrderModalProps) {
  if (!show || !notification) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          Pemesanan Barang
        </h2>
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-gray-800 font-medium">{notification.itemName}</p>
          <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Supplier :
            </label>
            <input
              type="text"
              value={form.supplier}
              onChange={(e) => onChange("supplier", e.target.value)}
              placeholder="Masukkan nama supplier"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Jumlah Order :
            </label>
            <input
              type="number"
              value={form.jumlahOrder}
              onChange={(e) => onChange("jumlahOrder", e.target.value)}
              placeholder="Masukkan jumlah"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors text-sm font-medium"
          >
            Batal
          </button>
          <button
            onClick={onSubmit}
            className="px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
          >
            Pesan
          </button>
        </div>
      </div>
    </div>
  );
}