import { useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { FiCheckCircle } from "react-icons/fi";
import { useCart } from "../contexts/CartContext";

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const hasClearedCart = useRef(false);

  const orderId = searchParams.get("orderId");
  const transactionId = searchParams.get("transactionId");

  useEffect(() => {
    if (!orderId) return;
    if (hasClearedCart.current) return;

    clearCart();
    hasClearedCart.current = true;
  }, [orderId, clearCart]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-green-50 to-white">
      <div className="mx-auto max-w-md px-4 text-center">
        <div className="mb-6">
          <FiCheckCircle size={80} className="mx-auto text-green-500" />
        </div>

        <h1 className="mb-2 text-3xl font-bold text-green-700">
          Thanh toán thành công!
        </h1>

        <p className="mb-4 text-gray-600">
          Giao dịch của bạn đã được ghi nhận thành công.
        </p>

        <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-700">
          Đơn hàng của bạn đã được tạo và hiện đang ở trạng thái chờ staff xác nhận.
        </div>

        {orderId ? (
          <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4">
            <p className="text-sm text-gray-500">Mã đơn hàng</p>
            <p className="text-2xl font-bold text-gray-800">#{orderId}</p>
          </div>
        ) : (
          <div className="mb-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-700">
            Không tìm thấy mã đơn hàng trong kết quả thanh toán. Vui lòng vào trang
            đơn hàng để kiểm tra lại.
          </div>
        )}

        {transactionId && (
          <div className="mb-6 text-xs text-gray-500">
            Mã giao dịch: {transactionId}
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={() => navigate("/my-orders")}
            className="w-full rounded-lg bg-green-500 py-3 font-semibold text-white transition hover:bg-green-600"
          >
            Xem đơn hàng của tôi
          </button>

          <button
            onClick={() => navigate("/")}
            className="w-full rounded-lg bg-gray-200 py-3 font-semibold text-gray-800 transition hover:bg-gray-300"
          >
            Tiếp tục mua sắm
          </button>
        </div>

        <p className="mt-6 text-xs text-gray-500">
          Staff sẽ xác nhận đơn hàng của bạn trong thời gian sớm nhất.
        </p>
      </div>
    </div>
  );
}