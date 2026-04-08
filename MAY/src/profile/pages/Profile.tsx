import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiLogOut, FiEdit2, FiCheck, FiX } from "react-icons/fi";
import { useAuth } from "../../contexts/AuthContext";
import { useProfile, useUpdateProfile } from "../hooks";
import { LoyaltyCard } from "../components";

function Profile() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const token = localStorage.getItem("access_token");
  
  const { data: profileData, isLoading } = useProfile(token);
  const { mutate: updateProfile } = useUpdateProfile(token);
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: profileData?.name || "",
    phone: profileData?.phone || "",
    address: profileData?.address || "",
  });

  // Cập nhật form khi profileData load xong
  useEffect(() => {
    if (profileData) {
      setFormData({
        name: profileData.name,
        phone: profileData.phone,
        address: profileData.address || "",
      });
    }
  }, [profileData]);

  if (!user) {
    return (
      <div className="mx-auto w-full max-w-7xl px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-neutral-900 mb-4">
          Vui lòng đăng nhập
        </h1>
        <button
          onClick={() => navigate("/login")}
          className="rounded-full bg-orange-400 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-500"
        >
          Đăng nhập
        </button>
      </div>
    );
  }

  const displayUser = profileData || user;

  const handleSave = () => {
    updateProfile(
      {
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
      },
      {
        onSuccess: () => {
          setIsEditing(false);
        },
        onError: (error: any) => {
          console.error('Update profile failed:', error);
          alert(error?.response?.data?.message || 'Cập nhật thất bại');
        },
      }
    );
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const formatPrice = (value: number) =>
    new Intl.NumberFormat("vi-VN").format(value) + "đ";

  if (isLoading) {
    return <div className="text-center py-12">Đang tải...</div>;
  }

  return (
    <div className="mx-auto w-full max-w-7xl py-8 sm:py-12">
      <div className="px-4 sm:px-0">
        <h1 className="font-serif text-4xl sm:text-5xl font-black text-neutral-900 mb-2">
          Tài khoản của tôi
        </h1>
        <p className="text-neutral-600">Quản lý thông tin cá nhân và điểm tích lũy</p>
      </div>

      <div className="mt-8 grid gap-6 sm:gap-8 lg:grid-cols-3 px-4 sm:px-0">
        {/* Profile Card */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-900">
                Thông tin cá nhân
              </h2>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 rounded-lg bg-orange-50 px-3 py-2 text-sm font-semibold text-orange-600 transition hover:bg-orange-100"
                >
                  <FiEdit2 size={16} />
                  Chỉnh sửa
                </button>
              )}
            </div>

            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">
                    Họ và tên
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full rounded-lg border border-neutral-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full rounded-lg border border-neutral-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">
                    Địa chỉ
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    className="w-full rounded-lg border border-neutral-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleSave}
                    className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-orange-400 py-3 text-sm font-semibold text-white transition hover:bg-orange-500"
                  >
                    <FiCheck size={16} />
                    Lưu
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="flex-1 flex items-center justify-center gap-2 rounded-lg border-2 border-neutral-300 py-3 text-sm font-semibold text-neutral-700 transition hover:border-neutral-400"
                  >
                    <FiX size={16} />
                    Hủy
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                    Tên
                  </p>
                  <p className="mt-1 text-lg font-semibold text-neutral-900">
                    {displayUser.name}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                    Email
                  </p>
                  <p className="mt-1 text-lg font-semibold text-neutral-900">
                    {displayUser.email}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                    Số điện thoại
                  </p>
                  <p className="mt-1 text-lg font-semibold text-neutral-900">
                    {displayUser.phone || "Chưa cập nhật"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                    Địa chỉ
                  </p>
                  <p className="mt-1 text-lg font-semibold text-neutral-900">
                    {displayUser.address || "Chưa cập nhật"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                    Thành viên từ
                  </p>
                  <p className="mt-1 text-lg font-semibold text-neutral-900">
                    {displayUser.createdAt 
                      ? new Date(displayUser.createdAt).toLocaleDateString("vi-VN")
                      : "Chưa cập nhật"
                    }
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Account Actions */}
          <div className="flex gap-3">
            <button
              onClick={() => navigate("/my-orders")}
              className="flex-1 rounded-lg bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-600 transition hover:bg-blue-100"
            >
              Xem đơn hàng
            </button>
            <button
              onClick={handleLogout}
              className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-100"
            >
              <FiLogOut size={16} />
              Đăng xuất
            </button>
          </div>
        </div>

        {/* Loyalty Points Card */}
        <LoyaltyCard user={displayUser} formatPrice={formatPrice} />
      </div>
    </div>
  );
}

export default Profile;
