'use client';

import { supabase } from '@/src/utils/supabase/client';
import React, { useCallback } from 'react';
import { ClassNameValue, twJoin } from 'tailwind-merge';
import Image from 'next/image';
import GoogleLogo from '@/src/images/icon/google-logo.png';
import GithubLogo from '@/src/images/icon/github-logo.png';

interface Props {
  styles?: ClassNameValue;
}

const scopes = [
  'https://www.googleapis.com/auth/drive',
];

export function AuthButton({ styles, }: Props) {
  const onClickGoogle = useCallback(
    async () => {
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: '/',
          scopes: scopes.join(' '),
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });
    },
    []
  );

  const onClickGithub = useCallback(
    async () => {
      await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: '/',
        },
      });
    },
    []
  );

  const css = {
    buttons: twJoin([
      `flex flex-col gap-2 mt-10 pt-10 w-2/4 mx-auto border-t-2 border-black-200`,
      styles,
    ]),
    google: twJoin([
      `bg-[#f3f3f3] text-black-base flex items-center justify-start border border-black-200 text-[1.1rem] font-500 hover:border-blue-500 hover:text-blue-600 transition-colors duration-200 h-[60px]`,
    ]),
    github: twJoin([
      `bg-black-base border text-white border-black-base flex items-center justify-start text-[1.1rem] font-500 hover:border-blue-400 hover:text-blue-400 transition-colors duration-200 h-[60px]`,
    ]),
    icon: twJoin([
      ``,
    ]),
    text: twJoin([
      `flex-1 border-l border-black-200`,
    ]),
    button: twJoin([
      `p-2 bg-black-200 hover:bg-blue-200 border border-black-400 hover:border-blue-400`,
    ]),
  };

  return (
    <div className={css.buttons}>
      <button
        onClick={onClickGoogle}
        className={css.google}
      >
        <Image
          src={GoogleLogo.src}
          width={GoogleLogo.width}
          height={GoogleLogo.height}
          alt='구글 로고'
          priority
          aria-hidden
          className={twJoin([
            css.icon,
            `mx-2`,
          ])}
        />
        <span className={css.text}>구글로 로그인하기</span>
      </button>
      <p className='text-blue-500 font-600 text-center mb-2 text-[1.1rem]'>구글로 로그인하면 드라이브에 썸네일을 저장할 수 있어요.</p>
      <button
        onClick={onClickGithub}
        className={css.github}
      >
        <Image
          src={GithubLogo.src}
          width={GithubLogo.width}
          height={GithubLogo.height}
          alt='깃허브 로고'
          priority
          aria-hidden
          className={twJoin([
            css.icon,
            `ml-[15px] mr-[15px] w-[25px] h-[25px]`,
          ])}
        />
        <span className={css.text}>깃허브로 로그인하기</span>
      </button>
    </div>
  );
}
