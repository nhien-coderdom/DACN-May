// khai báo kiểu dữ liệu mà component này sẽ nhận vào từ component cha
type DrinkCardProps = {
  name: string;          // tên sản phẩm
  description?: string;  // mô tả
  categoryName?: string; // tên danh mục
  image: string;         // link ảnh sản phẩm
  price: number;         // giá sản phẩm
  isActive: boolean;    
};

// component DrinkCard nhận props từ bên ngoài
function DrinkCard({
  name,
  description,
  categoryName,
  image,
  price,
  isActive,
}: DrinkCardProps) {
  
  const formattedPrice = new Intl.NumberFormat("vi-VN").format(price) + "đ";

  return (
    <div
      className={`relative flex flex-col w-[240px] sm:w-[280px] rounded-2xl sm:rounded-3xl overflow-hidden transition-all duration-500 ${
        isActive
          ? "bg-white shadow-2xl ring-2 ring-orange-200"
          : "bg-neutral-100/50 shadow-md opacity-75"
      }`}
    >
      {/* phần ảnh sản phẩm */}
      <div className="relative overflow-hidden rounded-t-2xl sm:rounded-t-3xl flex-shrink-0 h-[120px] sm:h-[150px]">
        <img
          src={image}       // ảnh lấy từ props
          className="h-full w-full object-cover"
        />

        {/* nếu có categoryName thì hiện nhãn danh mục ở góc trên ảnh */}
        {categoryName && (
          <span className="absolute left-3 top-3 rounded-full px-2 sm:px-3 py-0.5 sm:py-1 text-xs font-semibold bg-orange-400 text-white">
            {categoryName}
          </span>
        )}
      </div>

      <div className="p-3 sm:p-4 flex flex-col flex-grow">
        {/* tên sản phẩm */}
        <h3 className="font-extrabold text-xs sm:text-sm text-neutral-700 uppercase tracking-wide">
          {name}
        </h3>

        {/* mô tả sản phẩm
            nếu không có description thì hiện câu mặc định */}
        <p className="mt-1.5 text-xs leading-4 text-neutral-600 flex-grow line-clamp-2">
          {description || "Đồ uống được pha chế tại MAY."}
        </p>

        {/* giá sản phẩm */}
        <p className="mt-2 text-xs font-bold text-orange-500">
          {formattedPrice}
        </p>

        <div className="mt-3 flex justify-center gap-1.5 flex-shrink-0">
          {/* nút order */}
          <button className="rounded-full bg-orange-400 px-4 sm:px-5 py-1.5 text-xs font-bold text-white hover:bg-orange-500 transition flex-1">
            ORDER
          </button>

          {/* nút explore */}
          <button className="rounded-full border-2 border-neutral-300 px-4 sm:px-5 py-1.5 text-xs text-neutral-700 font-bold hover:border-neutral-400 transition flex-1">
            EXPLORE
          </button>
        </div>
      </div>
    </div>
  );
}

export default DrinkCard;