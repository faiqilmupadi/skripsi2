import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { ItemCheckout } from "@/types/ambil";

interface CheckoutModalProps {
  show: boolean;
  selectedItem: ItemCheckout | null;
  form: {
    requesterName: string;
    amount: string;
  };
  onChange: (field: string, value: string) => void;
  onSubmit: () => void;
  onClose: () => void;
}

export function CheckoutModal({ show, selectedItem, form, onChange, onSubmit, onClose }: CheckoutModalProps) {
  if (!selectedItem) return null;

  return (
    <Transition appear show={show} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-8 shadow-xl transition-all">
            
            <Dialog.Title as="h3" className="text-xl font-bold text-gray-900 mb-6">
              Checkout Barang: <span className="text-blue-600">{selectedItem.nama_barang}</span>
            </Dialog.Title>

            <div className="space-y-6">
              {/* Field Name */}
              <div className="grid grid-cols-4 items-center gap-4">
                <label className="text-sm font-bold text-gray-700 col-span-1">
                  Name :
                </label>
                <input
                  type="text"
                  placeholder="admin@email.com"
                  value={form.requesterName}
                  onChange={(e) => onChange("requesterName", e.target.value)}
                  className="col-span-3 w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Field Jumlah */}
              <div className="grid grid-cols-4 items-center gap-4">
                <label className="text-sm font-bold text-gray-700 col-span-1">
                  Jumlah :
                </label>
                <div className="col-span-3">
                  <input
                    type="number"
                    placeholder="0"
                    value={form.amount}
                    onChange={(e) => onChange("amount", e.target.value)}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
                  />
                  <p className="text-xs text-gray-400 mt-1 text-right">
                    Stok tersedia: {selectedItem.stok_saat_ini}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-6 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={onSubmit}
                className="px-6 py-2.5 rounded-lg bg-blue-600 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                Submit
              </button>
            </div>

          </Dialog.Panel>
        </div>
      </Dialog>
    </Transition>
  );
}