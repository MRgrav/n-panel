// api/api.ts
import axios, { AxiosError, AxiosResponse } from 'axios';
import { store } from '../store';
import { logout } from '../store/slices/authSlice';

export const REACT_BASE_URL = 'https://nityax.deolang.com/api/';

const api = axios.create({
  baseURL: 'https://nityax.deolang.com/api/',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Add request interceptor to add token to all requests
api.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.auth.user?.accessToken;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token refresh
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token as string);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If token is already being refreshed, queue the request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Get refresh token from localStorage or store
        const refreshToken = localStorage.getItem('refreshToken');
        const state = store.getState();
        const user = state.auth.user;

        if (!refreshToken || !user) {
          throw new Error('No refresh token available');
        }

        // Call refresh token endpoint
        const response = await axios.post(`${REACT_BASE_URL}auth/refresh`, {
          refreshToken,
          userId: user.id
        });

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data;

        // Update store with new tokens
        store.dispatch({
          type: 'auth/updateTokens',
          payload: {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
          }
        });

        // Store new tokens in localStorage
        localStorage.setItem('accessToken', newAccessToken);
        localStorage.setItem('refreshToken', newRefreshToken);

        // Update Authorization header
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // Process queued requests
        processQueue(null, newAccessToken);

        // Retry original request
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, logout user
        processQueue(refreshError, null);
        store.dispatch(logout());
        
        // Clear localStorage
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        
        // Redirect to login
        window.location.href = '/login';
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // For other errors, just reject
    return Promise.reject(error);
  }
);

const request = async <T>(
  method: string, 
  url: string, 
  data?: any, 
  params?: Record<string, any> 
): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await api({
      method,
      url,
      data: method.toLowerCase() === 'delete' ? undefined : data,
      params: params, 
      headers: {
        ...(method.toLowerCase() === 'delete' ? { 'Content-Type': undefined } : {}),
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('API error:', error.message);
      throw error.response?.data || error.message; 
    } else {
      console.error('Unexpected error:', error);
      throw 'An unexpected error occurred';
    }
  }
};

const get = <T>(url: string, params?: Record<string, any>): Promise<T> => {
  return request<T>('get', url, undefined, params);
};

const post = <T>(url: string, data: any): Promise<T> => {
  return request<T>('post', url, data);
};

const put = <T>(url: string, data: any): Promise<T> => {
  return request<T>('put', url, data);
};

const patch = <T>(url: string, data: any): Promise<T> => {
  return request<T>('patch', url, data);
};

const del = <T>(url: string): Promise<T> => {
  return request<T>('delete', url, undefined);
};

export { api, get, post, put, patch, del };