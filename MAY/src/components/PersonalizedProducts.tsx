import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../lib/api";
import DrinkCard from "./DrinkCard";
import { useNavigate } from "react-router-dom";

interface PersonalizedProduct {
  productId: number;
  productName: string;
  imageUrl: string | null;
  currentPrice: number;
  favoriteScore: number;
}

interface PersonalizedData {
  favorites: PersonalizedProduct[];
  recentlyOrdered: PersonalizedProduct[];
  frequentlyOrdered: PersonalizedProduct[];
}

export default function PersonalizedProducts() {
  const [data, setData] = useState<PersonalizedData | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPersonalizedData = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          setLoading(false);
          return;
        }

        const res = await axios.get(`${API_BASE_URL}/users/me/personalized`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setData(res.data);
      } catch (error) {
        console.error("Failed to fetch personalized data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPersonalizedData();
  }, []);

  if (loading) return null;
  if (!data || data.favorites.length === 0) return null;

  return (
    <div className="w-full mb-12">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl sm:text-2xl font-bold text-neutral-700">
          Dành riêng cho bạn
        </h3>
      </div>

      <div className=" sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6 grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))]">
        {data.favorites.map((product) => (
          <div
            key={product.productId}
            onClick={() => navigate(`/product/${product.productId}`)}
            className="flex-shrink-0 cursor-pointer transition sm:hover:scale-105 hover:z-10"
          >
            <DrinkCard
              name={product.productName}
              image={product.imageUrl || "https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=800&q=80"}
              price={product.currentPrice}
              isActive={true}
              isBestSeller={false}
            />
          </div>
        ))}
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
