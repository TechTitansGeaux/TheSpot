import { createSlice } from "@reduxjs/toolkit";

// interface KeyPair<T, U> {
//   key: T;
//   value: U;
// }
// let kv1: KeyPair<string, void> = { key: 'authUser', value: null };

interface initState {
  isAuthenticated: boolean;
  authUser: {
    id: number;
    username: string;
    displayName: string;
    type: string | null;
    geolocation: string | null;
    mapIcon: string | null;
    birthday: Date | null;
    privacy: string | null;
    accessibility: string | null;
    email: string | null;
    picture: string | null;
    googleId: string | null;
  }

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