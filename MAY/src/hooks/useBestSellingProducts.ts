import { useEffect, useState } from "react";

export function useBestSellingProducts() {
  const [bestSellingProducts, setBestSellingProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBestSelling = async () => {
      try {
        setLoading(true);

        const res = await fetch("http://localhost:3000/products/best-selling");

        if (!res.ok) {
          throw new Error("Failed to fetch best selling products");
        }

        const data = await res.json();
        setBestSellingProducts(data);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchBestSelling();
  }, []);

  return { bestSellingProducts, loading, error };
}