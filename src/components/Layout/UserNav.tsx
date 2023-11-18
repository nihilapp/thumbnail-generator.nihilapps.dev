'use client';

import { useAppSelector } from '@/src/hooks/rtk';
import { supabase } from '@/src/utils/supabase/client';
import Link from 'next/link';
import React, { useCallback } from 'react';
import { toast } from 'react-toastify';
import { ClassNameValue, twJoin } from 'tailwind-merge';

interface Props {
  styles?: ClassNameValue;
}

export function UserNav({ styles, }: Props) {
  const user = useAppSelector(
    (state) => state.auth.user
  );

  const onClickSignOut = useCallback(
    () => {
      supabase.auth.signOut()
        .then(() => {
          toast.success('로그아웃 되었습니다.');
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
