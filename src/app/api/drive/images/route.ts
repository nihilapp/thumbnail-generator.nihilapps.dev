import { UploadImage } from '@/src/types/api.types';
import { Nihil } from '@/src/utils/nihil';
import { createSupabaseServerClient } from '@/src/utils/supabase/server';
import axios, { HttpStatusCode } from 'axios';
import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';
import { Readable } from 'stream';

export async function POST(request: NextRequest) {
  const { folderId, imageFile, imageName, }: UploadImage = await request.json();

  const supabase = createSupabaseServerClient();
  const { data: sessionData, } = await supabase.auth.getSession();
  const { data: { user, }, } = await supabase.auth.getUser();

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
    access_token: user.user_metadata.provider_token,
    refresh_token: user.user_metadata.provider_refresh_token,
  });

  const drive = google.drive({
    version: 'v3',
    auth: googleAuthClient,
  });

  const { data: fileBlob, } = await supabase.storage
    .from('thumbnails').download(imageFile);

  const buffer = Buffer.from(await fileBlob.arrayBuffer());
  const stream = Readable.from(buffer);

  const uploadResponse = await drive.files.create({
    requestBody: {
      name: `${imageName}.png`,
      mimeType: 'image/png',
      parents: [ folderId, ],
    },
    media: {
      mimeType: 'image/png',
      body: stream,
    },
    fields: '*',
  });

  const { data, } = await supabase.storage.from('thumbnails').remove([
    imageFile,
  ]);

  return NextResponse.json({
    response: uploadResponse,
    message: '이미지 업로드에 성공했습니다.',
  }, {
    status: HttpStatusCode.Ok,
  });
}
