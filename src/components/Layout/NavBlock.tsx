'use client';

import React, { useEffect, useState } from 'react';
import { ClassNameValue, twJoin } from 'tailwind-merge';
import { supabase } from '@/src/utils/supabase/client';
import { useAppDispatch } from '@/src/hooks/rtk';
import { setSession, setUser } from '@/src/reducers';
import { Auth } from '@/src/utils/auth';
import { toast } from 'react-toastify';
import { Nihil } from '@/src/utils/nihil';
import { usePathname } from 'next/navigation';
import { PageLink } from '@/src/components/Common';

interface Props {
  styles?: ClassNameValue
}

export function NavBlock({ styles, }: Props) {
  const [ number, setNumber, ] = useState(0);

  const dispatch = useAppDispatch();
  const pathName = usePathname();

  useEffect(() => {
    const { data, } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log(event);

        switch (event) {
          case 'INITIAL_SESSION':
          case 'SIGNED_IN': {
            if (session?.user) {
              let userName: string;

              if (!session.user.user_metadata.userName) {
                userName = session.user.user_metadata.name;
              } else {
                userName = session.user.user_metadata.userName;
              }

              supabase.auth.updateUser({
                data: {
                  provider_token: session.provider_token,
                  provider_refresh_token: session.provider_refresh_token,
                  exp: Nihil
                    .date(session.expires_at * 1000)
                    .format(),
                  userName,
                },
              }).then(({ data: { user, }, }) => {
                dispatch(setUser(user));

                const newSession = { ...session, };
                newSession.user = { ...user, };

                dispatch(setSession(newSession));

                console.log('user >> ', user);
                console.log('session >> ', newSession);

                console.log('[세션] 세션 정보 업데이트');
              });
            } else {
              dispatch(setUser(session?.user));
              dispatch(setSession(session));

              console.log('user >> ', session?.user);
              console.log('session >> ', session);

              console.log('[세션] 로그인');
            }
            return;
          }
          case 'SIGNED_OUT':
            dispatch(setUser(null));
            dispatch(setSession(null));
            console.log('[세션] 로그아웃');
            break;
          case 'USER_UPDATED': {
            if (!session.user) {
              return;
            }

            const refresh = async () => {
              Auth.expDiff().then(async (response) => {
                if (response) {
                  console.log('[세션] 세션의 만료까지 300초 남았습니다. 새로운 세션을 구성합니다.');

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

                  switch (session.user.app_metadata.provider) {
                    case 'google':
                      Auth.GoogleRefreshToken().then(async (response) => {
                        toast.success(response.message);

                        dispatch(setUser(response.newUser));

                        const newSession = { ...session, };
                        newSession.user = { ...response.newUser, };

                        dispatch(setSession(newSession));
                        console.log('[구글] 액세스 토큰 재발급');
                      });
                      break;
                    case 'github':
                      break;
                    default:
                      break;
                  }
                }
              });
            };

            await refresh();
            return;
          }
          default:
            break;
        }
      }
    );

    const interval = setInterval(() => {
      console.log(number);
      setNumber((prev) => prev + 1);
    }, 180000);

    return () => {
      data.subscription.unsubscribe();
      clearInterval(interval);
    };
  }, [ pathName, number, ]);

  const css = {
    default: twJoin([
      `flex flex-row`,
      styles,
    ]),
  };

  return (
    <>
      <nav className={css.default}>
        <PageLink href='/' as='/' icon='mdi:home'>홈</PageLink>
        <PageLink href='/generate' as='/generate' icon='mdi:file-image-plus'>생성하기</PageLink>
      </nav>
    </>
  );
}
