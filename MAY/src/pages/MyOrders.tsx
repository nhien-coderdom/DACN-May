import { useNavigate } from "react-router-dom";
import { FiPackage, FiTruck, FiCheckCircle, FiXCircle, FiClock } from "react-icons/fi";
import { useOrders } from "../contexts/OrdersContext";
import { useAuth } from "../contexts/AuthContext";
import type { Order, OrderStatus } from "../contexts/OrdersContext";

function MyOrders() {
  const navigate = useNavigate();
  const { orders, getUserOrders } = useOrders();
  const { user } = useAuth();

  const userOrders = user ? getUserOrders(user.email) : [];

  const formatPrice = (value: number) =>
    new Intl.NumberFormat("vi-VN").format(value) + "đ";

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case "pending":
        return <FiClock className="text-yellow-500" size={20} />;
      case "confirmed":
        return <FiPackage className="text-blue-500" size={20} />;
      case "shipped":
        return <FiTruck className="text-orange-500" size={20} />;
      case "delivered":
        return <FiCheckCircle className="text-green-500" size={20} />;
      case "cancelled":
        return <FiXCircle className="text-red-500" size={20} />;
    }
  };

  const getStatusText = (status: OrderStatus) => {
    switch (status) {
      case "pending":
        return "Đang xử lý";
      case "confirmed":
        return "Đã xác nhận";
      case "shipped":
        return "Đang giao";
      case "delivered":
        return "Đã giao";
      case "cancelled":
        return "Đã hủy";
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case "pending":
        return "bg-yellow-50 border-yellow-200";
      case "confirmed":
        return "bg-blue-50 border-blue-200";
      case "shipped":
        return "bg-orange-50 border-orange-200";
      case "delivered":
        return "bg-green-50 border-green-200";
      case "cancelled":
        return "bg-red-50 border-red-200";
    }
  };

  if (!user) {
    return (
      <div className="mx-auto w-full max-w-7xl px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-neutral-900 mb-4">
          Vui lòng đăng nhập
        </h1>
        <p className="text-neutral-600 mb-6">
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

  return (
    <div className="mx-auto w-full max-w-7xl py-8 sm:py-12">
      <div className="px-4 sm:px-0">
        <h1 className="font-serif text-4xl sm:text-5xl font-black text-neutral-900 mb-2">
          Đơn hàng của tôi
        </h1>
        <p className="text-neutral-600 mb-8">
          Bạn có {userOrders.length} đơn hàng
        </p>
      </div>

      {userOrders.length === 0 ? (
        <div className="rounded-2xl bg-white p-8 sm:p-12 text-center shadow-sm border border-neutral-200 mx-4 sm:mx-0">
          <FiPackage className="mx-auto mb-4 text-4xl text-neutral-300" />
          <p className="text-lg font-semibold text-neutral-600 mb-4">
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
                  <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                    Mã đơn hàng
                  </p>
                  <p className="mt-1 font-bold text-neutral-900 text-lg">
                    {order.orderId}
                  </p>
                </div>

                {/* Date */}
                <div>
                  <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                    Ngày đặt
                  </p>
                  <p className="mt-1 font-bold text-neutral-900">
                    {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                  </p>
                </div>

                {/* Status */}
                <div>
                  <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                    Trạng thái
                  </p>
                  <div className="mt-1 flex items-center gap-2">
                    {getStatusIcon(order.status)}
                    <span className="font-bold">{getStatusText(order.status)}</span>
                  </div>
                </div>

                {/* Total */}
                <div>
                  <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                    Tổng tiền
                  </p>
                  <p className="mt-1 text-lg font-bold text-orange-500">
                    {formatPrice(order.finalAmount)}
                  </p>
                </div>
              </div>

              {/* Items */}
              <div className="mt-4 border-t border-current border-opacity-20 pt-4">
                <div className="space-y-2">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <div>
                        <span className="font-semibold">{item.title}</span>
                        {item.size && <span className="text-neutral-600"> - Size {item.size.toUpperCase()}</span>}
                        {item.toppings && item.toppings.length > 0 && (
                          <span className="text-neutral-600"> + {item.toppings.join(", ")}</span>
                        )}
                        <span className="text-neutral-600"> × {item.quantity}</span>
                      </div>
                      <span className="font-semibold">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Details */}
              <div className="mt-4 grid gap-4 sm:grid-cols-2 border-t border-current border-opacity-20 pt-4 text-sm">
                <div>
                  <p className="text-xs font-semibold text-neutral-600 uppercase tracking-wider mb-1">
                    Giao đến
                  </p>
                  <p className="font-medium">{order.customerName}</p>
                  <p className="text-neutral-600">{order.phone}</p>
                  <p className="text-neutral-600 text-xs">{order.address}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-neutral-600 uppercase tracking-wider mb-1">
                    Phương thức thanh toán
                  </p>
                  <p className="font-medium capitalize">
                    {order.paymentMethod === "cod" ? "Thanh toán khi nhận" : "Chuyển khoản"}
                  </p>
                  {order.estimatedDelivery && (
                    <p className="mt-2 text-xs text-neutral-600">
                      Dự kiến giao: {new Date(order.estimatedDelivery).toLocaleDateString("vi-VN")}
                    </p>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => {
                  /* Chi tiết đơn hàng */
                }}
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
