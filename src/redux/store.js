import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";

const store = configureStore({
    reducer: {
        auth: authReducer, // Register the slice reducer
    },
});

store.subscribe(() => {
    try {
        const state = store.getState().auth; // Get the latest auth state
        localStorage.setItem("auth", JSON.stringify(state));
    } catch (error) {
        console.error("Error saving auth state:", error);
    }
});

export const fetchWithAuth = async (url, method = "GET", body = null) => {
    try {
      const token = store.getState().auth.token; // Get token from Redux state
  
      if (!token) {
        throw new Error("No authentication token found.");
      }
  
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: body ? JSON.stringify(body) : null,
      });

      const resu = await response.json();
  
      return resu;
    } catch (error) {
      console.log('req error',error);
      return {status:false,message:"Error processing request"}
    }
  };


export default store;
