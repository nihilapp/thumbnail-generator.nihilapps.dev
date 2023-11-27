import { ApiResponse, RefreshAccessToken } from '../types/api.types';
import { apiPost } from './axios';

export class Auth {
  static async GoogleRefreshToken(refreshToken: string) {
    return apiPost<ApiResponse<RefreshAccessToken>, { refreshToken: string }>(
      '/auth/google/refresh',
      {
        refreshToken,
      }
    );
  }
}
