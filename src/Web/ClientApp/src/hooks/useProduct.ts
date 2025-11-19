import { useContext } from "react";
import { ProductContext, ProductContextType } from "../context/productContext";

export const useProduct = (): ProductContextType => {
  const context = useContext(ProductContext);
  
  if (context === undefined) {
    throw new Error("useProduct must be used within a ProductProvider");
  }
  
  return context;
};
