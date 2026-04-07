import axios from "axios";

const publicApi = axios.create({
  baseURL: "http://localhost:3000",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export interface Category {
  id: number;
  name: string;
  slug: string;
  order?: number;
  parentId?: number;
  createdAt?: string;
  updatedAt?: string;
  isDeleted?: boolean;
}

export const categoryService = {
  getAll: async (): Promise<Category[]> => {
    try {
      const response = await publicApi.get<Category[]>("/categories");
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch categories: ${error}`);
    }
  },

  getById: async (id: number): Promise<Category> => {
    try {
      const response = await publicApi.get<Category>(`/categories/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch category with ID ${id}: ${error}`);
    }
  },
};

export default categoryService;