import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import DrinkCard from "./DrinkCard";
import { useProducts } from "../hooks/useProducts";
import { useBestSellingProducts } from "../hooks/useBestSellingProducts";

function DrinkSlider() {
  const [activeIndex, setActiveIndex] = useState(1);
  const navigate = useNavigate();

  const { products, loading, error } = useProducts();
  const { bestSellingProducts } = useBestSellingProducts();

  const bestSellerSet = new Set(bestSellingProducts.map((p) => p.id));

  const drinks = (products || [])
    .filter((p) => bestSellerSet.has(p.id))
    .slice(0, 8);

  const canSlide = drinks.length > 1;

  const handlePrev = () => {
    if (!canSlide) return;
    setActiveIndex((prev) => (prev === 0 ? drinks.length - 1 : prev - 1));
  };

  const handleNext = () => {
    if (!canSlide) return;
    setActiveIndex((prev) => (prev === drinks.length - 1 ? 0 : prev + 1));
  };

  if (loading) {
    return (
      <section className="w-full h-full flex items-center justify-center py-4 text-neutral-600">
        loading...
      </section>
    );
  }

  if (error) {
    return (
      <section className="w-full h-full flex flex-col items-center justify-center py-4 text-neutral-600">
        <p>Không thể tải slider sản phẩm.</p>
        <p className="text-xs mt-1">{error}</p>
      </section>
    );
  }

  if (!drinks.length) {
    return (
      <section className="w-full h-full flex items-center justify-center py-4 text-neutral-600">
        Không có best seller để hiển thị.
      </section>
    );
  }

  const safeIndex = activeIndex % drinks.length;

  const prevIndex = safeIndex === 0 ? drinks.length - 1 : safeIndex - 1;
  const nextIndex =
    safeIndex === drinks.length - 1 ? 0 : safeIndex + 1;

  const displayDrinks = canSlide
    ? [drinks[prevIndex], drinks[safeIndex], drinks[nextIndex]]
    : [drinks[0]];

  return (
    <section className="w-full h-full flex flex-col justify-center mt-20">
      <div className="mb-6 text-center">
        <h2 className="mt-1 text-lg sm:text-2xl font-black text-neutral-700">
          Best seller
        </h2>

        <p className="mt-1 text-xs sm:text-sm text-neutral-500">
          Our top 5 best-selling products
        </p>
      </div>
      <div className="flex items-center justify-center gap-2 sm:gap-4 px-2 sm:px-4">
        <div className="relative">
        <button
          onClick={handlePrev}
          className="absolute -left-4 sm:-left-6 top-1/2 -translate-y-1/2 flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center text-xl transition hover:scale-110 text-neutral-400 hover:text-neutral-900"
        >
          <FiChevronLeft size={30} />
        </button>

        <div className="flex items-end justify-center gap-3 sm:gap-4">
          {displayDrinks.map((drink, index) => (
            <div
              key={drink.id}
              className={`cursor-pointer transition-all duration-500 ease-out ${canSlide && index === 1
                ? "z-10 translate-y-0 scale-100 opacity-100"
                : "translate-y-3 scale-75 sm:scale-90 opacity-60 sm:opacity-70"
                }`}
              onClick={() => {
                console.log("Clicked drink:", drink);
                if (!drink.id) return;
                navigate(`/product/${drink.id}`);
              }}
            >
              <DrinkCard
                name={drink.name}
                description={drink.description}
                categoryName={drink.category?.name}
                image={drink.imageUrl||""}
                price={drink.price}
                isActive={canSlide ? index === 1 : true}
              // isBestSeller={true}
              />
            </div>
          ))}
        </div>

        <button
          onClick={handleNext}
          className="absolute s-right-4 sm:-right-6 top-1/2 -translate-y-1/2 z-10 flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center text-xl transition hover:scale-110 text-neutral-400 hover:text-neutral-900"
        >
          <FiChevronRight size={30} />
        </button>
        </div>
      </div>

      <div className="mt-2 sm:mt-3 flex items-center justify-center gap-1.5">
        {drinks.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`rounded-full transition-all ${index === safeIndex
              ? "h-1.5 w-6 sm:w-8 bg-[#6c935b]"
              : "h-1.5 w-1.5 bg-neutral-300 hover:bg-neutral-400"
              }`}
          />
        ))}
      </div>
    </section>
  );
}

export default DrinkSlider;