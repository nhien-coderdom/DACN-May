import { useMemo, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DrinkCard from "../components/DrinkCard";
import PersonalizedProducts from "../components/PersonalizedProducts";
import { useProducts } from "../hooks/useProducts";
import { useCategories } from "../hooks/useCategories";
import { useBestSellingProducts } from "../hooks/useBestSellingProducts";
import { useAuth } from "../contexts/AuthContext";

const fallbackImage =
  "https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=800&q=80";

const PAGE_SIZE = 6;

function ProductsPage() {
  const { category } = useParams();
  const navigate = useNavigate();
  const { products, loading, error } = useProducts();
  const { categories } = useCategories();
  const { isAuthenticated } = useAuth();

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(category || "all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const { bestSellingProducts } = useBestSellingProducts();
  const bestSellerSet = new Set(bestSellingProducts.map((p) => p.id));

  // FILTER
  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (selectedCategory && selectedCategory !== "all") {
      result = result.filter(
        (p) => p.category?.slug === selectedCategory
      );
    }

    if (search) {
      result = result.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (minPrice) {
      result = result.filter((p) => p.price >= Number(minPrice));
    }

    if (maxPrice) {
      result = result.filter((p) => p.price <= Number(maxPrice));
    }

    return result;
  }, [products, selectedCategory, search, minPrice, maxPrice]);

  // RESET PAGE WHEN FILTER CHANGE
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, search, minPrice, maxPrice]);

  // PAGINATION
  const totalPages = Math.ceil(filteredProducts.length / PAGE_SIZE);

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredProducts.slice(start, start + PAGE_SIZE);
  }, [filteredProducts, currentPage]);

  return (
    <div>
      {/* TITLE */}
      <div className="mb-6 text-center mt-25">
        <h2 className="mt-1 text-2xl sm:text-5xl font-black text-neutral-700">
          Sản phẩm của MAY
        </h2>
      </div>

      {/* LAYOUT */}
      <div className="max-w-7xl mx-auto px-4 py-8">


        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

          {/* LEFT FILTER */}
          <div className="lg:col-span-1 bg-white rounded-2xl shadow p-4 h-fit w-full max-w-[280px] mx-auto">
            <h3 className="font-semibold text-lg mb-4">Tìm kiếm</h3>

            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full mb-4 px-3 py-2 border rounded-lg"
            />

            <h3 className="font-semibold text-lg mb-3">Danh mục</h3>
            <div className="flex flex-col gap-2 mb-4">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`text-left px-3 py-2 rounded ${selectedCategory === "all"
                  ? "bg-[#6c935b] text-white"
                  : "bg-neutral-100"
                  }`}
              >
                Tất cả
              </button>

              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`text-left px-3 py-2 rounded ${selectedCategory === cat.slug
                    ? "bg-[#6c935b] text-white"
                    : "bg-neutral-100"
                    }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            <h3 className="font-semibold text-lg mb-3">Giá</h3>
            <div className="flex flex-col gap-2">
              <input
                type="number"
                placeholder="Nhỏ nhất"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="px-3 py-2 border rounded"
              />
              <input
                type="number"
                placeholder="Lớn nhất"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="px-3 py-2 border rounded"
              />
            </div>
          </div>

          {/* RIGHT PRODUCT */}
          <div className="lg:col-span-3">

            {loading && (
              <div className="text-center py-10 text-neutral-500">
                Đang tải sản phẩm...
              </div>
            )}

            {error && (
              <div className="text-center py-10 text-neutral-500">
                {error}
              </div>
            )}

            {!loading && !error && filteredProducts.length === 0 && (
              <div className="text-center py-10 text-neutral-500">
                Không tìm thấy sản phẩm
              </div>
            )}

            {!loading && !error && filteredProducts.length > 0 && (
              <>
                {/* GRID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {paginatedProducts.map((drink) => (
                    <div
                      key={drink.id}
                      onClick={() => navigate(`/product/${drink.id}`)}
                      className="cursor-pointer transition sm:hover:scale-105 hover:z-10"
                    >
                      <DrinkCard
                        name={drink.name}
                        description={drink.description}
                        categoryName={drink.category?.name}
                        image={drink.imageUrl || fallbackImage}
                        price={drink.price}
                        isActive={false}
                        isBestSeller={bestSellerSet.has(drink.id)}
                      />
                    </div>
                  ))}
                </div>

                {/* PAGINATION */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-8 flex-wrap">

                    {/* Prev */}
                    <button
                      onClick={() =>
                        setCurrentPage((p) => Math.max(p - 1, 1))
                      }
                      className="px-3 py-1 border rounded disabled:opacity-50"
                      disabled={currentPage === 1}
                    >
                      Trước đó
                    </button>

                    {/* Page numbers */}
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-1 rounded ${currentPage === page
                            ? "bg-[#6c935b] text-white"
                            : "border"
                            }`}
                        >
                          {page}
                        </button>
                      )
                    )}

                    {/* Next */}
                    <button
                      onClick={() =>
                        setCurrentPage((p) =>
                          Math.min(p + 1, totalPages)
                        )
                      }
                      className="px-3 py-1 border rounded disabled:opacity-50"
                      disabled={currentPage === totalPages}
                    >
                      Tiếp theo
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {isAuthenticated && <PersonalizedProducts />}
      </div>
    </div>
  );
}

export default ProductsPage;