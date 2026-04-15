import { useNavigate, useParams } from "react-router-dom";
import { useMemo } from "react";
import { useCategories } from "../hooks/useCategories";

function CategoryTabs() {
  const navigate = useNavigate();

  // lấy category hiện tại từ URL
  const { category } = useParams();

  // gọi hook để lấy danh sách category từ backend
  const { categories, loading } = useCategories();

  // tạo danh sách tab để hiển thị
  const categoryTabs = useMemo(
    () => [{ id: 0, slug: "all", name: "All" }, ...categories],
    [categories]
  );

  // xác định tab đang được chọn
  // nếu URL chưa có category thì mặc định là "all"
  const activeCategory = category || "all";

  // nếu đang tải và chưa có dữ liệu thì hiện loading
  if (loading && categories.length === 0) {
    return (
      <div className="mx-auto py-1 text-sm text-neutral-500 sm:py-2">
        loading...
      </div>
    );
  }

  return (
    // khung chứa toàn bộ các tab
    <div className="mx-auto flex w-fit gap-6 sm:gap-8 py-1 sm:py-2 text-base sm:text-lg font-semibold">
      {categoryTabs.map((cat) => {
        // kiểm tra tab hiện tại có đang active không
        const isActive = activeCategory === cat.slug;

        return (
          <button
            key={cat.id} // key để React phân biệt từng tab
            onClick={() =>
              // nếu là tab all thì về /products
              // nếu là tab khác thì đi đến /products/{slug}
              cat.slug === "all"
                ? navigate("/products")
                : navigate(`/products/${cat.slug}`)
            }
            className={`transition relative pb-1 ${
              // nếu active thì chữ màu cam
              // nếu không active thì chữ màu xám, hover đậm hơn
              isActive
                ? "text-orange-400"
                : "text-neutral-600 hover:text-neutral-900"
            }`}
          >
            {/* tên tab hiển thị ra ngoài */}
            {cat.name}

            {/* nếu tab đang active thì hiện gạch chân màu cam */}
            {isActive && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#6c935b] rounded-full" />
            )}
          </button>
        );
      })}
    </div>
  );
}

export default CategoryTabs;