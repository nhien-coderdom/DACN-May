import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiPackage,
  FiTruck,
  FiCheckCircle,
  FiXCircle,
  FiClock,
} from "react-icons/fi";
import { useOrders } from "../contexts/OrdersContext";
import { useAuth } from "../contexts/AuthContext";
import type { Order, OrderStatus, OrderItem } from "../contexts/OrdersContext";

function MyOrders() {
  const navigate = useNavigate();
  const { orders, fetchOrders, loading } = useOrders();
  const { user } = useAuth();

  useEffect(() => {
    fetchOrders();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  const userOrders = user ? orders.filter((order) => order.userId === user.id || order.email === user.email) : [];

  const formatPrice = (value: number) =>
    new Intl.NumberFormat("vi-VN").format(value) + "đ";

  const formatOrderCode = (id: number) =>
    `ORD-${String(id).padStart(3, "0")}`;

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case "PENDING":
        return <FiClock className="text-yellow-500" size={20} />;
      case "CONFIRMED":
      case "PREPARING":
        return <FiPackage className="text-blue-500" size={20} />;
      case "SHIPPING":
        return <FiTruck className="text-orange-500" size={20} />;
      case "DELIVERED":
        return <FiCheckCircle className="text-green-500" size={20} />;
      case "CANCELLED":
        return <FiXCircle className="text-red-500" size={20} />;
      default:
        return <FiClock className="text-gray-500" size={20} />;
    }
  };

  const getStatusText = (status: OrderStatus) => {
    switch (status) {
      case "PENDING":
        return "Đang xử lý";
      case "CONFIRMED":
        return "Đã xác nhận";
      case "PREPARING":
        return "Đang chuẩn bị";
      case "SHIPPING":
        return "Đang giao";
      case "DELIVERED":
        return "Đã giao";
      case "CANCELLED":
        return "Đã hủy";
      default:
        return status;
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-50 border-yellow-200";
      case "CONFIRMED":
      case "PREPARING":
        return "bg-blue-50 border-blue-200";
      case "SHIPPING":
        return "bg-orange-50 border-orange-200";
      case "DELIVERED":
        return "bg-green-50 border-green-200";
      case "CANCELLED":
        return "bg-red-50 border-red-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  const getOrderItemTotal = (item: OrderItem) => {
    const toppingTotal = (item.toppings ?? []).reduce(
      (sum, topping) => sum + topping.toppingPrice,
      0
    );

    return ((item.basePrice ?? item.price ?? 0) + toppingTotal) * item.quantity;
  };

  if (!user) {
    return (
      <div className="mx-auto w-full max-w-7xl px-4 py-12 text-center">
        <h1 className="mb-4 text-2xl font-bold text-neutral-900">
          Vui lòng đăng nhập
        </h1>
        <p className="mb-6 text-neutral-600">
          Bạn cần đăng nhập để xem lịch sử đơn hàng
        </p>
        <button
          onClick={() => navigate("/login")}
          className="rounded-full bg-orange-400 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-500"
        >
          Đăng nhập
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-7xl px-4 py-12 text-center">
        <p className="text-neutral-600">Đang tải đơn hàng...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl py-8 sm:py-12">
      <div className="px-4 sm:px-0">
        <h1 className="mb-2 font-serif text-4xl font-black text-neutral-900 sm:text-5xl">
          Đơn hàng của tôi
        </h1>
        <p className="mb-8 text-neutral-600">
          Bạn có {userOrders.length} đơn hàng
        </p>
      </div>

      {userOrders.length === 0 ? (
        <div className="mx-4 rounded-2xl border border-neutral-200 bg-white p-8 text-center shadow-sm sm:mx-0 sm:p-12">
          <FiPackage className="mx-auto mb-4 text-4xl text-neutral-300" />
          <p className="mb-4 text-lg font-semibold text-neutral-600">
            Bạn chưa có đơn hàng nào
          </p>
          <button
            onClick={() => navigate("/")}
            className="rounded-full bg-orange-400 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-500"
          >
            Bắt đầu mua sắm
          </button>
        </div>
      ) : (
        <div className="space-y-4 px-4 sm:px-0">
          {userOrders.map((order: Order) => (
            <div
              key={order.id}
              className={`rounded-2xl border-2 p-6 transition hover:shadow-md ${getStatusColor(order.status)}`}
            >
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {/* Order Info */}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                    Mã đơn hàng
                  </p>
                  <p className="mt-1 text-lg font-bold text-neutral-900">
                    {formatOrderCode(order.id)}
                  </p>
                </div>

                {/* Date */}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                    Ngày đặt
                  </p>
                  <p className="mt-1 font-bold text-neutral-900">
                    {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                  </p>
                </div>

                {/* Status */}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                    Trạng thái
                  </p>
                  <div className="mt-1 flex items-center gap-2">
                    {getStatusIcon(order.status)}
                    <span className="font-bold">{getStatusText(order.status)}</span>
                  </div>
                </div>

                {/* Total */}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                    Tổng tiền
                  </p>
                  <p className="mt-1 text-lg font-bold text-orange-500">
                    {formatPrice(order.total ?? order.finalAmount ?? order.totalAmount ?? 0)}
                  </p>
                </div>
              </div>

              {/* Items */}
              <div className="mt-4 border-t border-current border-opacity-20 pt-4">
                <div className="space-y-2">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <div>
                        <span className="font-semibold">{item.productName ?? item.title ?? ""}</span>

                        {(item.toppings?.length ?? 0) > 0 && (
                          <span className="text-neutral-600">
                            {" "}
                            +{" "}
                            {item.toppings
                              ?.map((tp) => tp.toppingName)
                              .join(", ")}
                          </span>
                        )}

                        <span className="text-neutral-600">
                          {" "}
                          × {item.quantity}
                        </span>
                      </div>

                      <span className="font-semibold">
                        {formatPrice(getOrderItemTotal(item))}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Details */}
              <div className="mt-4 grid gap-4 border-t border-current border-opacity-20 pt-4 text-sm sm:grid-cols-2">
                <div>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-neutral-600">
                    Giao đến
                  </p>
                  <p className="font-medium">{order.user?.name || order.customerName || "Khách hàng"}</p>
                  <p className="text-neutral-600">{order.phone}</p>
                  <p className="text-xs text-neutral-600">{order.address}</p>
                </div>

                <div>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-neutral-600">
                    Điểm thưởng
                  </p>
                  <p className="font-medium">Đã dùng: {order.usedPoint ?? 0} điểm</p>
                  <p className="text-neutral-600">
                    Nhận được: {order.earnedPoint ?? 0} điểm
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => navigate(`/orders/${order.id}`)}
                className="mt-4 w-full rounded-lg border-2 border-current border-opacity-30 py-2 text-sm font-semibold transition hover:bg-current hover:bg-opacity-10"
              >
                Xem chi tiết
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyOrders;