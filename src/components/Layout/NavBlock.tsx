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

      if (userData.user) {
        const expDate = new Date(sessionData.session.expires_at * 1000).getTime();

        console.log('nowDate >> ', nowDate, new Date(nowDate));
        console.log('expDate >> ', expDate, new Date(expDate));

        const diff = expDate - nowDate;
        console.log('만료까지 남은 시간 >> ', diff);

        if (diff < 0) {
          console.log('세션이 만료되었습니다. 새로운 세션을 구성합니다.');
        } else if (diff <= 150000) {
          console.log('세션의 만료까지 150초 남았습니다. 새로운 세션을 구성합니다.');
        } else {
          console.log('올바른 세션입니다.');
        }

        if ((diff < 0) || (diff <= 150000)) {
          const { data, error, } = await supabase.auth.refreshSession({
            refresh_token: sessionData.session.refresh_token,
          });

          if (error) {
            console.error(error);
            return;
          }

          const { session: newSession, user: newUser, } = data;

          dispatch(setSession(newSession));
          dispatch(setUser(newUser));
        }
      }
    };

    refresh();
  }, [ nowDate, ]);

  useEffect(() => {
    const { data, } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log(event);

        switch (event) {
          case 'SIGNED_IN': {
            supabase.auth.updateUser({
              data: {
                provider_token: session.provider_token,
                provider_refresh_token: session.provider_refresh_token,
              },
            }).then(({ data: { user, }, }) => {
              dispatch(setUser(user));

              const newSession = { ...session, };
              newSession.user = { ...user, };
              dispatch(setSession(newSession));
            });

            return;
          }
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
