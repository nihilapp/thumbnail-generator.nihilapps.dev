'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { ClassNameValue, twJoin } from 'tailwind-merge';
import { supabase } from '@/src/utils/supabase/client';
import { useAppDispatch } from '@/src/hooks/rtk';
import { setSession, setUser } from '@/src/reducers';

interface Props {
  styles?: ClassNameValue
}

export function NavBlock({ styles, }: Props) {
  const dispatch = useAppDispatch();
  const nowDate = new Date().getTime();

  useEffect(() => {
    const refresh = async () => {
      const { data: sessionData, } = await supabase.auth.getSession();
      const { data: userData, } = await supabase.auth.getUser();

      console.log('userData >> ', userData);
      console.log('sessionData >> ', sessionData);

      if (userData.user) {
        const expDate = new Date(sessionData.session.expires_at * 1000).getTime();

        console.log('nowDate >> ', nowDate, new Date(nowDate));
        console.log('expDate >> ', expDate, new Date(expDate));

        const diff = expDate - nowDate;
        console.log('만료까지 남은 시간 >> ', diff);

        if (diff < 150000) {
          console.log('세션이 오래되었습니다.');
          supabase.auth.refreshSession({
            refresh_token: sessionData.session.refresh_token,
          }).then((response) => {
            console.log('refresh 결과 >> ', response);
          });
        } else {
          console.log('올바른 세션입니다.');
        }
      }
    };

    refresh();
  }, [ nowDate, ]);

  useEffect(() => {
    const { data, } = supabase.auth.onAuthStateChange(
      (event, session) => {
        switch (event) {
          case 'SIGNED_IN':
            dispatch(setUser(session?.user));
            dispatch(setSession(session));
            break;
          case 'SIGNED_OUT':
            dispatch(setUser(null));
            dispatch(setSession(null));
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
      </nav>
    </>
  );
}
