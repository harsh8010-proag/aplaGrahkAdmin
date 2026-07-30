import { configureStore } from '@reduxjs/toolkit';
import { authApi } from './api/authApi';
import { servicesApi } from './api/servicesApi';
import { documentApi } from './api/documentApi';
import { applicationsApi } from './api/applicationsApi';
import { usersApi } from './api/usersApi';
import { contactsApi } from './api/contactsApi';

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [servicesApi.reducerPath]: servicesApi.reducer,
    [documentApi.reducerPath]: documentApi.reducer,
    [applicationsApi.reducerPath]: applicationsApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer,
    [contactsApi.reducerPath]: contactsApi.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
        authApi.middleware, 
        servicesApi.middleware,
        documentApi.middleware,
      applicationsApi.middleware,
    usersApi.middleware,
    contactsApi.middleware),

        
        
});
