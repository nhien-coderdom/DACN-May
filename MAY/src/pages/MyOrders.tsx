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
  }, []);

  const userOrders = user
    ? orders.filter((order) => order.userId === user.id)
    : [];

  const formatPrice = (value: number) =>
    new Intl.NumberFormat("vi-VN").format(value) + "đ";

  const formatOrderCode = (id: number) =>
    `ORD-${String(id).padStart(3, "0")}`;

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case "PENDING":
        return <FiClock className="text-amber-500" size={16} />;
      case "CONFIRMED":
      case "PREPARING":
        return <FiPackage className="text-sky-500" size={16} />;
      case "SHIPPING":
        return <FiTruck className="text-orange-500" size={16} />;
      case "DELIVERED":
        return <FiCheckCircle className="text-emerald-500" size={16} />;
      case "CANCELLED":
        return <FiXCircle className="text-rose-500" size={16} />;
      default:
        return <FiClock className="text-gray-500" size={16} />;
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

  // Badge nhẹ, không tô cả card
  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case "PENDING":
        return "bg-amber-50 text-amber-700 border border-amber-200";
      case "CONFIRMED":
      case "PREPARING":
        return "bg-sky-50 text-sky-700 border border-sky-200";
      case "SHIPPING":
        return "bg-orange-50 text-orange-700 border border-orange-200";
      case "DELIVERED":
        return "bg-emerald-50 text-emerald-700 border border-emerald-200";
      case "CANCELLED":
        return "bg-rose-50 text-rose-700 border border-rose-200";
      default:
        return "bg-gray-50 text-gray-700 border border-gray-200";
    }
  };


  const getOrderItemTotal = (item: OrderItem) => {
    const toppingTotal = item.toppings.reduce(
      (sum, topping) => sum + topping.toppingPrice,
      0
    );

    return (item.basePrice + toppingTotal) * item.quantity;
  };

  const getEstimatedMinutes = (createdAt: string) => {
    const created = new Date(createdAt).getTime();
    const now = Date.now();

    // giả sử đơn giao trong 45 phút
    const deliveryDuration = 45 * 60 * 1000;

    const eta = Math.max(
      0,
      Math.ceil((created + deliveryDuration - now) / (60 * 1000))
    );

    return eta;
  };

  const formatTime = (date: string) =>
    new Date(date).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });

  const getTimelineStatusText = (status: OrderStatus) => {
    switch (status) {
      case "PENDING":
        return "Đã đặt hàng";
      case "CONFIRMED":
        return "Đã xác nhận";
      case "PREPARING":
        return "Đang chuẩn bị";
      case "SHIPPING":
        return "Đang giao";
      case "DELIVERED":
        return "Đã giao thành công";
      case "CANCELLED":
        return "Đã hủy đơn";
      default:
        return status;
    }
  };

  const getTimelineDotColor = (status: OrderStatus) => {
    switch (status) {
      case "PENDING":
        return "bg-amber-400";
      case "CONFIRMED":
        return "bg-sky-400";
      case "PREPARING":
        return "bg-violet-400";
      case "SHIPPING":
        return "bg-orange-400";
      case "DELIVERED":
        return "bg-emerald-500";
      case "CANCELLED":
        return "bg-rose-500";
      default:
        return "bg-gray-400";
    }
  };

  const getTimelineTextColor = (status: OrderStatus) => {
    switch (status) {
      case "PENDING":
        return "text-amber-700";
      case "CONFIRMED":
        return "text-sky-700";
      case "PREPARING":
        return "text-violet-700";
      case "SHIPPING":
        return "text-orange-700";
      case "DELIVERED":
        return "text-emerald-700";
      case "CANCELLED":
        return "text-rose-700";
      default:
        return "text-gray-700";
    }
  };

  if (!user) {
    return (
      <div className="mx-auto w-full max-w-5xl px-4 py-14 text-center">
        <h1 className="mb-3 text-2xl font-bold text-neutral-900">
          Vui lòng đăng nhập
        </h1>
        <p className="mb-6 text-neutral-600">
          Bạn cần đăng nhập để xem lịch sử đơn hàng
        </p>
        <button
          onClick={() => navigate("/login")}
          className="rounded-full bg-orange-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
        >
          Đăng nhập
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-5xl px-4 py-14 text-center">
        <p className="text-neutral-600">Đang tải đơn hàng...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:py-10">
      {/* PAGE HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-4xl">
          Đơn hàng của tôi
        </h1>
        <p className="mt-2 text-sm text-neutral-500">
          Bạn có <span className="font-semibold text-neutral-800">{userOrders.length}</span> đơn hàng
        </p>
      </div>

      {userOrders.length === 0 ? (
        <div className="rounded-3xl border border-neutral-200 bg-white px-6 py-12 text-center shadow-sm">
          <FiPackage className="mx-auto mb-4 text-4xl text-neutral-300" />
          <p className="mb-2 text-lg font-semibold text-neutral-800">
            Bạn chưa có đơn hàng nào
          </p>
          <p className="mb-6 text-sm text-neutral-500">
            Hãy chọn món yêu thích và bắt đầu đơn đầu tiên nhé.
          </p>
          <button
            onClick={() => navigate("/")}
            className="rounded-full bg-orange-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
          >
            Bắt đầu mua sắm
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          {userOrders.map((order: Order) => (
            <div
              key={order.id}
              className="overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm transition hover:shadow-md"
            >
              {/* HEADER */}
              <div className="px-5 py-5 sm:px-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  {/* LEFT */}
                  <div className="space-y-2">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-400">
                        Mã đơn hàng
                      </p>
                      <p className="mt-1 text-xl font-extrabold text-neutral-900">
                        {formatOrderCode(order.id)}
                      </p>
                    </div>

                    <p className="text-sm text-neutral-500">
                      Đặt ngày{" "}
                      <span className="font-medium text-neutral-700">
                        {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                      </span>
                    </p>

                    {/* ETA */}
                    {order.status === "SHIPPING" && (
                      <div className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1.5 text-xs font-semibold text-orange-700">
                        <FiTruck size={14} />
                        Dự kiến giao trong {getEstimatedMinutes(order.createdAt)} phút
                      </div>
                    )}
                  </div>

                  {/* RIGHT */}
                  <div className="flex flex-col items-start gap-3 md:items-end">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(order.status)}
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${getStatusBadge(
                          order.status
                        )}`}
                      >
                        {getStatusText(order.status)}
                      </span>
                    </div>

                    <div className="text-left md:text-right">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-400">
                        Tổng thanh toán
                      </p>
                      <p className="mt-1 text-2xl font-extrabold text-orange-500">
                        {formatPrice(order.total)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* PROGRESS */}
                <div className="mt-5 rounded-2xl border border-neutral-100 bg-neutral-50/70 p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <h4 className="text-sm font-bold text-neutral-900">Tiến trình đơn hàng</h4>
                    <span className="text-xs text-neutral-500">
                      {order.logs?.length || 0} cập nhật
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <div className="flex min-w-170 items-start">
                      {order.logs?.map((log, index, arr) => {
                        const isLast = index === arr.length - 1;

                        return (
                          <div
                            key={log.id}
                            className="relative flex flex-1 flex-col items-center text-center"
                          >
                            {/* Dot */}
                            <div
                              className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-4 border-white shadow-sm ${getTimelineDotColor(
                                log.status
                              )}`}
                            >
                              <div className="h-2.5 w-2.5 rounded-full bg-white" />
                            </div>

                            {/* Line nối */}
                            {!isLast && (
                              <div className="absolute left-1/2 top-5 h-0.5 w-full bg-neutral-200">
                                <div className="h-full w-full bg-orange-200" />
                              </div>
                            )}

                            {/* Status */}
                            <p
                              className={`mt-3 text-sm font-semibold ${getTimelineTextColor(
                                log.status
                              )}`}
                            >
                              {getTimelineStatusText(log.status)}
                            </p>

                            {/* Time */}
                            <span className="mt-1 text-xs text-neutral-500">
                              {formatTime(log.createdAt)}
                            </span>

                            {/* Date */}
                            <span className="text-[11px] text-neutral-400">
                              {new Date(log.createdAt).toLocaleDateString("vi-VN")}
                            </span>

                            {/* Note */}
                            {log.note && (
                              <p className="mt-2 max-w-32.5 text-[11px] leading-4 text-neutral-500">
                                {log.note}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* ITEMS */}
              <div className="border-t border-neutral-100 px-5 py-5 sm:px-6">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-neutral-900">
                    Sản phẩm đã đặt
                  </h3>
                  <span className="text-sm text-neutral-500">
                    {order.items.length} món
                  </span>
                </div>

                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between rounded-2xl border border-neutral-100 bg-neutral-50/70 p-3"
                    >
                      {/* LEFT */}
                      <div className="flex min-w-0 items-center gap-3">
                        <img
                          src={item.product?.image || "/placeholder-image.jpg"}
                          alt=""
                          className="h-14 w-14 rounded-xl object-cover border border-neutral-200 bg-white"
                        />

                        <div className="min-w-0">
                          <p className="truncate font-semibold text-sm text-neutral-900">
                            {item.productName}
                          </p>

                          {item.toppings.length > 0 && (
                            <p className="mt-1 line-clamp-1 text-xs text-neutral-500">
                              +{" "}
                              {item.toppings
                                .map((tp) => tp.toppingName)
                                .join(", ")}
                            </p>
                          )}

                          <p className="mt-1 text-xs text-neutral-500">
                            SL:{" "}
                            <span className="font-medium text-neutral-700">
                              {item.quantity}
                            </span>
                          </p>
                        </div>
                      </div>

                      {/* RIGHT */}
                      <div className="ml-3 text-right shrink-0">
                        <p className="text-xs text-neutral-500">
                          {formatPrice(item.basePrice)} / món
                        </p>
                        <p className="mt-1 text-sm font-bold text-neutral-900">
                          {formatPrice(getOrderItemTotal(item))}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* INFO */}
              <div className="grid gap-3 border-t border-neutral-100 px-5 py-5 sm:grid-cols-2 sm:px-6">
                <div className="rounded-2xl border border-neutral-100 bg-neutral-50/70 p-4">
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-400">
                    Thông tin giao hàng
                  </p>
                  <p className="font-semibold text-neutral-900">
                    {order.user?.name || "Khách hàng"}
                  </p>
                  <p className="mt-1 text-sm text-neutral-600">{order.phone}</p>
                  <p className="mt-1 text-sm text-neutral-600">{order.address}</p>
                </div>

                <div className="rounded-2xl border border-neutral-100 bg-neutral-50/70 p-4">
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-400">
                    Điểm thưởng
                  </p>
                  <p className="text-sm text-neutral-700">
                    Đã dùng:{" "}
                    <span className="font-semibold text-neutral-900">
                      {order.usedPoint}
                    </span>{" "}
                    điểm
                  </p>
                  <p className="mt-1 text-sm text-neutral-700">
                    Nhận được:{" "}
                    <span className="font-semibold text-emerald-600">
                      +{order.earnedPoint}
                    </span>{" "}
                    điểm
                  </p>
                </div>
              </div>

              {/* FOOTER */}
              <div className="flex justify-end border-t border-neutral-100 px-5 py-4 sm:px-6">
                <button
                  onClick={() => navigate(`/orders/${order.id}`)}
                  className="rounded-xl border border-neutral-300 px-4 py-2 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-50"
                >
                  Xem chi tiết
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyOrders;