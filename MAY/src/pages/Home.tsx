import Hero from "../components/Hero";
import CategoryTabs from "../components/CategoryTabs";
import DrinkSlider from "../components/DrinkSlider";

function Home() {
  return (
    <div className="flex flex-col h-full">
      {/* Hero Section */}
      <div className="py-1 sm:py-2">
        <Hero />
      </div>

      {/* Category Tabs */}
      <div className="flex justify-center">
        <CategoryTabs />
      </div>

      {/* Slider - Takes remaining space */}
      <div className="flex-1 flex items-center justify-center py-1 sm:py-2 min-h-0">
        <DrinkSlider />
      </div>
    </div>
  );
}

export default Home;

