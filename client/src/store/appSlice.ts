/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  isAuthenticated: boolean;
  authUser: null | any; 
}

const initialState: AuthState = {
  isAuthenticated: false,
  authUser: null,
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setIsAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
    setAuthUser: (state, action: PayloadAction<any>) => {
      state.authUser = action.payload;
    },
  },
});

export const { setIsAuthenticated, setAuthUser } = appSlice.actions;
export default appSlice.reducer;
