import axios from "axios";
import { createContext, useEffect, useState, ReactNode } from "react";
import { Product } from "../types";

export interface ProductContextType {
  products: Product[] | null;
  category: string;
  setCategory: (category: string) => void;
}

export const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [category, setCategory] = useState<string>("all");

  useEffect(() => {
    setProducts(null);
    const url =
      category === "all"
        ? "https://fakestoreapi.com/products"
        : `https://fakestoreapi.com/products/category/${category}`;

    axios
      .get(url)
      .then((res) => setProducts(res.data))
      .catch((err) => console.log(err));
  }, [category]);

  useEffect(() => {
    if (products) {
      localStorage.setItem("products", JSON.stringify(products));
    }
  }, [products]);

  useEffect(() => {
    localStorage.setItem("category", category);
  }, [category]);

  return (
    <ProductContext.Provider value={{ products, category, setCategory }}>
      {children}
    </ProductContext.Provider>
  );
}
