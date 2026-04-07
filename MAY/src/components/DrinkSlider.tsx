import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import DrinkCard from "./DrinkCard";
import { useProducts } from "../hooks/useProducts";

function DrinkSlider() {
  const [activeIndex, setActiveIndex] = useState(1);
  const navigate = useNavigate();
  const { products, isLoading } = useProducts();

  const drinks = products.slice(0, 8);
  const hasDrinks = drinks.length > 0;

  const safeIndex = hasDrinks ? activeIndex % drinks.length : 0;

  const handlePrev = () => {
    if (!hasDrinks) {
      return;
    }
    setActiveIndex((prev) => (prev === 0 ? drinks.length - 1 : prev - 1));
  };

  const handleNext = () => {
    if (!hasDrinks) {
      return;
    }
    setActiveIndex((prev) => (prev === drinks.length - 1 ? 0 : prev + 1));
  };

  const prevIndex =
    hasDrinks && safeIndex === 0 ? drinks.length - 1 : Math.max(0, safeIndex - 1);
  const nextIndex =
    hasDrinks && safeIndex === drinks.length - 1 ? 0 : Math.min(drinks.length - 1, safeIndex + 1);

  const displayDrinks =
    drinks.length <= 1
      ? drinks
      : [drinks[prevIndex], drinks[safeIndex], drinks[nextIndex]];

  if (isLoading) {
    return (
      <section className="w-full h-full flex items-center justify-center py-8">
        <p className="text-sm font-medium text-neutral-500">Dang tai slider san pham...</p>
      </section>
    );
  }

  if (!hasDrinks) {
    return (
      <section className="w-full h-full flex items-center justify-center py-8">
        <p className="text-sm font-medium text-neutral-500">Chua co san pham de hien thi.</p>
      </section>
    );
  }

  return (
    <section className="w-full h-full flex flex-col justify-center">
      <div className="relative flex items-center justify-center gap-2 sm:gap-4 px-2 sm:px-4">
        {/* Left Arrow */}
        <button
          onClick={handlePrev}
          className="absolute left-0 z-10 flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center text-xl transition hover:scale-110 text-neutral-400 hover:text-neutral-900"
        >
          <FiChevronLeft size={20} />
        </button>

        {/* Cards Container */}
        <div className="flex items-end justify-center gap-3 sm:gap-4">
          {displayDrinks.map((drink, index) => (
            <div
              key={`${drink.id}-${index}`}
              className={`cursor-pointer transition-all duration-500 ease-out ${
                drinks.length > 1 && index === 1
                  ? "z-10 translate-y-0 scale-100 opacity-100"
                  : "translate-y-3 scale-75 sm:scale-90 opacity-60 sm:opacity-70"
              }`}
              onClick={() => navigate(`/product/${drink.id}`)}
            >
              <DrinkCard
                title={drink.title}
                subtitle={drink.subtitle}
                description={drink.description}
                tag={drink.tag}
                image={drink.image}
                isActive={drinks.length === 1 || index === 1}
              />
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={handleNext}
          className="absolute right-0 z-10 flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center text-xl transition hover:scale-110 text-neutral-400 hover:text-neutral-900"
        >
          <FiChevronRight size={20} />
        </button>
      </div>

      {/* Pagination Dots */}
      <div className="mt-2 sm:mt-3 flex items-center justify-center gap-1.5">
        {drinks.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`rounded-full transition-all ${
              index === safeIndex
                ? "h-1.5 w-6 sm:w-8 bg-orange-400"
                : "h-1.5 w-1.5 bg-neutral-300 hover:bg-neutral-400"
            }`}
          />
        ))}
      </div>

      {/* Page Counter */}
      <div className="mt-2 flex items-center justify-center gap-2 text-neutral-600">
        <span className="h-px w-4 sm:w-6 bg-neutral-300" />
        <span className="text-xs sm:text-sm font-semibold tracking-wider">
          {String(safeIndex + 1).padStart(2, "0")} / {String(drinks.length).padStart(2, "0")}
        </span>
        <span className="h-px w-4 sm:w-6 bg-neutral-300" />
      </div>
    </section>
  );
}

export default DrinkSlider;