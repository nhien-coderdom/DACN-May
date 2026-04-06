import { useNavigate, useParams } from "react-router-dom";

const categories = ["coffee", "tea", "smoothie", "juice"];

function CategoryTabs() {
  const navigate = useNavigate();
  const { category } = useParams();

  const activeCategory = category || "coffee";

  return (
    <div className="mx-auto flex w-fit gap-6 sm:gap-8 py-1 sm:py-2 text-base sm:text-lg font-semibold">
      {categories.map((cat) => {
        const isActive = activeCategory === cat;

        return (
          <button
            key={cat}
            onClick={() => navigate(`/products/${cat}`)}
            className={`transition relative pb-1 ${
              isActive
                ? "text-orange-400"
                : "text-neutral-600 hover:text-neutral-900"
            }`}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
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