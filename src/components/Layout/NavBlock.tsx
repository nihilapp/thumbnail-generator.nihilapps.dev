'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ClassNameValue, twJoin } from 'tailwind-merge';
import { supabase } from '@/src/utils/supabase/client';
import { useAppDispatch } from '@/src/hooks/rtk';
import { setSession, setUser } from '@/src/reducers';
import { Auth } from '@/src/utils/auth';
import { toast } from 'react-toastify';

interface Props {
  styles?: ClassNameValue
}

export function NavBlock({ styles, }: Props) {
  const dispatch = useAppDispatch();
  const [ number, setNumber, ] = useState(0);

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
          case 'USER_UPDATED': {
            if (!session.user) {
              return;
            }

            const expDate = new Date(session.expires_at * 1000).getTime();

            const diff = expDate - new Date().getTime();

            console.log(diff);

            const refresh = async () => {
              if ((diff < 0) || (diff <= 150000)) {
                switch (session.user.app_metadata.provider) {
                  case 'google':
                    Auth.GoogleRefreshToken(session.user.user_metadata.provider_refresh_token).then(async ({ data, }) => {
                      toast.success(data.message);

                      const newUser = await supabase.auth.updateUser({
                        data: {
                          provider_token: data.response.access_token,
                        },
                      });

                      dispatch(setUser(newUser.data.user));
                    });
                    break;
                  case 'github':
                    break;
                  default:
                    break;
                }
              }
            };

            const supabaseRefresh = async () => {
              if (session.user) {
                if (diff < 0) {
                  console.log('세션이 만료되었습니다. 새로운 세션을 구성합니다.');
                } else if (diff <= 150000) {
                  console.log('세션의 만료까지 150초 남았습니다. 새로운 세션을 구성합니다.');
                } else {
                  console.log('올바른 세션입니다.');
                }

                if ((diff < 0) || (diff <= 150000)) {
                  const { data, error, } = await supabase.auth.refreshSession({
                    refresh_token: session.refresh_token,
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
            supabaseRefresh();
            return;
          }
          default:
            break;
        }
      }
    );

    const interval = setInterval(() => {
      setNumber((prev) => prev + 1);
    }, 300000);

    return () => {
      data.subscription.unsubscribe();

      clearInterval(interval);
    };
  }, [ number, ]);

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
