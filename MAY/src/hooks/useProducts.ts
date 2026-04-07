import { useEffect, useMemo, useState } from "react";
import { getProducts } from "../services/products.service";
import type { UiProduct } from "../types/product";

export interface ProductCategoryOption {
  slug: string;
  name: string;
}

export function useProducts(category?: string) {
  const [products, setProducts] = useState<UiProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadProducts() {
      try {
        setIsLoading(true);
        setErrorMessage(null);
        const data = await getProducts();
        if (active) {
          setProducts(data);
        }
      } catch {
        if (active) {
          setErrorMessage("Khong the tai danh sach san pham. Vui long thu lai.");
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      active = false;
    };
  }, []);

  const categories = useMemo<ProductCategoryOption[]>(() => {
    const map = new Map<string, string>();

    products.forEach((product) => {
      if (!map.has(product.categorySlug)) {
        map.set(product.categorySlug, product.tag);
      }
    });

    return [
      { slug: "", name: "All" },
      ...Array.from(map.entries()).map(([slug, name]) => ({ slug, name })),
    ];
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (!category) {
      return products;
    }

    return products.filter(
      (product) => product.categorySlug.toLowerCase() === category.toLowerCase()
    );
  }, [category, products]);

  return {
    products,
    categories,
    filteredProducts,
    isLoading,
    errorMessage,
  };
}
