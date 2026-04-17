import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiPackage } from "react-icons/fi";
import { useOrders } from "../contexts/OrdersContext";
import { useAuth } from "../contexts/AuthContext";
import OrderCard from "../components/OrderCard";
import type {
  Order,
  OrderItem,
  OrderStatus,
} from "../contexts/OrdersContext";

function MyOrders() {
  const navigate = useNavigate();
  const { orders, fetchOrders, loading } = useOrders();
  const { user } = useAuth();

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // NEW STATES
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [page, setPage] = useState(1);

  const ITEMS_PER_PAGE = 6;

  useEffect(() => {
    fetchOrders();
  }, []);

  const userOrders = user
    ? orders.filter((order) => order.userId === user.id)
    : [];

  /* ================= HELPERS ================= */

  const formatPrice = (value: number) =>
    new Intl.NumberFormat("vi-VN").format(value) + "đ";

  const getOrderItemTotal = (item: OrderItem) => {
    const toppingTotal = item.toppings.reduce(
      (sum, t) => sum + t.toppingPrice,
      0
    );
    return (item.basePrice + toppingTotal) * item.quantity;
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

  /* ================= FILTER ================= */

  const filteredOrders = userOrders.filter((order) => {
    const matchSearch =
      search === "" ||
      order.items.some((item) =>
        item.productName.toLowerCase().includes(search.toLowerCase())
      );

    const orderDate = new Date(order.createdAt).getTime();

    const matchFrom = fromDate
      ? orderDate >= new Date(fromDate).getTime()
      : true;

    const matchTo = toDate
      ? orderDate <= new Date(toDate).getTime()
      : true;

    return matchSearch && matchFrom && matchTo;
  });

  /* ================= PAGINATION ================= */

  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);

  const paginatedOrders = filteredOrders.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  /* ================= STATES ================= */

  if (!user) {
    return (
      <div className="mx-auto mt-20 w-full max-w-5xl px-4 py-14 text-center">
        <h1 className="mb-3 text-2xl font-bold">Vui lòng đăng nhập</h1>
        <button
          onClick={() => navigate("/login")}
          className="rounded-full bg-orange-500 px-6 py-3 text-white"
        >
          Đăng nhập
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-5xl px-4 py-14 text-center">
        Đang tải...
      </div>
    );
  }

  return (
    <div className="mx-auto mt-20 w-full max-w-6xl px-4 py-8">
      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold">Đơn hàng của tôi</h1>
        <p className="text-sm text-neutral-500">
          {filteredOrders.length} đơn hàng
        </p>
      </div>

      {/* FILTER */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <input
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
          placeholder="Tìm tên món..."
          className="w-full rounded-xl border px-3 py-2 text-sm sm:w-1/2"
        />

        <div className="flex gap-2">
          <input
            type="date"
            value={fromDate}
            onChange={(e) => {
              setPage(1);
              setFromDate(e.target.value);
            }}
            className="rounded-xl border px-2 py-2 text-sm"
          />
          <input
            type="date"
            value={toDate}
            onChange={(e) => {
              setPage(1);
              setToDate(e.target.value);
            }}
            className="rounded-xl border px-2 py-2 text-sm"
          />
        </div>
      </div>

      {/* EMPTY */}
      {paginatedOrders.length === 0 ? (
        <div className="text-center py-10">
          Không có đơn hàng phù hợp
        </div>
      ) : (
        <>
          {/* GRID */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {paginatedOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onClick={(o) => setSelectedOrder(o)}
              />
            ))}
          </div>

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="mt-6 flex justify-center gap-2">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`h-9 w-9 rounded-full ${page === i + 1
                    ? "bg-orange-500 text-white"
                    : "bg-neutral-100"
                    }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}

      {/* POPUP giữ nguyên của bạn */}
      {selectedOrder && (
        <div onClick={() => setSelectedOrder(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4" >
          <div onClick={(e) => e.stopPropagation()} className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white shadow-xl" >
            {/* HEADER */}
            <div className="sticky top-0 flex items-center justify-between border-b bg-white px-6 py-4">
              <div>
                <h2 className="text-lg font-bold"> Đơn #{selectedOrder.id}
                </h2>
                <p className="text-xs text-neutral-500">
                  {new Date(selectedOrder.createdAt).toLocaleDateString("vi-VN")} </p>
              </div>
              <button onClick={() => setSelectedOrder(null)}>✕</button>
            </div> <div className="p-6 space-y-6">
              {/* TIMELINE */}
              <div>
                <h3 className="mb-4 font-bold">Tiến trình đơn hàng</h3>
                <div className="flex overflow-x-auto justify-center items-center text-center">

                  {selectedOrder.logs?.map((log, index, arr) => {
                    const isLast = index === arr.length - 1;
                    return (<div key={log.id} className="relative flex min-w-30 flex-col items-center text-center" >
                      <div className={`z-10 h-10 w-10 rounded-full border-4 border-white ${getTimelineDotColor(log.status)}`} />
                      {!isLast && (
                        <div className="absolute top-5 left-1/2 h-0.5 w-full bg-neutral-200" />)}
                      <p className="mt-2 text-sm font-semibold"> {getTimelineStatusText(log.status)}
                      </p>
                      <span className="text-xs text-neutral-500"> {formatTime(log.createdAt)}
                      </span>
                    </div>);
                  })}
                </div>
              </div>
              {/* ITEMS */}
              <div>
                <h3 className="mb-3 font-bold">Sản phẩm</h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item) => {
                    console.log("Item:", item);
                    return (<div key={item.id} className="flex justify-between rounded-xl bg-neutral-50 p-3" >
                      <div>
                        <img src={item.product?.imageUrl || "/placeholder.png"} alt={item.productName} className="h-16 w-16 rounded-lg object-cover" />
                      </div>
                      <div>
                        <p className="font-semibold">{item.productName}</p>
                        {item.toppings.length > 0 && (<p className="text-xs text-neutral-500"> +{" "}
                          {item.toppings.map((t) => t.toppingName).join(", ")}
                        </p>)}
                        <p className="text-xs text-neutral-500"> SL: {item.quantity} </p>
                      </div>
                      <p className="font-semibold"> {formatPrice(getOrderItemTotal(item))} </p>
                    </div>);
                  })} </div> </div> {/* INFO */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl bg-neutral-50 p-4">
                  <p className="text-xs text-neutral-400">Giao hàng</p>
                  <p className="font-semibold"> {selectedOrder.user?.name} </p>
                  <p className="text-sm">{selectedOrder.phone}</p> <p className="text-sm">
                    {selectedOrder.address}</p> </div> <div className="rounded-xl bg-neutral-50 p-4">
                  <p className="text-xs text-neutral-400">Điểm thưởng</p>
                  <p className="text-sm"> Dùng: {selectedOrder.usedPoint} </p>
                  <p className="text-sm text-emerald-600"> +{selectedOrder.earnedPoint} </p>
                </div> </div> {/* TOTAL */} <div className="flex justify-between border-t pt-4 text-lg font-bold">
                <span>Tổng</span> <span className="text-[#086136]"> {formatPrice(selectedOrder.total)} </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div >
  );
}

export default MyOrders;