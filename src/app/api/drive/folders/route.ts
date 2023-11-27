import { Auth } from '@/src/utils/auth';
import { createSupabaseServerClient } from '@/src/utils/supabase/server';
import { HttpStatusCode } from 'axios';
import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  const response = createSupabaseServerClient();
  const { data: sessionData, } = await response.auth.getSession();
  const { data: { user, }, } = await response.auth.getUser();

  console.log('sessionData >> ', sessionData);

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

  const folders = await drive.files.list({
    corpus: 'user',
    q: 'mimeType=\'application/vnd.google-apps.folder\' and \'root\' in parents and trashed=false',
    orderBy: 'name',
    includeItemsFromAllDrives: false,
    pageSize: 50,
    fields: '*',
  });

  return NextResponse.json(folders.data, {
    status: HttpStatusCode.Ok,
  });
}

interface PostBody {
  folderName: string;
}

export async function POST(request: NextRequest) {
  const { folderName, }: PostBody = await request.json();

  console.log(folderName);

  const response = createSupabaseServerClient();
  const { data: { session, }, } = await response.auth.getSession();

  const googleAuthClient = new google.auth.OAuth2();

  googleAuthClient.setCredentials({
    access_token: session.provider_token,
    refresh_token: session.provider_refresh_token,
  });

  const drive = google.drive({
    version: 'v3',
    auth: googleAuthClient,
  });

  const createResponse = await drive.files.create({
    requestBody: {
      name: folderName,
      mimeType: 'application/vnd.google-apps.folder',
      parents: [ 'root', ],
    },
    fields: 'id',
  });

  console.log(createResponse);

  return NextResponse.json(createResponse, {
    status: HttpStatusCode.Created,
  });
}
