/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { configureStore, PayloadAction } from "@reduxjs/toolkit";
import logger from "redux-logger";
import appReducer from "./appSlice";

export const store = configureStore({
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(logger),
  reducer: {
    app: appReducer
  },
});

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>

interface action {
  dispatch: AppDispatch,
  getState: RootState
}

export const AppThunk = (action: any) => {
  return function (dispatch: AppDispatch, getState: RootState) {
    return action(dispatch, getState);
  };
};

export default store;