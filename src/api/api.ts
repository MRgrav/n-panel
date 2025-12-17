import axios, { AxiosError, AxiosResponse } from 'axios';

export const REACT_BASE_URL = 'https://nityax.deolang.com/api/';

const api = axios.create({
  baseURL: 'https://nityax.deolang.com/api/',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

const request = async <T>(
  method: string, 
  url: string, 
  data?: any, 
  token?: string, 
  params?: Record<string, any> 
): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await api({
      method,
      url,
      data: method.toLowerCase() === 'delete' ? undefined : data, // Don't send data for DELETE
      params: params, // Add params for all methods
      headers: {
        Authorization: token ? `Bearer ${token}` : '',  
        ...(method.toLowerCase() === 'delete' ? { 'Content-Type': undefined } : {}), // Remove content-type for DELETE
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

const get = <T>(url: string, params?: Record<string, any>, token?: string): Promise<T> => {
  return request<T>('get', url, undefined, token, params);
};

const post = <T>(url: string, data: any, token?: string): Promise<T> => {
  return request<T>('post', url, data, token);
};

const put = <T>(url: string, data: any, token?: string): Promise<T> => {
  return request<T>('put', url, data, token);
};

const patch = <T>(url: string, data: any, token?: string): Promise<T> => {
  return request<T>('patch', url, data, token);
};

const del = <T>(url: string, token?: string): Promise<T> => {
  return request<T>('delete', url, undefined, token);
};

export { get, post, put, patch, del };