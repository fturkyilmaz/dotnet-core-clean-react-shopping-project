export type RootStackParamList = {
  // Auth stack
  Login: undefined;
  Signup: undefined;
  ForgotPassword: undefined;

  // App stack
  MainTabs: undefined;
  ProductDetails: { productId: string };
  Checkout: undefined;
};

export type TabParamList = {
  Home: undefined;
  Categories: undefined;
  Products: { category?: string };
  Cart: undefined;
  Profile: undefined;
};