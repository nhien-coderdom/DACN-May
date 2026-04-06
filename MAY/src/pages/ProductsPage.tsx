import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Hero from "../components/Hero";

const drinks = [
  {
    id: 1,
    title: "MATCHA LATTE",
    subtitle: "Creamy · Smooth",
    description: "Matcha latte with smooth milk foam.",
    tag: "Coffee",
    price: 45000,
    image: "https://images.unsplash.com/photo-1515823064-d6e0c04616a7?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    title: "PEACH LEMONGRASS TEA",
    subtitle: "Sweet · Refreshing",
    description: "Peach lemongrass tea with fresh peach slices and lemongrass.",
    tag: "Tea",
    price: 49000,
    image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 3,
    title: "BERRY SMOOTHIE",
    subtitle: "Fruity · Creamy",
    description: "Berry smoothie with fresh fruits.",
    tag: "Smoothie",
    price: 52000,
    image: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 4,
    title: "MANGO LASSI",
    subtitle: "Tropical · Creamy",
    description: "Fresh mango lassi with yogurt and spices.",
    tag: "Smoothie",
    price: 50000,
    image: "https://images.unsplash.com/photo-1590161990359-f02e5f80fb8f?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 5,
    title: "LEMON JUICE",
    subtitle: "Fresh · Zesty",
    description: "Freshly squeezed lemon juice.",
    tag: "Juice",
    price: 39000,
    image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=800&q=80",
  },
];

const categories = ["All", "Coffee", "Tea", "Smoothie", "Juice"];

function ProductsPage() {
  const { category } = useParams();
  const navigate = useNavigate();

  const filteredDrinks = useMemo(() => {
    if (!category) {
      return drinks;
    }
    return drinks.filter(
      (drink) => drink.tag.toLowerCase() === category.toLowerCase()
    );
  }, [category]);

  const formatPrice = (value: number) =>
    new Intl.NumberFormat("vi-VN").format(value) + "đ";

  
  return (
    <div>
       <div className="py-1 sm:py-2">
        <Hero />
      </div>
      {/* Category Filter Buttons */}
      <div className="mb-8 flex flex-wrap justify-center gap-3 px-4 sm:gap-4">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              if (cat === "All") {
                navigate("/products");
              } else {
                navigate(`/products/${cat.toLowerCase()}`);
              }
            }}
            className={`rounded-full px-6 py-2 font-semibold transition ${
              (!category && cat === "All") ||
              (category?.toLowerCase() === cat.toLowerCase())
                ? "bg-orange-400 text-white shadow-md hover:bg-orange-500"
                : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
            }`}
          >
            {cat}
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
