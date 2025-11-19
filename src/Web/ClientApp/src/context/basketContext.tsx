import { createContext, useEffect, useReducer, useCallback, ReactNode, useMemo } from "react";
import { toast } from "react-toastify";
import type { BasketItem, Product } from "../types";

// Action Types
type BasketAction =
  | { type: "ADD_ITEM"; payload: Product }
  | { type: "REMOVE_ITEM"; payload: number }
  | { type: "CLEAR_BASKET" }
  | { type: "INITIALIZE_BASKET"; payload: BasketItem[] };

// Context Type
export interface BasketContextType {
  basket: BasketItem[];
  addToBasket: (product: Product) => void;
  removeFromBasket: (id: number) => void;
  purchaseBasket: () => void;
  totalItems: number;
  totalPrice: number;
}

export const BasketContext = createContext<BasketContextType | undefined>(undefined);

// Reducer Function - Pure logic, easy to test
const basketReducer = (state: BasketItem[], action: BasketAction): BasketItem[] => {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingItem = state.find((item) => item.id === action.payload.id);

      if (existingItem) {
        return state.map((item) =>
          item.id === action.payload.id
            ? { ...item, amount: item.amount + 1 }
            : item
        );
      }

      return [...state, { ...action.payload, amount: 1 }];
    }

    case "REMOVE_ITEM": {
      const existingItem = state.find((item) => item.id === action.payload);

      if (!existingItem) return state;

      if (existingItem.amount > 1) {
        return state.map((item) =>
          item.id === action.payload
            ? { ...item, amount: item.amount - 1 }
            : item
        );
      }

      return state.filter((item) => item.id !== action.payload);
    }

    case "CLEAR_BASKET":
      return [];

    case "INITIALIZE_BASKET":
      return action.payload;

    default:
      return state;
  }
};

// Helper: Load basket from localStorage
const loadBasketFromStorage = (): BasketItem[] => {
  try {
    const storedBasket = localStorage.getItem("basket");
    return storedBasket ? JSON.parse(storedBasket) : [];
  } catch (error) {
    console.error("Failed to load basket from localStorage:", error);
    return [];
  }
};

// Helper: Save basket to localStorage
const saveBasketToStorage = (basket: BasketItem[]): void => {
  try {
    if (basket.length > 0) {
      localStorage.setItem("basket", JSON.stringify(basket));
    } else {
      localStorage.removeItem("basket");
    }
  } catch (error) {
    console.error("Failed to save basket to localStorage:", error);
  }
};

// Provider Component
export function BasketProvider({ children }: { children: ReactNode }) {
  const [basket, dispatch] = useReducer(basketReducer, [], loadBasketFromStorage);

  // Memoized callbacks - prevent unnecessary re-renders
  const addToBasket = useCallback((product: Product): void => {
    const existingItem = basket.find((item) => item.id === product.id);

    dispatch({ type: "ADD_ITEM", payload: product });

    if (existingItem) {
      toast.info(`Ürün miktarı arttırıldı (${existingItem.amount + 1})`);
    } else {
      toast.success("Ürün sepete eklendi");
    }
  }, [basket]);

  const removeFromBasket = useCallback((id: number): void => {
    const existingItem = basket.find((item) => item.id === id);

    if (!existingItem) return;

    dispatch({ type: "REMOVE_ITEM", payload: id });

    if (existingItem.amount > 1) {
      toast.info(`Ürün miktarı azaltıldı (${existingItem.amount - 1})`);
    } else {
      toast.error("Ürün sepetten kaldırıldı");
    }
  }, [basket]);

  const purchaseBasket = useCallback((): void => {
    dispatch({ type: "CLEAR_BASKET" });
    toast.success("Satın alma işlemi başarılı! İyi günler dileriz.");
  }, []);

  // Memoized computed values
  const totalItems = useMemo(
    () => basket.reduce((total, item) => total + item.amount, 0),
    [basket]
  );

  const totalPrice = useMemo(
    () => basket.reduce((total, item) => total + item.price * item.amount, 0),
    [basket]
  );

  // Persist to localStorage
  useEffect(() => {
    saveBasketToStorage(basket);
  }, [basket]);

  const value = useMemo(
    () => ({
      basket,
      addToBasket,
      removeFromBasket,
      purchaseBasket,
      totalItems,
      totalPrice,
    }),
    [basket, addToBasket, removeFromBasket, purchaseBasket, totalItems, totalPrice]
  );

  return (
    <BasketContext.Provider value={value}>
      {children}
    </BasketContext.Provider>
  );
}
