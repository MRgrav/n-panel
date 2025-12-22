// store/slices/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type UserRole = 'ADMIN' | 'USER';

interface User {
  id: string;
  email: string;
  role: UserRole;
  accessToken: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
}

// Load initial state from localStorage
const loadState = (): AuthState => {
  try {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    const userStr = localStorage.getItem('user');
    
    if (accessToken && refreshToken && userStr) {
      const user = JSON.parse(userStr);
      return {
        user: { ...user, accessToken },
        isAuthenticated: true,
        loading: false
      };
    }
  } catch (error) {
    console.error('Error loading auth state:', error);
  }
  
  return {
    user: null,
    isAuthenticated: false,
    loading: false,
  };
};

const initialState: AuthState = loadState();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
    },
    loginSuccess: (state, action: PayloadAction<{ user: User; refreshToken: string }>) => {
      const { user, refreshToken } = action.payload;
      state.user = user;
      state.isAuthenticated = true;
      state.loading = false;
      
      // Store tokens and user info in localStorage
      localStorage.setItem('accessToken', user.accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify({
        id: user.id,
        email: user.email,
        role: user.role
      }));
    },
    loginFailure: (state) => {
      state.loading = false;
      // Clear localStorage on login failure
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      
      // Clear localStorage on logout
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    },
    updateTokens: (state, action: PayloadAction<{ accessToken: string; refreshToken: string }>) => {
      if (state.user) {
        state.user.accessToken = action.payload.accessToken;
        // Update localStorage
        localStorage.setItem('accessToken', action.payload.accessToken);
        localStorage.setItem('refreshToken', action.payload.refreshToken);
      }
    }
  },
});

export const { loginStart, loginSuccess, loginFailure, logout, updateTokens } = authSlice.actions;
export default authSlice.reducer;