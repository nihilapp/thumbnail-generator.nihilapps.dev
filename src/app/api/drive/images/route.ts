import { configData } from '@/src/data';
import { Auth } from '@/src/utils/auth';
import { createSupabaseServerClient } from '@/src/utils/supabase/server';
import axios, { HttpStatusCode } from 'axios';
import { Blob } from 'buffer';
import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';

interface PostBody {
  folderId: string;
  image: string;
  imageName: string;
}

export async function POST(request: NextRequest) {
  const { folderId, image, imageName, }: PostBody = await request.json();

  const response = createSupabaseServerClient();
  const { data: sessionData, } = await response.auth.getSession();
  const { data: { user, }, } = await response.auth.getUser();

  const providers = sessionData.session.user.identities.map(
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
  const expTime = new Date(sessionData.session.expires_at * 1000).getTime();
  const nowTime = new Date().getTime();

  console.log(expTime, nowTime);

  if (((expTime - nowTime) < 0) || (expTime - nowTime) < 150000) {
    Auth.GoogleRefreshToken(sessionData.session.user.user_metadata.provider_refresh_token).then(({ data, }) => {
      response.auth.updateUser({
        data: {
          provider_token: data.response.access_token,
        },
      });
    });
  }

  googleAuthClient.setCredentials({
    access_token: user.user_metadata.provider_token,
    refresh_token: user.user_metadata.provider_refresh_token,
  });

  const drive = google.drive({
    version: 'v3',
    auth: googleAuthClient,
  });

  const formData = new FormData();
  let imageBlob = await fetch(image);
  let imageBlob2 = await imageBlob.blob();

  console.log();

  formData.append('file', imageBlob2, 'image.png');

  const uploadResponse = await drive.files.create({
    media: {
      body: formData,
      mimeType: 'image/png',
    },
    requestBody: {
      name: `${imageName}.png`,
      mimeType: 'image/png',
      parents: [ folderId, ],
    },
    uploadType: 'multipart',
    fields: 'id',
  });

  return NextResponse.json({
    response: uploadResponse,
    message: '이미지 업로드에 성공했습니다.',
  }, {
    status: HttpStatusCode.Ok,
  });
}
