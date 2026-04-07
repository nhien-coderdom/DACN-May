export interface ApiCategory {
  id: number;
  name: string;
  slug: string;
}

export interface ApiTopping {
  id: number;
  name: string;
  price: number;
}

export interface ApiProductTopping {
  productId: number;
  toppingId: number;
  topping: ApiTopping;
}

export interface ApiProduct {
  id: number;
  name: string;
  price: number;
  description: string | null;
  categoryId: number;
  imageUrl: string | null;
  imageId: string | null;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  category?: ApiCategory;
  toppings?: ApiProductTopping[];
}

export interface UiProduct {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  fullDescription: string;
  tag: string;
  price: number;
  image: string;
  ingredients: string[];
  availableToppings: {
    id: number;
    name: string;
    price: number;
  }[];
  calories: number;
  categorySlug: string;
}
