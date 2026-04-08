import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import DrinkCard from "./DrinkCard";
import { useProducts } from "../hooks/useProducts";

// ảnh dự phòng nếu sản phẩm không có imageUrl từ backend
const fallbackImage =
  "https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=800&q=80";

function DrinkSlider() {
  // activeIndex là vị trí sản phẩm đang được chọn ở giữa slider
  // ban đầu để là 1 nghĩa là card thứ 2 sẽ active trước
  const [activeIndex, setActiveIndex] = useState(1);

  // dùng để chuyển trang
  const navigate = useNavigate();

  // lấy danh sách sản phẩm từ backend
  // loading = đang tải
  // error = lỗi nếu có
  const { products, loading, error } = useProducts();

  // chỉ lấy tối đa 8 sản phẩm đầu để làm slider
  const drinks = products.slice(0, 8);

  // kiểm tra xem có đủ nhiều sản phẩm để trượt hay không
  // nếu chỉ có 1 sản phẩm thì không cần slide
  const canSlide = drinks.length > 1;

  // xử lý khi bấm nút qua trái
  const handlePrev = () => {
    if (!canSlide) return;

    // nếu đang ở sản phẩm đầu tiên thì quay vòng về cuối
    // còn không thì lùi 1 bước
    setActiveIndex((prev) => (prev === 0 ? drinks.length - 1 : prev - 1));
  };

  // xử lý khi bấm nút qua phải
  const handleNext = () => {
    if (!canSlide) return;

    // nếu đang ở sản phẩm cuối thì quay vòng về đầu
    // còn không thì tăng 1 bước
    setActiveIndex((prev) => (prev === drinks.length - 1 ? 0 : prev + 1));
  };

  // nếu đang tải dữ liệu thì hiện loading
  if (loading) {
    return (
      <section className="w-full h-full flex flex-col items-center justify-center py-4 text-neutral-600">
        loading...
      </section>
    );
  }

  // nếu có lỗi thì hiện thông báo lỗi
  if (error) {
    return (
      <section className="w-full h-full flex flex-col items-center justify-center py-4 text-center text-neutral-600">
        <p>Không thể tải slider sản phẩm.</p>
        <p className="text-xs mt-1">{error}</p>
      </section>
    );
  }

  // nếu không có sản phẩm nào thì hiện thông báo
  if (drinks.length === 0) {
    return (
      <section className="w-full h-full flex flex-col items-center justify-center py-4 text-neutral-600">
        Không có sản phẩm nào để hiển thị.
      </section>
    );
  }

  // đảm bảo index luôn nằm trong phạm vi số lượng sản phẩm
  const safeIndex = activeIndex % drinks.length;

  // tìm vị trí sản phẩm bên trái
  const prevIndex = safeIndex === 0 ? drinks.length - 1 : safeIndex - 1;

  // tìm vị trí sản phẩm bên phải
  const nextIndex = safeIndex === drinks.length - 1 ? 0 : safeIndex + 1;

  // nếu có thể slide thì hiển thị 3 card: trái - giữa - phải
  // nếu không thì chỉ hiển thị 1 card
  const displayDrinks = canSlide
    ? [drinks[prevIndex], drinks[safeIndex], drinks[nextIndex]]
    : [drinks[0]];

  return (
    <section className="w-full h-full flex flex-col justify-center">
      <div className="relative flex items-center justify-center gap-2 sm:gap-4 px-2 sm:px-4">
        {/* nút mũi tên trái */}
        <button
          onClick={handlePrev}
          className="absolute left-0 z-10 flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center text-xl transition hover:scale-110 text-neutral-400 hover:text-neutral-900"
        >
          <FiChevronLeft size={20} />
        </button>

        {/* khu vực chứa các card sản phẩm */}
        <div className="flex items-end justify-center gap-3 sm:gap-4">
          {displayDrinks.map((drink, index) => (
            <div
              key={drink.id}
              className={`cursor-pointer transition-all duration-500 ease-out ${
                // nếu là card ở giữa thì to hơn, rõ hơn, nổi bật hơn
                // nếu là card 2 bên thì nhỏ hơn và mờ hơn
                canSlide && index === 1
                  ? "z-10 translate-y-0 scale-100 opacity-100"
                  : "translate-y-3 scale-75 sm:scale-90 opacity-60 sm:opacity-70"
              }`}
              // click vào card thì sang trang chi tiết sản phẩm
              onClick={() => navigate(`/product/${drink.id}`)}
            >
              <DrinkCard
                name={drink.name}
                description={drink.description}
                categoryName={drink.category?.name}
                image={drink.imageUrl || fallbackImage}
                price={drink.price}
                // card ở giữa là active
                isActive={canSlide ? index === 1 : true}
              />
            </div>
          ))}
        </div>

        {/* nút mũi tên phải */}
        <button
          onClick={handleNext}
          className="absolute right-0 z-10 flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center text-xl transition hover:scale-110 text-neutral-400 hover:text-neutral-900"
        >
          <FiChevronRight size={20} />
        </button>
      </div>

      {/* các chấm tròn bên dưới để biết đang ở sản phẩm nào */}
      <div className="mt-2 sm:mt-3 flex items-center justify-center gap-1.5">
        {drinks.map((_, index) => (
          <button
            key={index}
            // bấm vào chấm nào thì chuyển activeIndex sang chấm đó
            onClick={() => setActiveIndex(index)}
            className={`rounded-full transition-all ${
              // chấm đang active sẽ dài hơn và màu cam
              index === safeIndex
                ? "h-1.5 w-6 sm:w-8 bg-orange-400"
                : "h-1.5 w-1.5 bg-neutral-300 hover:bg-neutral-400"
            }`}
          />
        ))}
      </div>

      {/* số thứ tự trang hiện tại / tổng số sản phẩm */}
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