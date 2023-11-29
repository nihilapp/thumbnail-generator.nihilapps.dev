import { ApiResponse, RefreshAccessToken } from '../types/api.types';
import { apiPost } from './axios';
import { Nihil } from './nihil';
import { supabase } from './supabase/client';

export class Auth {
  static async GoogleRefreshToken() {
    const { data: { user, }, } = await supabase.auth.getUser();

    return apiPost<ApiResponse<RefreshAccessToken>, { refreshToken: string }>(
      '/auth/google/refresh',
      {
        refreshToken: user.user_metadata.provider_refresh_token,
      }
    ).then(async ({ data, }) => {
      console.log('액세스 토큰 재발급 결과 >> ', data.response);

      const newUser = await supabase.auth.updateUser({
        data: {
          provider_token: data.response.access_token,
          exp: Nihil.date().add(1, 'hour').format(),
        },
      });

      return {
        newUser: newUser.data.user,
        message: data.message,
      };
    });
  }

  static async expDiff() {
    const { data: { user, }, } = await supabase.auth.getUser();

    const expTime = new Date(user.user_metadata.exp).getTime();

    const diff = Math.floor((expTime - new Date().getTime()) / 1000);
    console.log('[세션] 만료까지 남은 시간 >> ', diff);

    return diff <= 300;
  }
}
