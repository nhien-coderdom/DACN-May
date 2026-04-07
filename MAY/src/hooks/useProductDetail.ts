import { useEffect, useMemo, useState } from "react";
import { getProductById, getProducts } from "../services/products.service";
import type { UiProduct } from "../types/product";

export function useProductDetail(id?: string) {
  const [product, setProduct] = useState<UiProduct | null>(null);
  const [allProducts, setAllProducts] = useState<UiProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadData() {
      const productId = Number(id);

      if (!id || Number.isNaN(productId)) {
        setErrorMessage("ID san pham khong hop le.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setErrorMessage(null);

        const [productData, productsData] = await Promise.all([
          getProductById(productId),
          getProducts(),
        ]);

        if (active) {
          setProduct(productData);
          setAllProducts(productsData);
        }
      } catch {
        if (active) {
          setErrorMessage("Khong the tai chi tiet san pham. Vui long thu lai.");
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    loadData();

    return () => {
      active = false;
    };
  }, [id]);

  const toppingOptions = useMemo(() => {
    return product?.availableToppings ?? [];
  }, [product]);

  const relatedProducts = useMemo(() => {
    if (!product) {
      return [];
    }

    return allProducts.filter(
      (item) =>
        item.categorySlug === product.categorySlug && item.id !== product.id
    );
  }, [allProducts, product]);

  return {
    product,
    relatedProducts,
    toppingOptions,
    isLoading,
    errorMessage,
  };
}
