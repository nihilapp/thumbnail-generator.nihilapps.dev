import { configData } from '@/src/data';
import { createSupabaseServerClient } from '@/src/utils/supabase/server';
import { HttpStatusCode } from 'axios';
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

  googleAuthClient.setCredentials({
    access_token: sessionData.session.provider_token,
    refresh_token: sessionData.session.provider_refresh_token,
  });

  const drive = google.drive({
    version: 'v3',
    auth: googleAuthClient,
  });

  console.log('image >> ', image);
  const parsedUrl = image.includes('http')
    ? new URL(image)
    : new URL(configData.url + image);

  const uploadResponse = await drive.files.create({
    media: {
      body: image,
      mimeType: 'image/png',
    },
    requestBody: {
      name: `${imageName}.png`,
      mimeType: 'image/png',
      parents: [ folderId, ],
    },
    fields: 'id',
  });

  return NextResponse.json(uploadResponse, {
    status: HttpStatusCode.Ok,
  });
}
