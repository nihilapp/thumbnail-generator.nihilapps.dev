'use client';

import { configData } from '@/src/data';
import { usePathname } from 'next/navigation';
import React, { useCallback } from 'react';
import { ClassNameValue, twJoin } from 'tailwind-merge';

interface Props {
  styles?: ClassNameValue;
}

const scopes = [
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/drive.file',
];

export function GoogleAuth({ styles, }: Props) {
  const pathname = usePathname();

  console.log(pathname);

  const onClickAuth = useCallback(
    () => {
      let url = `https://accounts.google.com/o/oauth2/auth`;
      url += `?scope=${scopes.join(' ')}`;
      url += `&access_type=offline`;
      url += `&include_granted_scopes=true`;
      url += `&response_type=code`;
      url += `&client_id=${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}`;
      url += `&redirect_uri=${encodeURIComponent('http://localhost:3000/auth/redirect')}`;
      url += `&state=${encodeURIComponent(`${configData.url}${pathname}`)}`;

      window.location.href = url;
    },
    [ pathname, ]
  );

  const style = {
    default: twJoin([
      ``,
      styles,
    ]),
  };

  return (
    <>
      <button onClick={onClickAuth}>구글 로그인</button>
    </>
  );
}
