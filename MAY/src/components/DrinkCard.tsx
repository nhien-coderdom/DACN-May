type DrinkCardProps = {
  title: string;
  subtitle: string;
  description: string;
  tag: string;
  image: string;
  isActive: boolean;
};

function DrinkCard({
  title,
  subtitle,
  description,
  tag,
  image,
  isActive,
}: DrinkCardProps) {
  return (
    <div
      className={`relative flex flex-col w-[240px] sm:w-[280px] rounded-2xl sm:rounded-3xl overflow-hidden transition-all duration-500 ${
        isActive
          ? "bg-white shadow-2xl ring-2 ring-orange-200"
          : "bg-neutral-100/50 shadow-md opacity-75"
      }`}
    >
      <div className="relative overflow-hidden rounded-t-2xl sm:rounded-t-3xl flex-shrink-0 h-[120px] sm:h-[150px]">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover"
        />
        <span className="absolute left-3 top-3 rounded-full px-2 sm:px-3 py-0.5 sm:py-1 text-xs font-semibold bg-orange-400 text-white">
          {tag}
        </span>
      </div>

      <div className="p-3 sm:p-4 flex flex-col flex-grow">
        <h3 className="font-extrabold text-xs sm:text-sm text-neutral-700 uppercase tracking-wide">
          {title}
        </h3>

        <p className="mt-0.5 text-xs text-neutral-500 font-medium">
          {subtitle}
        </p>

        <p className="mt-1.5 text-xs leading-4 text-neutral-600 flex-grow line-clamp-2">
          {description}
        </p>

        <div className="mt-3 flex justify-center gap-1.5 flex-shrink-0">
          <button className="rounded-full bg-orange-400 px-4 sm:px-5 py-1.5 text-xs font-bold text-white hover:bg-orange-500 transition flex-1">
            ORDER
          </button>
          <button className="rounded-full border-2 border-neutral-300 px-4 sm:px-5 py-1.5 text-xs text-neutral-700 font-bold hover:border-neutral-400 transition flex-1">
            EXPLORE
          </button>
        </div>
      </div>
    </div>
  );
}

export default DrinkCard;