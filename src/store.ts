import { configureStore } from '@reduxjs/toolkit';

import { baseApi } from '@/services/baseApi';
import { appStateSlice } from '@/slices/appState';

export const store = configureStore({
  reducer: {
    [appStateSlice.name]: appStateSlice.reducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
