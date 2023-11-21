import { createSupabaseServerClient } from '@/src/utils/supabase/server';
import { HttpStatusCode } from 'axios';
import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  const response = createSupabaseServerClient();
  const { data: { session, }, } = await response.auth.getSession();

  const providers = session.user.identities.map((item) => item.provider);

  if (!providers.includes('google')) {
    return NextResponse.json({
      error: '구글로 로그인 한 회원만 사용할 수 있는 기능입니다.',
    }, {
      status: 401,
    });
  }

  const googleAuthClient = new google.auth.OAuth2();

  googleAuthClient.setCredentials({
    access_token: session.provider_token,
    refresh_token: session.provider_refresh_token,
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

export async function POST(request: NextRequest) {
  const { fileName, } = await request.json();

  console.log(fileName);

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
      name: fileName,
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
