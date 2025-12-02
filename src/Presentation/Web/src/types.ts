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

export interface BasketItem extends Product {
  amount: number;
}

export interface ServiceResult<T> {
  data: T;
  succeeded: boolean;
  message: string;
  errors: string[];
}

export interface Paginate<T> {
  items: T[];
  index: number;
  size: number;
  count: number;
  pages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

 export interface UserInfoResponse {
  id: string;
  userName: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
}