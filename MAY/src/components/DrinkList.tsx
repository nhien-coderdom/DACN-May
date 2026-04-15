import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DrinkCard from "./DrinkCard";
import { useProducts } from "../hooks/useProducts";
import { useBestSellingProducts } from "../hooks/useBestSellingProducts";

const fallbackImage =
    "https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=800&q=80";

const PAGE_SIZE = 4;

function DrinkList() {
    const navigate = useNavigate();
    const { products, loading, error } = useProducts();
    const { bestSellingProducts } = useBestSellingProducts();

    const [visibleCount] = useState(PAGE_SIZE);

    const bestSellerSet = new Set(bestSellingProducts.map((p) => p.id));

    if (loading) {
        return (
            <section className="w-full flex justify-center py-10 text-neutral-500">
                Loading products...
            </section>
        );
    }

    if (error) {
        return (
            <section className="w-full flex flex-col items-center py-10 text-neutral-500">
                <p>Không thể tải sản phẩm</p>
                <p className="text-sm">{error}</p>
            </section>
        );
    }

    if (!products || products.length === 0) {
        return (
            <section className="w-full flex justify-center py-10 text-neutral-500">
                Không có sản phẩm
            </section>
        );
    }

    const visibleProducts = products.slice(0, visibleCount);

    return (
        <section className="w-full max-w-7xl mx-auto px-4 py-10">
            <div className="mb-6 text-center">
                <h2 className="mt-1 text-lg sm:text-2xl font-black text-neutral-700">
                    A few other drinks 
                </h2>

                <p className="mt-1 text-xs sm:text-sm text-neutral-500">
                    Pure ingredients, refreshing taste
                </p>
            </div>

            <div className=" sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6 grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))]">
                {visibleProducts.map((drink) => (
                    <div
                        key={drink.id}
                        className="cursor-pointer transition hover:scale-105"
                        onClick={() => {
                            if (!drink.id) return;
                            navigate(`/product/${drink.id}`);
                        }}
                    >
                        <DrinkCard
                            name={drink.name}
                            description={drink.description}
                            categoryName={drink.category?.name}
                            image={drink.imageUrl || fallbackImage}
                            price={drink.price}
                            isActive={false}
                            isBestSeller={bestSellerSet.has(drink.id)}
                        />
                    </div>
                ))}
            </div>

            <div className="flex justify-center mt-8">
                <button
                    onClick={() => navigate("/products")}
                    className="px-6 py-2 rounded-full border border-neutral-300 text-neutral-700 hover:bg-neutral-100 transition"
                >
                    View more 
                </button>
            </div>
        </section>
    );
}

export default DrinkList;