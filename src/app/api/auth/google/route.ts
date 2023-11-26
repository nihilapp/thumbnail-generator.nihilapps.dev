import { HttpStatusCode } from 'axios';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const scopes = [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/drive.file',
  ];

  let url = `https://accounts.google.com/o/oauth2/auth`;
  url += `?scope=${scopes.join(' ')}`;
  url += `&access_type=offline`;
  url += `&include_granted_scopes=true`;
  url += `&response_type=code`;
  url += `&client_id=${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}`;
  url += `&redirect_uri=${encodeURIComponent('http://localhost:3000/api/auth/google/redirect')}`;
  url += `&state=${encodeURIComponent(request.url)}`;

  return NextResponse.redirect(url);

  // return NextResponse.json('', {
  //   status: HttpStatusCode.Ok,
  // });
}
