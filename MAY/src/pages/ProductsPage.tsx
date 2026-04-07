import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Hero from "../components/Hero";
import { useProducts } from "../hooks/useProducts";

function ProductsPage() {
  const { category } = useParams();
  const navigate = useNavigate();
  const { categories, filteredProducts, isLoading, errorMessage } =
    useProducts(category);

  const filteredDrinks = useMemo(() => filteredProducts, [filteredProducts]);

  const formatPrice = (value: number) =>
    new Intl.NumberFormat("vi-VN").format(value) + "đ";

  
  if (isLoading) {
    return (
      <div>
        <div className="py-1 sm:py-2">
          <Hero />
        </div>
        <div className="mx-4 rounded-[28px] bg-white p-8 text-center shadow-lg sm:mx-0">
          <p className="text-lg font-semibold text-neutral-700">Dang tai san pham...</p>
        </div>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div>
        <div className="py-1 sm:py-2">
          <Hero />
        </div>
        <div className="mx-4 rounded-[28px] bg-white p-8 text-center shadow-lg sm:mx-0">
          <h2 className="text-2xl font-bold text-neutral-800">Khong the tai du lieu</h2>
          <p className="mt-2 text-sm text-neutral-600">{errorMessage}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 rounded-full bg-orange-400 px-5 py-2 text-sm font-semibold text-white transition hover:bg-orange-500"
          >
            Thu lai
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
       <div className="py-1 sm:py-2">
        <Hero />
      </div>
      {/* Category Filter Buttons */}
      <div className="mb-8 flex flex-wrap justify-center gap-3 px-4 sm:gap-4">
        {categories.map((cat) => (
          <button
            key={cat.slug || "all"}
            onClick={() => {
              if (!cat.slug) {
                navigate("/products");
              } else {
                navigate(`/products/${cat.slug.toLowerCase()}`);
              }
            }}
            className={`rounded-full px-6 py-2 font-semibold transition ${
              (!category && !cat.slug) ||
              (category?.toLowerCase() === cat.slug.toLowerCase())
                ? "bg-orange-400 text-white shadow-md hover:bg-orange-500"
                : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {filteredDrinks.length === 0 ? (
        <div className="rounded-[28px] bg-white p-6 sm:p-10 text-center shadow-lg mx-4 sm:mx-0">
          <h2 className="text-2xl font-bold text-neutral-800">
            Không có sản phẩm trong danh mục này
          </h2>
          <button
            onClick={() => navigate("/")}
            className="mt-4 rounded-full bg-orange-400 px-5 py-2 text-sm font-semibold text-white transition hover:bg-orange-500"
          >
            Quay về trang chủ
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3 px-4 sm:px-0">
          {filteredDrinks.map((drink) => (
            <button
              key={drink.id}
              onClick={() => navigate(`/product/${drink.id}`)}
              className="overflow-hidden rounded-[26px] border border-neutral-200 bg-white text-left shadow-sm transition hover:-translate-y-[2px] hover:shadow-md"
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={drink.image}
                  alt={drink.title}
                  className="h-full w-full object-cover"
                />
                <span className="absolute left-4 top-4 rounded-full bg-orange-400 px-3 py-1 text-xs font-semibold text-white">
                  {drink.tag}
                </span>
              </div>

              <div className="p-5">
                <h3 className="text-lg font-bold text-neutral-800">
                  {drink.title}
                </h3>
                <p className="mt-1 text-sm text-neutral-500">
                  {drink.subtitle}
                </p>
                <p className="mt-3 line-clamp-2 text-sm leading-6 text-neutral-600">
                  {drink.description}
                </p>
                <p className="mt-4 text-lg font-bold text-orange-500">
                  {formatPrice(drink.price)}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductsPage;
