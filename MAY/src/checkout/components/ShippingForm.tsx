import { useEffect, useMemo, useState } from "react";
import type { CheckoutFormData, SavedAddress } from "../types/checkout.types";

type DistrictOption = {
  code: number;
  name: string;
};

type WardOption = {
  code: number;
  name: string;
};

const HCM_CITY_NAME = "Thành phố Hồ Chí Minh";
const HCM_CITY_CODE = 79;

type Props = {
  userName?: string | null;
  userPhone?: string | null;
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
  const [districts, setDistricts] = useState<DistrictOption[]>([]);
  const [wards, setWards] = useState<WardOption[]>([]);
  const [isLoadingDistricts, setIsLoadingDistricts] = useState(false);
  const [isLoadingWards, setIsLoadingWards] = useState(false);

  const emitInputChange = (name: "city" | "district" | "ward", value: string) => {
    onInputChange({ target: { name, value } } as React.ChangeEvent<HTMLSelectElement>);
  };

  useEffect(() => {
    if (!isAddingNewAddress) return;
    if (formData.city === HCM_CITY_NAME) return;

    emitInputChange("city", HCM_CITY_NAME);
    if (formData.district) emitInputChange("district", "");
    if (formData.ward) emitInputChange("ward", "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.city, formData.district, formData.ward, isAddingNewAddress]);

  useEffect(() => {
    let isMounted = true;

    const fetchDistricts = async () => {
      if (formData.city !== HCM_CITY_NAME) {
        setDistricts([]);
        setWards([]);
        return;
      }

      try {
        setIsLoadingDistricts(true);
        const response = await fetch(`https://provinces.open-api.vn/api/p/${HCM_CITY_CODE}?depth=2`);
        const data = (await response.json()) as { districts?: DistrictOption[] };
        if (!isMounted) return;
        setDistricts(Array.isArray(data?.districts) ? data.districts : []);
      } catch {
        if (!isMounted) return;
        setDistricts([]);
      } finally {
        if (isMounted) setIsLoadingDistricts(false);
      }
    };

    fetchDistricts();

    return () => {
      isMounted = false;
    };
  }, [formData.city]);

  const selectedDistrict = useMemo(
    () => districts.find((district) => district.name === formData.district) || null,
    [districts, formData.district]
  );

  useEffect(() => {
    let isMounted = true;

    const fetchWards = async () => {
      if (!selectedDistrict) {
        setWards([]);
        return;
      }

      try {
        setIsLoadingWards(true);
        const response = await fetch(
          `https://provinces.open-api.vn/api/d/${selectedDistrict.code}?depth=2`
        );
        const data = (await response.json()) as { wards?: WardOption[] };
        if (!isMounted) return;
        setWards(Array.isArray(data?.wards) ? data.wards : []);
      } catch {
        if (!isMounted) return;
        setWards([]);
      } finally {
        if (isMounted) setIsLoadingWards(false);
      }
    };

    fetchWards();

    return () => {
      isMounted = false;
    };
  }, [selectedDistrict]);

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
                  <span className="text-sm text-neutral-600">{address.phone}</span>
                </div>
                <p className="mt-1 text-sm text-neutral-600">
                  {[address.address, address.ward, address.district, address.city]
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

            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <select
                name="ward"
                value={formData.ward}
                onChange={(e) => emitInputChange("ward", e.target.value)}
                required
                disabled={!formData.district || isLoadingWards}
                className="rounded-lg border border-neutral-300 px-4 py-3 text-sm disabled:bg-neutral-100"
              >
                <option value="">
                  {isLoadingWards
                    ? "Đang tải phường/xã..."
                    : formData.district
                      ? "Chọn phường/xã"
                      : "Chọn quận/huyện trước"}
                </option>
                {formData.ward && !wards.some((ward) => ward.name === formData.ward) && (
                  <option value={formData.ward}>{formData.ward}</option>
                )}
                {wards.map((ward) => (
                  <option key={ward.code} value={ward.name}>
                    {ward.name}
                  </option>
                ))}
              </select>

              <select
                name="district"
                value={formData.district}
                onChange={(e) => {
                  const nextDistrict = e.target.value;
                  emitInputChange("district", nextDistrict);
                  if (formData.ward) emitInputChange("ward", "");
                }}
                required
                disabled={formData.city !== HCM_CITY_NAME || isLoadingDistricts}
                className="rounded-lg border border-neutral-300 px-4 py-3 text-sm disabled:bg-neutral-100"
              >
                <option value="">
                  {isLoadingDistricts
                    ? "Đang tải quận/huyện..."
                    : formData.city === HCM_CITY_NAME
                      ? "Chọn quận/huyện"
                      : "Chỉ hỗ trợ Thành phố Hồ Chí Minh"}
                </option>
                {formData.district &&
                  !districts.some((district) => district.name === formData.district) && (
                    <option value={formData.district}>{formData.district}</option>
                  )}
                {districts.map((district) => (
                  <option key={district.code} value={district.name}>
                    {district.name}
                  </option>
                ))}
              </select>

              <input
                name="city"
                value={formData.city}
                required
                disabled
                className="rounded-lg border border-neutral-300 px-4 py-3 text-sm disabled:bg-neutral-100"
                placeholder="Thành phố"
              />
            </div>

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