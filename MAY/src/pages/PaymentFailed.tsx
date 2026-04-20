import { useSearchParams, useNavigate } from "react-router-dom";
import { FiAlertCircle } from "react-icons/fi";

export default function PaymentFailed() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const orderId = searchParams.get("orderId");
  const error = searchParams.get("error");

  const getErrorMessage = () => {
    switch (error) {
      case "payment_failed":
        return "Thanh toán đã bị từ chối. Vui lòng kiểm tra thông tin và thử lại.";
      case "invalid_signature":
        return "Có lỗi xác minh với VNPay. Vui lòng liên hệ với chúng tôi.";
      case "payment_not_found":
        return "Không tìm thấy thông tin thanh toán. Vui lòng liên hệ với chúng tôi.";
      default:
        return "Thanh toán không thành công. Vui lòng thử lại hoặc chọn phương thức khác.";
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-red-50 to-white">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="mb-6">
          <FiAlertCircle size={80} className="text-red-500 mx-auto" />
        </div>

        <h1 className="text-3xl font-bold text-red-700 mb-2">
          Thanh toán thất bại!
        </h1>

        <p className="text-gray-600 mb-6">{getErrorMessage()}</p>

        {orderId && (
          <div className="bg-white rounded-lg p-4 mb-6 border border-gray-200">
            <p className="text-sm text-gray-500">Mã đơn hàng</p>
            <p className="text-2xl font-bold text-gray-800">#{orderId}</p>
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={() => navigate("/cart")}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 rounded-lg transition"
          >
            Quay lại giỏ hàng
          </button>

          <button
            onClick={() => navigate("/")}
            className="w-full border-2 border-gray-300 hover:border-gray-400 text-gray-800 font-semibold py-3 rounded-lg transition"
          >
            Tiếp tục mua sắm
          </button>
        </div>

        <p className="text-xs text-gray-500 mt-6">
          Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi.
        </p>
      </div>
    </div>
  );
}
