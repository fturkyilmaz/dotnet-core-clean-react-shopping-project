import axios, { AxiosError } from "axios";
import { createContext, useEffect, useState, useCallback, ReactNode, useMemo } from "react";
import type { Product } from "../types";

// Context Type with loading and error states
export interface ProductContextType {
  products: Product[] | null;
  category: string;
  setCategory: (category: string) => void;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export const ProductContext = createContext<ProductContextType | undefined>(undefined);

// API Service - Separation of Concerns
const productService = {
  async fetchProducts(category: string): Promise<Product[]> {
    const url =
      category === "all"
        ? "https://fakestoreapi.com/products"
        : `https://fakestoreapi.com/products/category/${category}`;

    const response = await axios.get<Product[]>(url);
    return response.data;
  },
};

// Helper: Load category from localStorage
const loadCategoryFromStorage = (): string => {
  try {
    return localStorage.getItem("category") || "all";
  } catch (error) {
    console.error("Failed to load category from localStorage:", error);
    return "all";
  }
};

// Helper: Save to localStorage
const saveToStorage = (key: string, value: string): void => {
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    console.error(`Failed to save ${key} to localStorage:`, error);
  }
};

// Provider Component
export function ProductProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [category, setCategory] = useState<string>(loadCategoryFromStorage);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Memoized category setter
  const handleSetCategory = useCallback((newCategory: string): void => {
    setCategory(newCategory);
    saveToStorage("category", newCategory);
  }, []);

  // Fetch products with error handling
  const fetchProducts = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    setProducts(null);

    try {
      const data = await productService.fetchProducts(category);
      setProducts(data);

      // Cache products in localStorage
      saveToStorage("products", JSON.stringify(data));
    } catch (err) {
      const errorMessage = err instanceof AxiosError
        ? err.message
        : "Ürünler yüklenirken bir hata oluştu";

      setError(errorMessage);
      console.error("Failed to fetch products:", err);

      // Try to load from cache on error
      try {
        const cached = localStorage.getItem("products");
        if (cached) {
          setProducts(JSON.parse(cached));
        }
      } catch (cacheError) {
        console.error("Failed to load cached products:", cacheError);
      }
    } finally {
      setIsLoading(false);
    }
  }, [category]);

  // Fetch products when category changes
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const value = useMemo(
    () => ({
      products,
      category,
      setCategory: handleSetCategory,
      isLoading,
      error,
      refetch: fetchProducts,
    }),
    [products, category, handleSetCategory, isLoading, error, fetchProducts]
  );

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
}
