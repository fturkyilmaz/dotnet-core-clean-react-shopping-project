import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/services/api";
import { Cart, CartItem } from "@/types";

interface CartState {
  cart: Cart | null;
  loading: boolean;
  error: string | null;
}

const initialState: CartState = {
  cart: null,
  loading: false,
  error: null,
};

// GET /carts/{userId}
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (username: string) => {
    // API çağrısı: GET /carts
    const response = await api.get<Cart>(`/carts`);

    console.log("response.data", response.data);
    return response.data;
  }
);

// POST /carts (Yeni sepet veya ürün ekleme)
export const addToCart = createAsyncThunk(
  "cart/addCartItemAsync",
  async (request: CartItem, { rejectWithValue }) => {
    try {
      // Curl örneğine uygun olarak doğrudan ürün objesi ve miktarı gönderiliyor
      const response = await api.post<Cart>("/carts", request);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to add item to cart"
      );
    }
  }
);

// PUT /carts/{itemId} (Sepetteki bir ürünü güncelleme)
// Curl: PUT 'http://localhost:5000/api/v1/Carts/3'
export const updateCartItem = createAsyncThunk(
  "cart/updateCartItem",
  async (
    {
      cartId,
      productId,
      quantity,
    }: { cartId: number; productId: number; quantity: number },
    { rejectWithValue }
  ) => {
    try {
      // Yeni API endpoint'ine uygun olarak PUT isteği
      const response = await api.put<Cart>(`/carts/${cartId}`, { quantity });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to update cart item"
      );
    }
  }
);

// DELETE /carts/{id} (Sepetten ürün çıkarma)
export const removeCartItem = createAsyncThunk(
  "cart/removeCartItem",
  async (
    { id }: { id: number },
    { rejectWithValue }
  ) => {
    try {
      // Yeni API endpoint'ine uygun olarak DELETE isteği
      const response = await api.delete<Cart>(
        `/carts/${id}`
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to remove from cart"
      );
    }
  }
);
// DELETE /carts/delete-all (Sepetten tüm ürünleri çıkarma)
export const removeAllCartItems = createAsyncThunk(
  'cart/removeAllCartItems',
  async (_, { rejectWithValue }) => {
    try {
      await api.delete<Cart>('/carts/delete-all');
      return true;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          'Failed to remove all cart items'
      );
    }
  }
);


const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCart: (state) => {
      state.cart = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // FETCH CART
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) ||
          action.error.message ||
          "Failed to fetch cart";
      })

      // ADD TO CART (POST)
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) ||
          action.error.message ||
          "Failed to add to cart";
      })

      // UPDATE CART ITEM (PUT)
      .addCase(updateCartItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) ||
          action.error.message ||
          "Failed to update cart item";
      })

      .addCase(removeCartItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeCartItem.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
      })
      .addCase(removeCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) ||
          action.error.message ||
          "Failed to remove from cart";
      })

      // REMOVE ALL CART ITEMS
      .addCase(removeAllCartItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeAllCartItems.fulfilled, (state) => {
        state.loading = false;
        state.cart = { ...state.cart, items: [] } as Cart;
      })
      .addCase(removeAllCartItems.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) ||
          action.error.message ||
          "Failed to remove all cart items";
      });
  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;
