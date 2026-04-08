import axios from "axios";

// API public: dùng cho trang sản phẩm, chi tiết sản phẩm
const publicApi = axios.create({
  baseURL: "http://localhost:3000",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

type ProductTopping = {
  id: number;
  name: string;
  price: number;
};

type ProductToppingRelation = {
  toppingId: number;
  topping?: ProductTopping | null;
};

type ProductApiResponse = Omit<Product, "toppings"> & {
  toppings?: ProductToppingRelation[];
};

export interface Product {
  id: number;
  name: string;
  price: number;
  description?: string;
  categoryId: number;
  imageUrl?: string;
  imageId?: string;
  createdAt?: string;
  updatedAt?: string;
  isDeleted?: boolean;
  category?: {
    id: number;
    name: string;
    slug?: string;
  };
  toppings?: ProductTopping[];
}

const normalizeProduct = (product: ProductApiResponse): Product => {
  const toppings = (product.toppings || [])
    .map((relation) => relation.topping)
    .filter((topping): topping is ProductTopping => Boolean(topping));

  return {
    ...product,
    toppings,
  };
};

export const productService = {
  getAll: async (): Promise<Product[]> => {
    try {
      const response = await publicApi.get<ProductApiResponse[]>("/products");
      return response.data.map(normalizeProduct);
    } catch (error) {
      throw new Error(`Failed to fetch products: ${error}`);
    }
  },

  getById: async (id: number): Promise<Product> => {
    try {
      const response = await publicApi.get<ProductApiResponse>(`/products/${id}`);
      return normalizeProduct(response.data);
    } catch (error) {
      throw new Error(`Failed to fetch product with ID ${id}: ${error}`);
    }
  },

  getByCategory: async (categoryId: number): Promise<Product[]> => {
    try {
      const allProducts = await productService.getAll();
      return allProducts.filter((p) => p.categoryId === categoryId);
    } catch (error) {
      throw new Error(`Failed to fetch products by category: ${error}`);
    }
  },
};

export default productService;