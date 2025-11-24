export interface User {
  id: string;
  email: string;
  username: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  refreshTokenExpiryTime: string;
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
  id: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
}

export interface Cart {
  username: string;
  items: CartItem[];
  totalPrice: number;
}
