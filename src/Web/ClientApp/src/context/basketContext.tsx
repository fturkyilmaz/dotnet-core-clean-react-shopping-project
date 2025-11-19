import { createContext, useEffect, useState, ReactNode } from "react";
import { toast } from "react-toastify";
import { BasketItem, Product } from "../types";

export interface BasketContextType {
  basket: BasketItem[];
  addToBasket: (product: Product) => void;
  removeFromBasket: (id: number) => void;
  purchaseBasket: () => void;
}

export const BasketContext = createContext<BasketContextType | undefined>(undefined);

export function BasketProvider({ children }: { children: ReactNode }) {
  const [basket, setBasket] = useState<BasketItem[]>([]);

  const addToBasket = (newProduct: Product) => {
    const found = basket.find((i) => i.id === newProduct.id);

    if (found) {
      const updated = { ...found, amount: found.amount + 1 };
      const newBasket = basket.map((item) =>
        item.id === updated.id ? updated : item
      );
      setBasket(newBasket);
      toast.info(`Ürün miktarı arttırıldı (${updated.amount})`);
    } else {
      const newBaskets = [...basket, { ...newProduct, amount: 1 }];
      setBasket(newBaskets);
      toast.success("Ürün sepete eklendi");
    }
  };

  const removeFromBasket = (delete_id: number) => {
    const found = basket.find((i) => i.id === delete_id);

    if (!found) return;

    if (found.amount > 1) {
      const updated = { ...found, amount: found.amount - 1 };
      const newBasket = basket.map((i) => (i.id === updated.id ? updated : i));
      setBasket(newBasket);
      toast.info(`Ürün miktarı azaltıldı (${updated.amount})`);
    } else {
      const filtred = basket.filter((i) => i.id !== delete_id);
      setBasket(filtred);
      toast.error(`Ürün sepetten kaldırıldı`);
    }
  };

  const purchaseBasket = () => {
    setBasket([]);
    toast.info(`Satın alma gerçekleşti iyi günler dileriz.`);
    alert("Satın alma işlemi başarılı!");
  };

  useEffect(() => {
    if (basket.length > 0) {
      localStorage.setItem("basket", JSON.stringify(basket));
    }
  }, [basket]);

  return (
    <BasketContext.Provider
      value={{ basket, addToBasket, removeFromBasket, purchaseBasket }}
    >
      {children}
    </BasketContext.Provider>
  );
}
