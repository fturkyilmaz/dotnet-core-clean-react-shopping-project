import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/services/api";
import { Cart, CartItem, ApiResponse } from "@/types";

interface CartState {
  cart: CartItem[] | null;
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
    const response = await api.get<ApiResponse<CartItem[]>>(`/carts`);
    return response.data?.data || [];
  }
);

// POST /carts (Yeni sepet veya ürün ekleme)
export const addToCart = createAsyncThunk(
  "cart/addCartItemAsync",
  async (request: CartItem, { rejectWithValue }) => {
    try {
      const response = await api.post<ApiResponse<number>>("/carts", request);
      return { ...request, id: response.data.data };
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
      await api.put<ApiResponse<boolean>>(`/carts/${cartId}`, { quantity });
      return { cartId, quantity };
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
      await api.delete<ApiResponse<boolean>>(
        `/carts/${id}`
      );
      return { id };
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
        if (state.cart) {
            state.cart.push(action.payload);
        } else {
            state.cart = [action.payload];
        }
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
        state.error = null;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        if (state.cart) {
            const itemIndex = state.cart.findIndex(item => item.id === action.payload.cartId);
            if (itemIndex !== -1) {
                state.cart[itemIndex].quantity = action.payload.quantity;
            }
        }
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.error =
          (action.payload as string) ||
          action.error.message ||
          "Failed to update cart item";
      })

      // REMOVE CART ITEM (DELETE)
      .addCase(removeCartItem.pending, (state) => {
        state.error = null;
      })
      .addCase(removeCartItem.fulfilled, (state, action) => {
        if (state.cart) {
            state.cart = state.cart.filter(item => item.id !== action.payload.id);
        }
      })
      .addCase(removeCartItem.rejected, (state, action) => {
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
        state.cart = [];
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
