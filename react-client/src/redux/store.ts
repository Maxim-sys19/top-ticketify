import {configureStore} from '@reduxjs/toolkit';
import {authService} from "./api/auth/auth.service";
import authJwtTokenReducer from './api/auth/authToken.slice'
import profileReducer from './api/profile/profile.slice'
import {companyApiService} from "./api/admin/company/company.api.service";
import {transportApiService} from "./api/admin/transport/transport.api.service";
import {myCompanyApiService} from './api/admin/company/myCompany.api.service';


export const store = configureStore({
  reducer: {
    jwtToken: authJwtTokenReducer,
    profile: profileReducer,
    [authService.reducerPath]: authService.reducer,
    [companyApiService.reducerPath]: companyApiService.reducer,
    [transportApiService.reducerPath]: transportApiService.reducer,
    [myCompanyApiService.reducerPath]: myCompanyApiService.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      authService.middleware,
      companyApiService.middleware,
      transportApiService.middleware,
      myCompanyApiService.middleware,
    ])
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;