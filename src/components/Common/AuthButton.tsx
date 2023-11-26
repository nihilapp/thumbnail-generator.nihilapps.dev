'use client';

import { supabase } from '@/src/utils/supabase/client';
import { signIn } from 'next-auth/react';
import React, { useCallback } from 'react';
import { ClassNameValue, twJoin } from 'tailwind-merge';
import { GoogleAuth } from './GoogleAuth';

interface Props {
  styles?: ClassNameValue;
}

const scopes = [
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/drive.file',
];

export function AuthButton({ styles, }: Props) {
  const onClickGoogle = useCallback(
    () => {
      signIn('google');
      // supabase.auth.signInWithOAuth({
      //   provider: 'google',
      //   options: {
      //     redirectTo: '/',
      //     scopes: scopes.join(' '),
      //     queryParams: {
      //       access_type: 'offline',
      //       prompt: 'consent',
      //     },
      //   },
      // });
    },
    []
  );

  const onClickGithub = useCallback(
    () => {
      signIn('github');
      // supabase.auth.signInWithOAuth({
      //   provider: 'github',
      //   options: {
      //     redirectTo: '/',
      //   },
      // });
    },
    []
  );

  const style = {
    buttons: twJoin([
      'flex flex-col gap-2 mt-5 w-1/4',
      styles,
    ]),
    button: twJoin([
      'p-2 bg-black-200 hover:bg-blue-200 border border-black-400 hover:border-blue-400',
    ]),
  };

  return (
    <>
      <div className={style.buttons}>
        <GoogleAuth />
        {/* <button onClick={onClickGoogle} className={style.button}>구글로 로그인하기</button> */}
        {/* <button onClick={onClickGithub} className={style.button}>깃허브로 로그인하기</button> */}
      </div>
    </>
  );
}
