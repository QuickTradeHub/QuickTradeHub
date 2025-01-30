import { createSlice } from "@reduxjs/toolkit";

// Function to load cart state from localStorage safely
const loadCartFromLocalStorage = () => {
  try {
    const serializedState = localStorage.getItem("cart");
    return serializedState ? JSON.parse(serializedState) : [];
  } catch (error) {
    console.error("Error loading cart from localStorage:", error);
    return [];
  }
};

// Function to save cart state to localStorage
const saveCartToLocalStorage = (cartItems) => {
  try {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  } catch (error) {
    console.error("Error saving cart to localStorage:", error);
  }
};

// Initial state with a safe fallback
const initialState = {
  items: loadCartFromLocalStorage(), // Load from localStorage on startup
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const itemExists = state.items.find((item) => item.id === action.payload.id);
      if (itemExists) {
        itemExists.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
      saveCartToLocalStorage(state.items); // Save only the 'items' array
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload.id);
      saveCartToLocalStorage(state.items);
    },
    clearCart: (state) => {
      state.items = [];
      saveCartToLocalStorage(state.items);
    },
    setCartItems: (state, action) => {
      state.items.length = 0; // Clear the array correctly in Immer
      state.items.push(...(action.payload || [])); // Push new items safely
      saveCartToLocalStorage(state.items);
    },
  },
});

export const { addToCart, removeFromCart, clearCart, setCartItems } = cartSlice.actions;
export default cartSlice.reducer;
