import { createSupabaseServerClient } from '@/src/utils/supabase/server';
import axios from 'axios';
import { google } from 'googleapis';
import { NextResponse } from 'next/server';

export async function GET() {
  const response = createSupabaseServerClient();
  const { data: userData, } = await response.auth.getUser();

  const providers = userData.user.identities.map(
    (item) => item.provider
  );

  if (!providers.includes('google')) {
    return NextResponse.json({
      error: '구글로 로그인 한 회원만 사용할 수 있는 기능입니다.',
    }, {
      status: 401,
    });
  }

  const googleAuthClient = new google.auth.OAuth2();

  googleAuthClient.setCredentials({
    access_token: userData.user.user_metadata.provider_token,
    refresh_token: userData.user.user_metadata.provider_refresh_token,
  });

  let url = `https://oauth2.googleapis.com/token`;
  url += `?client_id=${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}`;
  url += `&client_secret=${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET}`;
  url += `&refresh_token=${userData.user.user_metadata.provider_refresh_token}`;
  url += `&grant_type=refresh_token`;

  const { data, } = await axios({
    url,
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Bearer ${userData.user.user_metadata.provider_token}`,
    },
  });

  console.log(data);

  return NextResponse.json('test');
}
