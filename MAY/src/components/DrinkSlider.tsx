import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import DrinkCard from "./DrinkCard";

const drinks = [
  {
    id: 1,
    title: "MATCHA LATTE",
    subtitle: "Creamy · Smooth",
    description: "Matcha latte with smooth milk foam.",
    tag: "Coffee",
    image: "https://images.unsplash.com/photo-1515823064-d6e0c04616a7?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    title: "PEACH LEMONGRASS TEA",
    subtitle: "Sweet · Refreshing",
    description: "Peach lemongrass tea with fresh peach slices and lemongrass.",
    tag: "Tea",
    image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 3,
    title: "BERRY SMOOTHIE",
    subtitle: "Fruity · Creamy",
    description: "Berry smoothie with fresh fruits.",
    tag: "Smoothie",
    image: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 4,
    title: "MANGO LASSI",
    subtitle: "Tropical · Creamy",
    description: "Fresh mango lassi with yogurt and spices.",
    tag: "Smoothie",
    image: "https://images.unsplash.com/photo-1590161990359-f02e5f80fb8f?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 5,
    title: "LEMON JUICE",
    subtitle: "Fresh · Zesty",
    description: "Freshly squeezed lemon juice.",
    tag: "Juice",
    image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=800&q=80",
  },
];

function DrinkSlider() {
  const [activeIndex, setActiveIndex] = useState(1);
  const navigate = useNavigate();

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? drinks.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === drinks.length - 1 ? 0 : prev + 1));
  };

  const prevIndex = activeIndex === 0 ? drinks.length - 1 : activeIndex - 1;
  const nextIndex = activeIndex === drinks.length - 1 ? 0 : activeIndex + 1;

  const displayDrinks = [
    drinks[prevIndex],
    drinks[activeIndex],
    drinks[nextIndex],
  ];

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
              key={drink.id}
              className={`cursor-pointer transition-all duration-500 ease-out ${
                index === 1
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
                isActive={index === 1}
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
              index === activeIndex
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
          {String(activeIndex + 1).padStart(2, "0")} / {String(drinks.length).padStart(2, "0")}
        </span>
        <span className="h-px w-4 sm:w-6 bg-neutral-300" />
      </div>
    </section>
  );
}

export default DrinkSlider;