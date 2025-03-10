import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    isLoggedIn: false,
    token: null,
    username:""
  };

const loadAuthState = () => {
    try {
      const savedState = localStorage.getItem("auth");
      return savedState ? JSON.parse(savedState) : initialState;
    } catch (error) {
      console.error("Error loading auth state:", error);
      return initialState;
    }
  };
  



const authSlice = createSlice({
  name: "auth",
  initialState:loadAuthState(),
  reducers: {
    login: (state, action) => {
      state.isLoggedIn = true;
      state.token = action.payload.token; // Store token
      state.username = action.payload.username;
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.token = null;
      state.username = ""
    },
  },
});

// Export actions
export const { login, logout } = authSlice.actions;

// Export reducer
export default authSlice.reducer;
