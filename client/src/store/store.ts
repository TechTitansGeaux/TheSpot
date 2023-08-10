/* eslint-disable @typescript-eslint/no-unused-vars */
import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import logger from "redux-logger";
import appReducer from "./appSlice";

export const store = configureStore({
  middleware: (getDefaultMiddleware) =>
    [...getDefaultMiddleware(), logger],
  reducer: {
    app: appReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export const AppThunk = (action: (dispatch: AppDispatch, getState: RootState) => void) => {
  return function (dispatch: AppDispatch, getState: RootState) {
    return action(dispatch, getState);
  };
};
