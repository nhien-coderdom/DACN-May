
import DrinkSlider from "../components/DrinkSlider";
import DrinkList from "../components/DrinkList";
function Home() {
  return (
    <div className="flex flex-col h-full">

      {/* Slider - Takes remaining space */}
      <div className="flex-1 flex items-center justify-center py-1 sm:py-2 min-h-0">
        <DrinkSlider />
      </div>
      <div>
        <DrinkList />
      </div>

    </div>
  );
}

export default Home;

