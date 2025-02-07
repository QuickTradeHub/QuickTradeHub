import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,  // For storing user info
  cart: {
    items: [], // For storing cart items
  },
  wishlist: {
    items: [], // For storing wishlist items
  },
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Set user information (login/logout)
    setUser: (state, action) => {
      state.user = action.payload;
    },

    // Cart actions
    addToCart: (state, action) => {
      const itemExists = state.cart.items.find(item => item.id === action.payload.id);
      if (!itemExists) {
        state.cart.items.push(action.payload);
      }
    },
    removeFromCart: (state, action) => {
      state.cart.items = state.cart.items.filter(item => item.id !== action.payload.id);
    },
    clearCart: (state) => {
      state.cart.items = [];
    },

    // Wishlist actions
    addToWishlist: (state, action) => {
      const itemExists = state.wishlist.items.find(item => item.id === action.payload.id);
      if (!itemExists) {
        state.wishlist.items.push(action.payload);
      }
    },
    removeFromWishlist: (state, action) => {
      state.wishlist.items = state.wishlist.items.filter(item => item.id !== action.payload.id);
    },
    clearWishlist: (state) => {
      state.wishlist.items = [];
    },
  },
});

// Export actions to dispatch from components
export const { 
  setUser, 
  addToCart, 
  removeFromCart, 
  clearCart, 
  addToWishlist, 
  removeFromWishlist, 
  clearWishlist 
} = userSlice.actions;

// Export the reducer to be used in the store
export default userSlice.reducer;
