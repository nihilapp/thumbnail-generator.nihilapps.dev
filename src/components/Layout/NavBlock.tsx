'use client';

import React, { useEffect, useState } from 'react';
import { ClassNameValue, twJoin } from 'tailwind-merge';
import { supabase } from '@/src/utils/supabase/client';
import { Auth } from '@/src/utils/auth';
import { toast } from 'react-toastify';
import { Nihil } from '@/src/utils/nihil';
import { usePathname } from 'next/navigation';
import { PageLink } from '@/src/components/Common';
import {
  ProviderType, setProvider, setSession, setUser
} from '@/src/store/auth.store';

interface Props {
  styles?: ClassNameValue
}

export function NavBlock({ styles, }: Props) {
  const [ number, setNumber, ] = useState(0);

  const pathName = usePathname();

  useEffect(() => {
    const { data, } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        switch (event) {
          case 'INITIAL_SESSION':
          case 'SIGNED_IN': {
            if (session?.user === undefined) {
              console.log('[세션] 로그아웃 상태.');
            } else if (session?.user) {
              let userName: string;

              if (!session.user.user_metadata.userName) {
                userName = session.user.user_metadata.name;
              } else {
                userName = session.user.user_metadata.userName;
              }

              setUser(session?.user);
              setSession(session);
              setProvider(session?.user.app_metadata.provider as ProviderType);

              console.log('[세션] 로그인');

              if (session.user.app_metadata.provider === 'google') {
                supabase.auth.updateUser({
                  data: {
                    provider_token: session.provider_token,
                    provider_refresh_token: session.provider_refresh_token,
                    exp: Nihil.date(session.expires_at * 1000).format(),
                    userName,
                  },
                }).then(({ data: { user, }, }) => {
                  setUser(user);

                  const newSession = { ...session, };
                  newSession.user = { ...user, };

                  setSession(newSession);

                  console.log('[세션] 세션 정보 업데이트');
                });
              } else {
                supabase.auth.updateUser({
                  data: {
                    userName,
                  },
                }).then(({ data: { user, }, }) => {
                  setUser(user);

                  const newSession = { ...session, };
                  newSession.user = { ...user, };

                  setSession(newSession);

                  console.log('[세션] 세션 정보 업데이트');
                });
              }
            }
            return;
          }
          case 'SIGNED_OUT':
            setUser(null);
            setSession(null);
            setProvider('');
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

                  setSession(newSession);
                  setUser(newUser);

                  switch (session.user.app_metadata.provider) {
                    case 'google':
                      Auth.GoogleRefreshToken().then(async (response) => {
                        toast.success(response.message);

                        setUser(response.newUser);

                        const newSession = { ...session, };
                        newSession.user = { ...response.newUser, };

                        setSession(newSession);
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
