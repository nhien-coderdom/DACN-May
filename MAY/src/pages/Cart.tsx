import { useNavigate } from "react-router-dom";
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag } from "react-icons/fi";
import { useCart } from "../contexts/CartContext";

function Cart() {
  const navigate = useNavigate();
  const { cart, updateQuantity, removeFromCart, getTotalPrice } = useCart();

  const formatPrice = (value: number) =>
    new Intl.NumberFormat("vi-VN").format(value) + "đ";

  const subtotal = getTotalPrice();
  const shipping = cart.length > 0 ? 30000 : 0;
  const total = subtotal + shipping;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-400">
          Cart
        </p>
        <h1 className="mt-2 font-serif text-4xl font-black text-neutral-900 sm:text-5xl">
          Giỏ hàng của bạn
        </h1>
        <p className="mt-2 text-neutral-500">
          {cart.length} sản phẩm trong giỏ
        </p>
      </section>

      {cart.length === 0 ? (
        <div className="rounded-[32px] border border-neutral-200 bg-white p-12 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 text-orange-400">
            <FiShoppingBag size={28} />
          </div>

          <h2 className="mt-5 text-2xl font-bold text-neutral-900">
            Giỏ hàng của bạn đang trống
          </h2>

          <p className="mx-auto mt-3 max-w-md leading-7 text-neutral-500">
            Hãy khám phá các món best seller của MAY và thêm những sản phẩm bạn yêu thích vào giỏ hàng.
          </p>

          <button
            onClick={() => navigate("/")}
            className="mt-6 rounded-full bg-orange-400 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-500"
          >
            Tiếp tục mua sắm
          </button>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-4">
            {cart.map((item) => (
              <div
                key={`${item.id}-${item.size}-${item.toppings?.join("-") || "no-topping"}`}
                className="rounded-[28px] border border-neutral-200 bg-white p-5 shadow-sm transition hover:shadow-md"
              >
                <div className="flex flex-col gap-4 sm:flex-row">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-28 w-28 rounded-2xl object-cover"
                  />

                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-bold text-neutral-900">
                          {item.title}
                        </h3>

                        <p className="mt-1 text-sm font-semibold text-orange-500">
                          {formatPrice(item.price)}
                        </p>

                        <div className="mt-3 space-y-1 text-sm text-neutral-500">
                          {item.size && <p>Size: {item.size.toUpperCase()}</p>}
                          {item.toppings && item.toppings.length > 0 && (
                            <p>Topping: {item.toppings.join(", ")}</p>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="flex h-10 w-10 items-center justify-center rounded-full text-red-500 transition hover:bg-red-50"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-2 rounded-full border border-neutral-300 px-4 py-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="flex h-6 w-6 items-center justify-center text-neutral-600 transition hover:text-neutral-900"
                        >
                          <FiMinus size={16} />
                        </button>

                        <span className="w-6 text-center text-sm font-semibold text-neutral-900">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="flex h-6 w-6 items-center justify-center text-neutral-600 transition hover:text-neutral-900"
                        >
                          <FiPlus size={16} />
                        </button>
                      </div>

                      <p className="text-lg font-bold text-neutral-900">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="h-fit rounded-[32px] border border-neutral-200 bg-white p-6 shadow-sm lg:sticky lg:top-8">
            <h2 className="text-xl font-bold text-neutral-900">
              Tóm tắt đơn hàng
            </h2>

            <div className="mt-6 space-y-4 border-b border-neutral-200 pb-5 text-sm">
              <div className="flex items-center justify-between text-neutral-600">
                <span>Tạm tính</span>
                <span>{formatPrice(subtotal)}</span>
              </div>

              <div className="flex items-center justify-between text-neutral-600">
                <span>Phí vận chuyển</span>
                <span>{formatPrice(shipping)}</span>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between">
              <span className="text-base font-semibold text-neutral-900">
                Tổng cộng
              </span>
              <span className="text-2xl font-bold text-orange-500">
                {formatPrice(total)}
              </span>
            </div>

            <p className="mt-3 text-sm leading-6 text-neutral-500">
              Tổng thanh toán đã bao gồm các lựa chọn size, topping và phí vận chuyển.
            </p>

            <button
              onClick={() => navigate("/checkout")}
              className="mt-6 w-full rounded-full bg-orange-400 py-3 text-sm font-semibold text-white transition hover:bg-orange-500"
            >
              Tiến hành thanh toán
            </button>

            <button
              onClick={() => navigate("/")}
              className="mt-3 w-full rounded-full border-2 border-neutral-300 py-3 text-sm font-semibold text-neutral-700 transition hover:border-neutral-400"
            >
              Tiếp tục mua sắm
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;