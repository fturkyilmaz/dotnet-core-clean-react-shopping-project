export interface User {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  gender?: string;
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
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
  quantity: number;
}

export interface Cart {
  username: string;
  items: CartItem[];
  totalPrice: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ApiResponse<T> {
  data: T;
  isSuccess: boolean;
  message: string | null;
  errors: string[] | null;
}
