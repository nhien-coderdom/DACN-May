import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Hero from "../components/Hero";
import { useProducts } from "../hooks/useProducts";
import { useCategories } from "../hooks/useCategories";

const toSlug = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

function ProductsPage() {
  const { category } = useParams();
  const navigate = useNavigate();
  const { products, loading, error } = useProducts();
  const { categories } = useCategories();

  const filteredDrinks = useMemo(() => {
    if (!category) {
      return products;
    }

    const currentCategorySlug = category.toLowerCase();

    return products.filter((product) => {
      const productCategory = product.category;
      if (!productCategory) {
        return false;
      }

      const productCategorySlug = productCategory.slug
        ? productCategory.slug.toLowerCase()
        : toSlug(productCategory.name);

      return productCategorySlug === currentCategorySlug;
    });
  }, [category, products]);

  const formatPrice = (value: number) =>
    new Intl.NumberFormat("vi-VN").format(value) + "đ";

  const categoryButtons = useMemo(
    () => [{ id: 0, slug: "all", name: "All" }, ...categories],
    [categories]
  );

  
  return (
    <div>
       <div className="py-1 sm:py-2">
        <Hero />
      </div>
      {/* Category Filter Buttons */}
      <div className="mb-8 flex flex-wrap justify-center gap-3 px-4 sm:gap-4">
        {categoryButtons.map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              if (cat.slug === "all") {
                navigate("/products");
              } else {
                navigate(`/products/${cat.slug}`);
              }
            }}
            className={`rounded-full px-6 py-2 font-semibold transition ${
              (!category && cat.slug === "all") || category === cat.slug
                ? "bg-orange-400 text-white shadow-md hover:bg-orange-500"
                : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {loading && (
        <div className="rounded-[28px] bg-white p-6 sm:p-10 text-center shadow-lg mx-4 sm:mx-0">
          <p className="text-neutral-600">Đang tải sản phẩm...</p>
        </div>
      )}

      {error && !loading && (
        <div className="rounded-[28px] bg-white p-6 sm:p-10 text-center shadow-lg mx-4 sm:mx-0">
          <h2 className="text-2xl font-bold text-neutral-800">Không thể tải sản phẩm</h2>
          <p className="mt-2 text-neutral-600">{error}</p>
        </div>
      )}

      {!loading && !error && filteredDrinks.length === 0 ? (
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
      ) : !loading && !error ? (
        <div className="grid grid-cols-1 gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3 px-4 sm:px-0">
          {filteredDrinks.map((drink) => (
            <button
              key={drink.id}
              onClick={() => navigate(`/product/${drink.id}`)}
              className="overflow-hidden rounded-[26px] border border-neutral-200 bg-white text-left shadow-sm transition hover:-translate-y-[2px] hover:shadow-md"
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={drink.imageUrl || "https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=800&q=80"}
                  className="h-full w-full object-cover"
                />
                {drink.category?.name && (
                  <span className="absolute left-4 top-4 rounded-full bg-orange-400 px-3 py-1 text-xs font-semibold text-white">
                    {drink.category.name}
                  </span>
                )}
              </div>

              <div className="p-5">
                <h3 className="text-lg font-bold text-neutral-800">
                  {drink.name}
                </h3>
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
      ) : null}
    </div>
  );
}

export default ProductsPage;
