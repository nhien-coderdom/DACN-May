import { useState, useEffect } from 'react';
import { productService } from '../services/productService';
import { toppingService } from '../services/toppingService';
import type { Product } from '../services/productService';
import type { Topping } from '../services/toppingService';

export interface UseProductsReturn {
  products: Product[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Hook to fetch all products
 */
export const useProducts = (): UseProductsReturn => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await productService.getAll();
      setProducts(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return { products, loading, error, refetch: fetchProducts };
};

export interface UseProductByIdReturn {
  product: Product | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Hook to fetch a single product by ID
 */
export const useProductById = (id: number | undefined): UseProductByIdReturn => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProduct = async () => {
    if (!id) {
      setProduct(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await productService.getById(id);
      setProduct(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Error fetching product:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  return { product, loading, error, refetch: fetchProduct };
};

export interface UseProductsByCategoryReturn {
  products: Product[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Hook to fetch products by category
 */
export const useProductsByCategory = (categoryId: number | undefined): UseProductsByCategoryReturn => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchByCategory = async () => {
    if (!categoryId) {
      setProducts([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await productService.getByCategory(categoryId);
      setProducts(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Error fetching products by category:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchByCategory();
  }, [categoryId]);

  return { products, loading, error, refetch: fetchByCategory };
};

export interface UseAllToppingsReturn {
  toppings: Topping[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Hook to fetch all toppings
 */
export const useAllToppings = (): UseAllToppingsReturn => {
  const [toppings, setToppings] = useState<Topping[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchToppings = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await toppingService.getAll();
      setToppings(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Error fetching toppings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchToppings();
  }, []);

  return { toppings, loading, error, refetch: fetchToppings };
};
