// app/managergudang/stockbarang/components/StockModals.tsx
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

// === ADD MODAL ===
interface AddModalProps {
  show: boolean;
  form: {
    nama_barang: string;
    stok_saat_ini: string;
    rop: string;
    safety_stock: string;
    satuan: string;
  };
  onChange: (field: string, value: string) => void;
  onSubmit: () => void;
  onClose: () => void;
}

export function AddModal({ show, form, onChange, onSubmit, onClose }: AddModalProps) {
  return (
    <Transition appear show={show} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
            <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 mb-4">
              Tambah Barang Baru
            </Dialog.Title>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nama Barang</label>
                <input
                  type="text"
                  value={form.nama_barang}
                  onChange={(e) => onChange("nama_barang", e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Stok Awal</label>
                  <input
                    type="number"
                    value={form.stok_saat_ini}
                    onChange={(e) => onChange("stok_saat_ini", e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Satuan</label>
                  <input
                    type="text"
                    placeholder="Pcs/Unit"
                    value={form.satuan}
                    onChange={(e) => onChange("satuan", e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">ROP</label>
                  <input
                    type="number"
                    value={form.rop}
                    onChange={(e) => onChange("rop", e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Safety Stock</label>
                  <input
                    type="number"
                    value={form.safety_stock}
                    onChange={(e) => onChange("safety_stock", e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
                Batal
              </button>
              <button onClick={onSubmit} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                Simpan
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </Transition>
  );
}

// === EDIT MODAL ===
interface EditModalProps {
  show: boolean;
  form: {
    nama_barang: string;
    stok_saat_ini: string;
    rop: string;
    safety_stock: string;
    satuan: string;
  };
  onChange: (field: string, value: string) => void;
  onSubmit: () => void;
  onClose: () => void;
}

export function EditModal({ show, form, onChange, onSubmit, onClose }: EditModalProps) {
  return (
    <Transition appear show={show} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
            <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 mb-4">
              Edit Barang
            </Dialog.Title>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nama Barang</label>
                <input
                  type="text"
                  value={form.nama_barang}
                  onChange={(e) => onChange("nama_barang", e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                
                {/* ✅ STOK DISABLED (TIDAK BISA DIEDIT) */}
                <div>
                  <label className="block text-sm font-medium text-gray-500">Stok Saat Ini</label>
                  <input
                    type="number"
                    value={form.stok_saat_ini}
                    disabled // <--- KUNCI
                    readOnly 
                    className="mt-1 block w-full rounded-md border border-gray-200 bg-gray-100 text-gray-500 px-3 py-2 shadow-sm cursor-not-allowed"
                  />
                  <p className="text-[10px] text-red-400 mt-1">*Stok tidak bisa diedit</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Satuan</label>
                  <input
                    type="text"
                    value={form.satuan}
                    onChange={(e) => onChange("satuan", e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">ROP</label>
                  <input
                    type="number"
                    value={form.rop}
                    onChange={(e) => onChange("rop", e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Safety Stock</label>
                  <input
                    type="number"
                    value={form.safety_stock}
                    onChange={(e) => onChange("safety_stock", e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
                Batal
              </button>
              <button onClick={onSubmit} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                Update
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </Transition>
  );
}