import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: JSON.parse(localStorage.getItem("user")),  // For storing user info
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Set user information (login/logout)
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
});

// Export actions to dispatch from components
export const { 
  setUser, 
} = userSlice.actions;

// Export the reducer to be used in the store
export default userSlice.reducer;
