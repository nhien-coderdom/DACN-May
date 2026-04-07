import axios from "axios";
import type { ApiProduct, UiProduct } from "../types/product";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ??
  import.meta.env.VITE_API_BASE_URL ??
  "http://localhost:3000";

const productsClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1551024709-8f23befc6cf7?auto=format&fit=crop&w=1200&q=80";

function toSafeText(value: string | null | undefined, fallback: string): string {
  const text = value?.trim();
  return text && text.length > 0 ? text : fallback;
}

export function mapApiProductToUi(product: ApiProduct): UiProduct {
  const categoryName = product.category?.name ?? "Khac";
  const categorySlug = product.category?.slug ?? "khac";
  const baseDescription = toSafeText(
    product.description,
    "San pham dang duoc cap nhat mo ta."
  );

  return {
    id: product.id,
    title: product.name,
    subtitle: `${categoryName} · Made daily`,
    description: baseDescription,
    fullDescription: baseDescription,
    tag: categoryName,
    price: product.price,
    image: toSafeText(product.imageUrl, FALLBACK_IMAGE),
    ingredients: (product.toppings ?? []).map((item) => item.topping.name),
    availableToppings: (product.toppings ?? []).map((item) => ({
      id: item.topping.id,
      name: item.topping.name,
      price: item.topping.price,
    })),
    calories: 0,
    categorySlug,
  };
}

export async function getRawProducts(): Promise<ApiProduct[]> {
  const response = await productsClient.get<ApiProduct[]>("/products");
  return response.data;
}

export async function getRawProductById(id: number): Promise<ApiProduct> {
  const response = await productsClient.get<ApiProduct>(`/products/${id}`);
  return response.data;
}

export async function getProducts(): Promise<UiProduct[]> {
  const data = await getRawProducts();
  return data.map(mapApiProductToUi);
}

export async function getProductById(id: number): Promise<UiProduct> {
  const data = await getRawProductById(id);
  return mapApiProductToUi(data);
}

export async function getProductsByCategorySlug(
  categorySlug?: string
): Promise<UiProduct[]> {
  const products = await getProducts();

  if (!categorySlug) {
    return products;
  }

  const slug = categorySlug.toLowerCase();
  return products.filter((product) => product.categorySlug.toLowerCase() === slug);
}
