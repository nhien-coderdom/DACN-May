import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiPlus, FiMinus, FiShoppingCart, FiCheck } from "react-icons/fi";
import { useCart } from "../contexts/CartContext";
import { useProductById, useProducts } from "../hooks/useProducts";

const sizes = [
  { id: "s", name: "S (250ml)", price: 0 },
  { id: "m", name: "M (350ml)", price: 5000 },
  { id: "l", name: "L (450ml)", price: 10000 },
];

const fallbackToppings = [
  { id: "boba", name: "Boba", price: 10000 },
  { id: "jelly", name: "Jelly", price: 8000 },
  { id: "pudding", name: "Pudding", price: 8000 },
  { id: "egg", name: "Egg", price: 12000 },
];

const fallbackImage =
  "https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=800&q=80";

function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const parsedId = Number(id);
  const productId = Number.isNaN(parsedId) ? undefined : parsedId;

  const { product, loading, error } = useProductById(productId);
  const { products } = useProducts();

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("m");
  const [selectedToppings, setSelectedToppings] = useState<string[]>([]);
  const [showAddedMessage, setShowAddedMessage] = useState(false);

  const availableToppings = useMemo(() => {
    if (product?.toppings && product.toppings.length > 0) {
      return product.toppings.map((topping) => ({
        id: String(topping.id),
        name: topping.name,
        price: topping.price,
      }));
    }

    return fallbackToppings;
  }, [product]);

  const formatPrice = (value: number) =>
    new Intl.NumberFormat("vi-VN").format(value) + "đ";

  const sizePrice = sizes.find((s) => s.id === selectedSize)?.price || 0;
  const toppingsPrice = selectedToppings.reduce(
    (sum, toppingId) =>
      sum + (availableToppings.find((t) => t.id === toppingId)?.price || 0),
    0
  );

  const totalItemPrice = (product?.price || 0) + sizePrice + toppingsPrice;
  const totalPrice = totalItemPrice * quantity;

  const toggleTopping = (toppingId: string) => {
    setSelectedToppings((prev) =>
      prev.includes(toppingId)
        ? prev.filter((t) => t !== toppingId)
        : [...prev, toppingId]
    );
  };

  const handleAddToCart = () => {
    if (!product) {
      return;
    }

    addToCart({
      id: product.id,
      title: product.name,
      image: product.imageUrl || fallbackImage,
      price: totalItemPrice,
      quantity,
      size: selectedSize,
      toppings: selectedToppings,
    });

    setShowAddedMessage(true);
    setTimeout(() => setShowAddedMessage(false), 2000);
  };

  const relatedProducts = useMemo(() => {
    if (!product) {
      return [];
    }

    return products
      .filter((item) => item.id !== product.id && item.categoryId === product.categoryId)
      .slice(0, 3);
  }, [product, products]);

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-7xl px-4 py-12 text-center">
        <p className="text-neutral-600">loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto w-full max-w-7xl px-4 py-12 text-center">
        <h1 className="mb-2 text-2xl font-bold text-neutral-900">Không thể tải sản phẩm</h1>
        <p className="mb-4 text-neutral-600">{error}</p>
        <button
          onClick={() => navigate("/")}
          className="rounded-full bg-orange-400 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-500"
        >
          Quay về trang chủ
        </button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto w-full max-w-7xl px-4 py-12 text-center">
        <h1 className="mb-4 text-2xl font-bold text-neutral-900">Sản phẩm không tìm thấy</h1>
        <button
          onClick={() => navigate("/")}
          className="rounded-full bg-orange-400 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-500"
        >
          Quay về trang chủ
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="rounded-[36px] bg-white p-6 shadow-xl sm:p-8 lg:p-10">
        <div className="grid items-start gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-neutral-100 to-neutral-50 shadow-lg">
            <img
              src={product.imageUrl || fallbackImage}
              className="h-[360px] w-full object-cover sm:h-[460px] lg:h-[620px]"
            />
            <div className="absolute left-5 top-5 rounded-full bg-orange-400 px-4 py-2 text-sm font-semibold text-white shadow-md">
              {product.category?.name || "Do uong"}
            </div>
          </div>

          <div className="flex flex-col">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-400">
              Product Detail
            </p>

            <h1 className="mt-3 font-serif text-3xl font-black leading-tight text-neutral-900 sm:text-4xl lg:text-5xl">
              {product.name}
            </h1>

            <p className="mt-3 text-lg font-semibold text-orange-400 sm:text-xl">
              Tùy chọn size và topping theo sở thích
            </p>

            <div className="mt-6 rounded-[24px] border border-neutral-200 bg-neutral-50 p-5">
              <p className="text-sm leading-8 text-neutral-600 sm:text-base">
                {product.description || "Đồ uống được pha chế tại MAY với nguyên liệu chọn lọc."}
              </p>
            </div>

            <div className="mt-6 flex items-end justify-between gap-4 border-b border-neutral-200 pb-6">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">Base Price</p>
                <p className="mt-2 text-3xl font-bold text-orange-500 sm:text-4xl">
                  {formatPrice(product.price)}
                </p>
              </div>

              <div className="rounded-2xl bg-orange-50 px-4 py-3 text-right">
                <p className="text-xs uppercase tracking-wide text-neutral-500">Category</p>
                <p className="mt-1 font-bold text-neutral-900">{product.category?.name || "N/A"}</p>
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
              <p className="mb-3 text-sm font-semibold text-neutral-900">Toppings (Optional)</p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {availableToppings.map((topping) => {
                  const active = selectedToppings.includes(topping.id);

                  return (
                    <button
                      key={topping.id}
                      onClick={() => toggleTopping(topping.id)}
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
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-[auto_1fr]">
              <div>
                <p className="mb-3 text-sm font-semibold text-neutral-900">Số lượng</p>
                <div className="flex items-center gap-2 rounded-full border-2 border-neutral-300 px-4 py-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="flex h-6 w-6 items-center justify-center text-neutral-600 transition hover:text-neutral-900"
                  >
                    <FiMinus size={18} />
                  </button>
                  <span className="w-6 text-center font-semibold text-neutral-900">{quantity}</span>
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
                      {product.name} x {quantity}
                    </span>
                    <span>{formatPrice(product.price * quantity)}</span>
                  </div>

                  {sizePrice > 0 && (
                    <div className="flex justify-between">
                      <span>Size: {sizes.find((s) => s.id === selectedSize)?.name}</span>
                      <span>+{formatPrice(sizePrice * quantity)}</span>
                    </div>
                  )}

                  {selectedToppings.length > 0 && (
                    <div className="flex justify-between">
                      <span>Toppings x {selectedToppings.length}</span>
                      <span>+{formatPrice(toppingsPrice * quantity)}</span>
                    </div>
                  )}
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-neutral-300 pt-4">
                  <span className="text-base font-semibold text-neutral-900">Tổng cộng</span>
                  <span className="text-2xl font-bold text-orange-500">{formatPrice(totalPrice)}</span>
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
                Xem giỏ hàng
              </button>
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
            {relatedProducts.map((item) => (
              <button
                key={item.id}
                onClick={() => navigate(`/product/${item.id}`)}
                className="group overflow-hidden rounded-[26px] border border-neutral-200 bg-white text-left shadow-sm transition-all hover:-translate-y-[2px] hover:shadow-md"
              >
                <div className="relative h-48 overflow-hidden bg-neutral-100">
                  <img
                    src={item.imageUrl || fallbackImage}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  {item.category?.name && (
                    <span className="absolute left-3 top-3 rounded-full bg-orange-400 px-3 py-1 text-xs font-semibold text-white">
                      {item.category.name}
                    </span>
                  )}
                </div>

                <div className="p-5">
                  <h3 className="font-bold text-neutral-800">{item.name}</h3>
                  <p className="mt-1 text-sm text-neutral-500 line-clamp-2">
                    {item.description || "Đồ uống được yêu thích tại MAY."}
                  </p>
                  <p className="mt-4 text-lg font-bold text-orange-500">{formatPrice(item.price)}</p>
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
