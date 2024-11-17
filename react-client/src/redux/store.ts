import {configureStore} from '@reduxjs/toolkit';
import {authService} from "./api/auth/auth.service";
import authJwtTokenReducer from './api/auth/authToken.slice'

export const store = configureStore({
  reducer: {
    jwtToken: authJwtTokenReducer,
    [authService.reducerPath]: authService.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([authService.middleware])
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;