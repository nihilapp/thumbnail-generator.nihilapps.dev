'use client';

import React, { useCallback, useEffect } from 'react';
import Link from 'next/link';
import { ClassNameValue, twJoin } from 'tailwind-merge';
import { supabase } from '@/src/utils/supabase/client';
import { useAppDispatch, useAppSelector } from '@/src/hooks/rtk';
import { setUser } from '@/src/reducers/auth.reducer';
import { toast } from 'react-toastify';

interface Props {
  styles?: ClassNameValue
}

export function Nav({ styles, }: Props) {
  const user = useAppSelector(
    (state) => state.auth.user
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    const { data, } = supabase.auth.onAuthStateChange(
      (event, session) => {
        switch (event) {
          case 'SIGNED_IN':
            dispatch(setUser(session?.user));
            break;
          case 'SIGNED_OUT':
            dispatch(setUser(null));
            break;
          default:
            break;
        }
      }
    );

    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

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
        <Link href='/'>홈</Link>
        <Link href='/generate'>생성</Link>
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
