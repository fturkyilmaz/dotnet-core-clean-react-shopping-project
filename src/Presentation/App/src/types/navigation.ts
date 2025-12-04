import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Auth: undefined;
  Login: undefined;
  Signup: undefined;
  ForgotPassword: undefined;
  App: undefined;
  Home: undefined;
  Products: undefined;
  ProductDetails: { productId: number };
  Category: { category: string };
  Cart: undefined;
  Notifications: undefined;
  Profile: undefined;
  OrderSuccess: undefined;
  Checkout: undefined;
};

export type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
