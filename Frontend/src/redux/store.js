import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import cartReducer from './cartSlice';
import wishlistReducer from './wishlistSlice'; // Assuming you have a wishlistSlice

export const store = configureStore({
  reducer: {
    user: userReducer,
    cart: cartReducer,
    wishlist: wishlistReducer, // Adding wishlist reducer
  },
});
