// wishlistSlice.js

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [], // This will store the items in the wishlist
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    // Add item to wishlist
    addToWishlist: (state, action) => {
      const item = action.payload;
      // Check if the item is already in the wishlist
      if (!state.items.find((wishlistItem) => wishlistItem._id === item._id)) {
        state.items.push(item);
      }
    },
    // Remove item from wishlist
    removeFromWishlist: (state, action) => {
      const itemId = action.payload;
      state.items = state.items.filter((item) => item._id !== itemId);
    },
    // Clear the wishlist
    clearWishlist: (state) => {
      state.items = [];
    },
  },
});

// Export actions
export const { addToWishlist, removeFromWishlist, clearWishlist } = wishlistSlice.actions;

// Export reducer
export default wishlistSlice.reducer;
