import { createSupabaseServerClient } from '@/src/utils/supabase/server';
import { HttpStatusCode } from 'axios';
import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
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

  const folders = await drive.files.list({
    corpus: 'user',
    q: 'mimeType=\'application/vnd.google-apps.folder\' and \'root\' in parents and trashed=false',
    orderBy: 'name',
    includeItemsFromAllDrives: false,
    pageSize: 50,
    fields: '*',
  });

  return NextResponse.json({
    response: folders.data,
    message: 'ok',
  }, {
    status: HttpStatusCode.Ok,
  });
}

interface PostBody {
  folderName: string;
}

export async function POST(request: NextRequest) {
  const { folderName, }: PostBody = await request.json();

  const response = createSupabaseServerClient();
  const { data: { session, }, } = await response.auth.getSession();
  const { data: { user, }, } = await response.auth.getUser();

  const googleAuthClient = new google.auth.OAuth2();

  googleAuthClient.setCredentials({
    access_token: user.user_metadata.provider_token,
    refresh_token: user.user_metadata.provider_refresh_token,
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

  return NextResponse.json({
    response: createResponse,
    message: 'ok',
  }, {
    status: HttpStatusCode.Created,
  });
}
