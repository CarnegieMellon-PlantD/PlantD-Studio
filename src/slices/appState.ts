import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

export type AppState = {
  /** Page title */
  pageTitle: string | undefined;
  /** Current Namespace */
  currentNamespace: string | undefined;
};

const initialState: AppState = {
  pageTitle: undefined,
  currentNamespace: undefined,
};

export const appStateSlice = createSlice({
  name: 'appState',
  initialState,
  reducers: {
    updatePageTitle: (state, action: PayloadAction<string | undefined>) => {
      state.currentNamespace = action.payload;
    },
    updateCurrentNamespace: (state, action: PayloadAction<string | undefined>) => {
      state.currentNamespace = action.payload;
    },
  },
});

export const { updatePageTitle, updateCurrentNamespace } = appStateSlice.actions;
