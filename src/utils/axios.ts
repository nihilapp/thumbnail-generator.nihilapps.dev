import axios, { AxiosRequestConfig } from 'axios';
import { configData } from '@/src/data';

const config: AxiosRequestConfig = {
  withCredentials: true,
  baseURL: configData.baseApiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
};

export const api = axios.create(config);

export const apiGet = async <T>(restApi: string, config?: AxiosRequestConfig) => {
  return api.get<T>(restApi, config);
};

export const apiPost = async <T, P>(restApi: string, data: P, config?: AxiosRequestConfig) => {
  return api.post<T>(restApi, data, config);
};

export const apiPostMedia = async <T, P>(restApi: string, data: P, config?: AxiosRequestConfig) => {
  return api.post<T>(restApi, data, {
    ...config,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const apiPatch = async <T, P>(restApi: string, data: P, config?: AxiosRequestConfig) => {
  return api.patch<T>(restApi, data, config);
};

export const apiPut = async <T, P>(restApi: string, data: P, config?: AxiosRequestConfig) => {
  return api.put<T>(restApi, data, config);
};

export const apiDelete = async <T>(restApi: string, config?: AxiosRequestConfig) => {
  return api.delete<T>(restApi, config);
};

export const apiDeletes = async <T, P>(restApi: string, data: P, config?: AxiosRequestConfig) => {
  return api.delete<T>(restApi, {
    ...config,
    data,
  });
};
