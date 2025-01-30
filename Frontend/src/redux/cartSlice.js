import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const itemExists = state.items.find(item => item.id === action.payload.id);
      if (itemExists) {
        itemExists.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload.id);
    },
    clearCart: (state) => {
      state.items = [];
    },
    setCartItems: (state, action) => {
      state.items = action.payload; // Load persisted cart
    }
  },
});

export const { addToCart, removeFromCart, clearCart,setCartItems } = cartSlice.actions;
export default cartSlice.reducer;
