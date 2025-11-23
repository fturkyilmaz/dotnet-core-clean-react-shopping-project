export interface User {
  id: string;
  email: string;
  username: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  expiryTime: string;
}

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

export interface CartItem {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  image: string;
}

export interface Cart {
  username: string;
  items: CartItem[];
  totalPrice: number;
}
