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
