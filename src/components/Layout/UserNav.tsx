'use client';

import { useAppDispatch, useAppSelector } from '@/src/hooks/rtk';
import { setMessage, setMessageShown } from '@/src/reducers';
import { supabase } from '@/src/utils/supabase/client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useCallback } from 'react';
import { ClassNameValue, twJoin } from 'tailwind-merge';

interface Props {
  styles?: ClassNameValue;
}

export function UserNav({ styles, }: Props) {
  const { user, session, } = useAppSelector(
    (state) => state.auth
  );

  const router = useRouter();
  const dispatch = useAppDispatch();

  const onClickSignOut = useCallback(
    () => {
      supabase.auth.signOut()
        .then(() => {
          dispatch(setMessageShown(false));
          dispatch(setMessage('로그아웃 되었습니다.'));
          router.push('/');
        });
    },
    []
  );

  const style = {
    default: twJoin([
      ``,
      styles,
    ]),
  };

  return (
    <>
      <nav className={style.default}>
        {user ? (
          <>
            <span>{user.email}님 환영합니다.</span>
            <Link href='/mypage'>마이페이지</Link>
            <button onClick={onClickSignOut}>로그아웃</button>
          </>
        ) : (
          <>
            <Link href='/signup'>회원가입</Link>
            <Link href='/signin'>로그인</Link>
          </>
        )}
      </nav>
    </>
  );
}
