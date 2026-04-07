import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiPlus, FiMinus, FiShoppingCart, FiCheck } from "react-icons/fi";
import { useCart } from "../contexts/CartContext";
import { useProductDetail } from "../hooks/useProductDetail";

const sizes = [
  { id: "s", name: "S (250ml)", price: 0 },
  { id: "m", name: "M (350ml)", price: 5000 },
  { id: "l", name: "L (450ml)", price: 10000 },
];

function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const { product, relatedProducts, toppingOptions, isLoading, errorMessage } =
    useProductDetail(id);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("m");
  const [selectedToppings, setSelectedToppings] = useState<string[]>([]);
  const [showAddedMessage, setShowAddedMessage] = useState(false);

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-7xl px-4 py-12 text-center">
        <h1 className="mb-4 text-2xl font-bold text-neutral-900">
          Dang tai chi tiet san pham...
        </h1>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="mx-auto w-full max-w-7xl px-4 py-12 text-center">
        <h1 className="mb-4 text-2xl font-bold text-neutral-900">
          Khong the tai san pham
        </h1>
        <p className="mb-4 text-sm text-neutral-600">{errorMessage}</p>
        <button
          onClick={() => window.location.reload()}
          className="rounded-full bg-orange-400 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-500"
        >
          Thu lai
        </button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto w-full max-w-7xl px-4 py-12 text-center">
        <h1 className="mb-4 text-2xl font-bold text-neutral-900">
          Sản phẩm không tìm thấy
        </h1>
        <button
          onClick={() => navigate("/")}
          className="rounded-full bg-orange-400 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-500"
        >
          Quay về trang chủ
        </button>
      </div>
    );
  }

  const formatPrice = (value: number) =>
    new Intl.NumberFormat("vi-VN").format(value) + "đ";

  const sizePrice = sizes.find((s) => s.id === selectedSize)?.price || 0;
  const toppingsPrice = selectedToppings.reduce(
    (sum, toppingId) =>
      sum +
      (toppingOptions.find((t) => String(t.id) === toppingId)?.price || 0),
    0
  );

  const totalItemPrice = product.price + sizePrice + toppingsPrice;
  const totalPrice = totalItemPrice * quantity;

  const toggleTopping = (toppingId: string) => {
    setSelectedToppings((prev) =>
      prev.includes(toppingId)
        ? prev.filter((t) => t !== toppingId)
        : [...prev, toppingId]
    );
  };

  const handleAddToCart = () => {
    const selectedToppingNames = toppingOptions
      .filter((topping) => selectedToppings.includes(String(topping.id)))
      .map((topping) => topping.name);

    addToCart({
      id: product.id,
      title: product.title,
      image: product.image,
      price: totalItemPrice,
      quantity,
      size: selectedSize,
      toppings: selectedToppingNames,
    });
    setShowAddedMessage(true);
    setTimeout(() => setShowAddedMessage(false), 2000);
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="rounded-[36px] bg-white p-6 shadow-xl sm:p-8 lg:p-10">
        <div className="grid items-start gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-neutral-100 to-neutral-50 shadow-lg">
            <img
              src={product.image}
              alt={product.title}
              className="h-[360px] w-full object-cover sm:h-[460px] lg:h-[620px]"
            />
            <div className="absolute left-5 top-5 rounded-full bg-orange-400 px-4 py-2 text-sm font-semibold text-white shadow-md">
              {product.tag}
            </div>
          </div>

          <div className="flex flex-col">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-400">
              Product Detail
            </p>

            <h1 className="mt-3 font-serif text-3xl font-black leading-tight text-neutral-900 sm:text-4xl lg:text-5xl">
              {product.title}
            </h1>

            <p className="mt-3 text-lg font-semibold text-orange-400 sm:text-xl">
              {product.subtitle}
            </p>

            <div className="mt-6 rounded-[24px] border border-neutral-200 bg-neutral-50 p-5">
              <p className="text-sm leading-8 text-neutral-600 sm:text-base">
                {product.fullDescription}
              </p>
            </div>

            <div className="mt-6 flex items-end justify-between gap-4 border-b border-neutral-200 pb-6">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">
                  Base Price
                </p>
                <p className="mt-2 text-3xl font-bold text-orange-500 sm:text-4xl">
                  {formatPrice(product.price)}
                </p>
              </div>

              <div className="rounded-2xl bg-orange-50 px-4 py-3 text-right">
                <p className="text-xs uppercase tracking-wide text-neutral-500">
                  Calories
                </p>
                <p className="mt-1 font-bold text-neutral-900">
                  {product.calories} cal
                </p>
              </div>
            </div>

            <div className="mt-6">
              <p className="mb-3 text-sm font-semibold text-neutral-900">Size</p>
              <div className="grid grid-cols-3 gap-3">
                {sizes.map((size) => (
                  <button
                    key={size.id}
                    onClick={() => setSelectedSize(size.id)}
                    className={`rounded-2xl border-2 px-3 py-4 text-sm font-semibold transition-all ${
                      selectedSize === size.id
                        ? "border-orange-400 bg-orange-50 text-orange-600 shadow-sm"
                        : "border-neutral-300 bg-white text-neutral-700 hover:border-neutral-400"
                    }`}
                  >
                    <div>{size.name}</div>
                    <div className="mt-1 text-xs">
                      {size.price > 0 ? `+${formatPrice(size.price)}` : "Free"}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <p className="mb-3 text-sm font-semibold text-neutral-900">
                Toppings (Optional)
              </p>
              {toppingOptions.length === 0 ? (
                <div className="rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-500">
                  San pham nay hien chua co topping tuy chon.
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {toppingOptions.map((topping) => {
                    const toppingId = String(topping.id);
                    const active = selectedToppings.includes(toppingId);

                    return (
                      <button
                        key={topping.id}
                        onClick={() => toggleTopping(toppingId)}
                        className={`flex items-center justify-between rounded-2xl border-2 px-4 py-3 text-sm font-medium transition-all ${
                          active
                            ? "border-orange-400 bg-orange-50 text-orange-600"
                            : "border-neutral-300 bg-white text-neutral-700 hover:border-neutral-400"
                        }`}
                      >
                        <span>{topping.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs">+{formatPrice(topping.price)}</span>
                          {active && <FiCheck size={16} />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-[auto_1fr]">
              <div>
                <p className="mb-3 text-sm font-semibold text-neutral-900">
                  Số lượng
                </p>
                <div className="flex items-center gap-2 rounded-full border-2 border-neutral-300 px-4 py-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="flex h-6 w-6 items-center justify-center text-neutral-600 transition hover:text-neutral-900"
                  >
                    <FiMinus size={18} />
                  </button>
                  <span className="w-6 text-center font-semibold text-neutral-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="flex h-6 w-6 items-center justify-center text-neutral-600 transition hover:text-neutral-900"
                  >
                    <FiPlus size={18} />
                  </button>
                </div>
              </div>

              <div className="rounded-[24px] border border-neutral-200 bg-neutral-50 p-5">
                <div className="space-y-2 text-sm text-neutral-600">
                  <div className="flex justify-between">
                    <span>
                      {product.title} × {quantity}
                    </span>
                    <span>{formatPrice(product.price * quantity)}</span>
                  </div>

                  {sizePrice > 0 && (
                    <div className="flex justify-between">
                      <span>
                        Size: {sizes.find((s) => s.id === selectedSize)?.name}
                      </span>
                      <span>+{formatPrice(sizePrice * quantity)}</span>
                    </div>
                  )}

                  {selectedToppings.length > 0 && (
                    <div className="flex justify-between">
                      <span>Toppings × {selectedToppings.length}</span>
                      <span>+{formatPrice(toppingsPrice * quantity)}</span>
                    </div>
                  )}
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-neutral-300 pt-4">
                  <span className="text-base font-semibold text-neutral-900">
                    Tổng cộng
                  </span>
                  <span className="text-2xl font-bold text-orange-500">
                    {formatPrice(totalPrice)}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={handleAddToCart}
                className="relative flex-1 rounded-full bg-orange-400 px-6 py-4 text-sm font-bold text-white shadow-md transition-all hover:-translate-y-[1px] hover:bg-orange-500 hover:shadow-lg"
              >
                <span className="inline-flex items-center justify-center gap-2">
                  <FiShoppingCart size={18} />
                  Thêm vào giỏ
                </span>

                {showAddedMessage && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-full bg-orange-400">
                    <div className="flex items-center gap-2 text-white">
                      <FiCheck size={18} />
                      Đã thêm
                    </div>
                  </div>
                )}
              </button>

              <button
                onClick={() => navigate("/cart")}
                className="flex-1 rounded-full border-2 border-neutral-300 px-6 py-4 text-sm font-bold text-neutral-700 transition-all hover:border-neutral-400 hover:bg-neutral-50"
              >
                Xem giỏ
              </button>
            </div>

            <div className="mt-6">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.15em] text-neutral-500">
                Thành phần
              </p>
              <div className="flex flex-wrap gap-2">
                {product.ingredients.map((ingredient) => (
                  <span
                    key={ingredient}
                    className="rounded-full bg-orange-100 px-4 py-2 text-sm font-medium text-orange-700"
                  >
                    {ingredient}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {relatedProducts.length > 0 && (
        <section className="mt-14 border-t border-neutral-200 pt-12">
          <h2 className="mb-8 font-serif text-3xl font-black text-neutral-900 sm:text-4xl">
            Sản phẩm liên quan
          </h2>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {relatedProducts.map((drink) => (
              <button
                key={drink.id}
                onClick={() => navigate(`/product/${drink.id}`)}
                className="group overflow-hidden rounded-[26px] border border-neutral-200 bg-white text-left shadow-sm transition-all hover:-translate-y-[2px] hover:shadow-md"
              >
                <div className="relative h-48 overflow-hidden bg-neutral-100">
                  <img
                    src={drink.image}
                    alt={drink.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <span className="absolute left-3 top-3 rounded-full bg-orange-400 px-3 py-1 text-xs font-semibold text-white">
                    {drink.tag}
                  </span>
                </div>

                <div className="p-5">
                  <h3 className="font-bold text-neutral-800">{drink.title}</h3>
                  <p className="mt-1 text-sm text-neutral-500">
                    {drink.subtitle}
                  </p>
                  <p className="mt-4 text-lg font-bold text-orange-500">
                    {formatPrice(drink.price)}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default ProductDetail;