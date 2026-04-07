import { useNavigate, useParams } from "react-router-dom";
import { useProducts } from "../hooks/useProducts";

function CategoryTabs() {
  const navigate = useNavigate();
  const { category } = useParams();
  const { categories, isLoading } = useProducts();
  const categoryOptions = categories.filter((item) => item.slug);

  const activeCategory = category || categoryOptions[0]?.slug || "";

  if (isLoading) {
    return (
      <div className="mx-auto flex w-fit gap-6 sm:gap-8 py-1 sm:py-2 text-base sm:text-lg font-semibold text-neutral-500">
        Dang tai danh muc...
      </div>
    );
  }

  if (categoryOptions.length === 0) {
    return null;
  }

  return (
    <div className="mx-auto flex w-fit gap-6 sm:gap-8 py-1 sm:py-2 text-base sm:text-lg font-semibold">
      {categoryOptions.map((cat) => {
        const isActive = activeCategory === cat.slug;

        return (
          <button
            key={cat.slug}
            onClick={() => navigate(`/products/${cat.slug}`)}
            className={`transition relative pb-1 ${
              isActive
                ? "text-orange-400"
                : "text-neutral-600 hover:text-neutral-900"
            }`}
          >
            {cat.name}
            {isActive && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-400 rounded-full" />
            )}
          </button>
        );
      })}
    </div>
  );
}

export default CategoryTabs;