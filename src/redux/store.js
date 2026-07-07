import { configureStore } from '@reduxjs/toolkit';
import { authApi } from './api/authApi';
import { servicesApi } from './api/servicesApi';
import { documentApi } from './api/documentApi';

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [servicesApi.reducerPath]: servicesApi.reducer,
    [documentApi.reducerPath]: documentApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
        authApi.middleware, 
        servicesApi.middleware,
        documentApi.middleware),
        
});
