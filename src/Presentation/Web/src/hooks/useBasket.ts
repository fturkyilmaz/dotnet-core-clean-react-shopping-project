import { useContext } from "react";
import { BasketContext, BasketContextType } from "../context/basketContext";

export const useBasket = (): BasketContextType => {
  const context = useContext(BasketContext);
  
  if (context === undefined) {
    throw new Error("useBasket must be used within a BasketProvider");
  }
  
  return context;
};
