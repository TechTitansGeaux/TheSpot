import { createSlice } from "@reduxjs/toolkit";

// interface KeyPair<T, U> {
//   key: T;
//   value: U;
// }
// let kv1: KeyPair<string, void> = { key: 'authUser', value: null };

interface initState {
  isAuthenticated: boolean;
  authUser: string | null
}

const initialState: initState = {
  isAuthenticated: false,
  authUser: null,
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setIsAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload;
    },
    setAuthUser: (state, action) => {
      state.authUser = action.payload;
    },
  },
});

export const { setIsAuthenticated, setAuthUser } = appSlice.actions;
export default appSlice.reducer;