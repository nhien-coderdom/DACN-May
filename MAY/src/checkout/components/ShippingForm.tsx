import { useState } from "react";
import type { CheckoutFormData, SavedAddress } from "../types/checkout.types";

type Props = {
  userName?: string | null;
  userPhone?: string | null;
  userEmail?: string | null;
  userAddress?: string | null;
  formData: CheckoutFormData;
  savedAddresses: SavedAddress[];
  selectedAddressId: string | null;
  isAddingNewAddress: boolean;
  setAsDefaultAddress: boolean;
  editingAddressId: string | null;
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  onSelectAddress: (addressId: string) => void;
  onEditAddress: (addressId: string) => void;
  onDeleteAddress: (addressId: string) => void;
  onStartAddNew: () => void;
  onCancelAddOrEdit: () => void;
  onSaveAddress: () => void;
  onToggleDefault: (checked: boolean) => void;
};

export default function AddressSection({
  formData,
  savedAddresses,
  selectedAddressId,
  isAddingNewAddress,
  setAsDefaultAddress,
  editingAddressId,
  onInputChange,
  onSelectAddress,
  onEditAddress,
  onDeleteAddress,
  onStartAddNew,
  onCancelAddOrEdit,
  onSaveAddress,
  onToggleDefault,
}: Props) {
  const [pendingDeleteAddressId, setPendingDeleteAddressId] = useState<string | null>(null);
  return (
    <>
      <div className="rounded-xl border border-orange-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-bold text-[#086136]">Địa chỉ nhận hàng</h2>

        {savedAddresses.length > 0 && (
          <div className="mb-4 space-y-3">
            {savedAddresses.map((address) => (
              <div
                key={address.id}
                role="button"
                tabIndex={0}
                onClick={() => onSelectAddress(address.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onSelectAddress(address.id);
                  }
                }}
                className={`w-full rounded-xl border p-4 text-left transition ${
                  selectedAddressId === address.id
                    ? "border-[#086136] bg-orange-50"
                    : "border-neutral-200 bg-white hover:border-orange-300"
                }`}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold text-neutral-900">{address.fullName}</p>
                  <span className="text-sm text-neutral-600">{address.email}</span>
                  <span className="text-sm text-neutral-600">{address.phone}</span>
                </div>
                <p className="mt-1 text-sm text-neutral-600">
                  {[address.address]
                    .filter(Boolean)
                    .join(", ")}
                </p>

                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditAddress(address.id);
                    }}
                    className="rounded-md border border-neutral-300 px-3 py-1 text-xs font-semibold text-neutral-700"
                  >
                    Chỉnh sửa
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPendingDeleteAddressId(address.id);
                    }}
                    className="rounded-md border border-[#086136] px-3 py-1 text-xs font-semibold text-[#086136]"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mb-4 flex items-center gap-3">
          <button
            type="button"
            onClick={onStartAddNew}
            className="rounded-lg border border-[#086136] px-4 py-2 text-sm font-semibold text-[#086136]"
          >
            + Thêm địa chỉ mới
          </button>

          {savedAddresses.length > 0 && isAddingNewAddress && (
            <button
              type="button"
              onClick={onCancelAddOrEdit}
              className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-semibold text-neutral-600"
            >
              Hủy thêm mới
            </button>
          )}
        </div>

        {isAddingNewAddress && (
          <>
            <div className="mb-3 flex items-center gap-2">
              <input
                id="default-address"
                type="checkbox"
                checked={setAsDefaultAddress}
                onChange={(e) => onToggleDefault(e.target.checked)}
                className="h-4 w-4"
              />
              <label htmlFor="default-address" className="text-sm text-neutral-700">
                Đặt làm địa chỉ mặc định
              </label>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <input
                type="text"
                name="fullName"
                placeholder="Họ và tên"
                value={formData.fullName}
                onChange={onInputChange}
                required
                className="rounded-lg border border-neutral-300 px-4 py-3 text-sm"
              />
              <input
                type="tel"
                name="phone"
                placeholder="Số điện thoại"
                value={formData.phone}
                onChange={onInputChange}
                required
                className="rounded-lg border border-neutral-300 px-4 py-3 text-sm"
              />
            </div>

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={onInputChange}
              required
              className="mt-4 w-full rounded-lg border border-neutral-300 px-4 py-3 text-sm"
            />

            <textarea
              name="address"
              placeholder="Địa chỉ chi tiết"
              value={formData.address}
              onChange={onInputChange}
              required
              rows={3}
              className="mt-4 w-full rounded-lg border border-neutral-300 px-4 py-3 text-sm"
            />

            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={onSaveAddress}
                className="rounded-lg bg-[#086136] px-5 py-2 text-sm font-semibold text-white hover:opacity-90"
              >
                {editingAddressId ? "Cập nhật địa chỉ" : "Lưu địa chỉ"}
              </button>
            </div>
          </>
        )}

        {!isAddingNewAddress && selectedAddressId && (
          <p className="text-sm text-neutral-500">Đang sử dụng địa chỉ đã chọn để giao hàng.</p>
        )}
      </div>

      {pendingDeleteAddressId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-5 shadow-xl">
            <h3 className="text-base font-bold text-neutral-900">Xóa địa chỉ?</h3>
            <p className="mt-2 text-sm text-neutral-600">
              Bạn có chắc muốn xóa địa chỉ này không?
            </p>

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setPendingDeleteAddressId(null)}
                className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-semibold text-neutral-700"
              >
                Thoát
              </button>
              <button
                type="button"
                onClick={() => {
                  onDeleteAddress(pendingDeleteAddressId);
                  setPendingDeleteAddressId(null);
                }}
                className="rounded-lg bg-[#086136] px-4 py-2 text-sm font-semibold text-white"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}