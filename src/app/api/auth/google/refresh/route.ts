import axios, { HttpStatusCode } from 'axios';
import { NextRequest, NextResponse } from 'next/server';

interface PostBody {
  refreshToken: string;
}

export async function POST(request: NextRequest) {
  const { refreshToken, }: PostBody = await request.json();

  let url = `https://oauth2.googleapis.com/token`;
  url += `?refresh_token=${refreshToken}`;
  url += `&client_id=${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}`;
  url += `&client_secret=${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET}`;
  url += '&grant_type=refresh_token';

  const { data, } = await axios.post(url, {}, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  return NextResponse.json({
    response: data,
    message: '새로운 토큰이 발급되었습니다.',
  }, {
    status: HttpStatusCode.Ok,
  });
}
