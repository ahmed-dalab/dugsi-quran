import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AuthUser } from "./authApi";


interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
    isBootstrapping: boolean;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isBootstrapping: true
};

interface SetCredentialsPayload {
  user: AuthUser;
  accessToken: string;
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<SetCredentialsPayload>) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
    },
    clearAuth: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
    },
    setBootstrapping: (state, action: PayloadAction<boolean>) => {
      state.isBootstrapping = action.payload;
    },
  },
});

export const { setCredentials, clearAuth, setBootstrapping } = authSlice.actions;
export default authSlice.reducer;