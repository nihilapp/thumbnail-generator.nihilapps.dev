'use client';

import { useAppDispatch, useAppSelector } from '@/src/hooks/rtk';
import { setMessage, setMessageShown, setMessageType } from '@/src/reducers';
import { supabase } from '@/src/utils/supabase/client';
import { useRouter } from 'next/navigation';
import React, { useCallback } from 'react';
import { ClassNameValue, twJoin } from 'tailwind-merge';
import { PageLink } from '@/src/components/Common';
import { Icon } from '@iconify/react';

interface Props {
  styles?: ClassNameValue;
}

export function UserNav({ styles, }: Props) {
  const { user, } = useAppSelector(
    (state) => state.auth
  );

  const router = useRouter();
  const dispatch = useAppDispatch();

  const onClickSignOut = useCallback(
    () => {
      supabase.auth.signOut()
        .then(() => {
          dispatch(setMessageType('success'));
          dispatch(setMessageShown(false));
          dispatch(setMessage('로그아웃 되었습니다.'));
          router.push('/');
        });
    },
    []
  );

  const css = {
    default: twJoin([
      `flex flex-row`,
      styles,
    ]),
    signOut: twJoin([
      `p-2 px-4 flex flex-col items-center justify-center border-l border-b-0 border-t-0 border-black-200 hover:border-black-400 hover:bg-black-400 bg-white text-black-base hover:text-white w-[120px] font-500`,
    ]),
  };

  return (
    <>
      <nav className={css.default}>
        {user ? (
          <>
            <PageLink href='/mypage' as='/mypage' icon='mdi:account'>마이페이지</PageLink>
            <button
              onClick={onClickSignOut}
              className={css.signOut}
            >
              <Icon icon='mdi:logout-variant' className='text-[1.5rem]' />
              로그아웃
            </button>
          </>
        ) : (
          <>
            <PageLink href='/signup' as='/signup' icon='mdi:account-plus'>회원가입</PageLink>
            <PageLink href='/signin' as='/signin' icon='mdi:login-variant'>로그인</PageLink>
          </>
        )}
      </nav>
    </>
  );
}
