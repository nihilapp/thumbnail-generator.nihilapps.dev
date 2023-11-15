'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { ClassNameValue, twJoin } from 'tailwind-merge';
import createClient from '@/src/utils/supabase/client';
import { api } from '@/src/utils/axios';

interface Props {
  styles?: ClassNameValue;
}

export function SupaBaseTest({ styles, }: Props) {
  const [ supabase, ] = useState(() => createClient());

  const signUp = useCallback(
    () => {
      supabase.auth.signUp({
        email: 'nihil_ncunia@naver.com',
        password: '123456789!',
      });
    },
    []
  );

  const getSession = useCallback(
    async () => {
      const { data, } = await api.get(`${window.location.origin}/api`);

      console.log(data);
    },
    []
  );

  const login = useCallback(
    () => {
      supabase.auth.signInWithPassword({
        email: 'nihil_ncunia@naver.com',
        password: '123456789!',
      });
    },
    []
  );

  const githubLogin = useCallback(
    () => {
      supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: 'http://localhost:3000/',
        },
      }).then((response) => {
        console.log(response);

        console.log('깃허브 로그인 완료');
      });
    },
    []
  );

  const signOut = useCallback(
    () => {
      supabase.auth.signOut().then((response) => {
        console.log(response);

        console.log('로그아웃 완료');
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
      <button onClick={signUp}>회원가입</button><br />
      <button onClick={getSession}>로그인 여부</button><br />
      <button onClick={login}>로그인</button><br />

      <button onClick={githubLogin}>깃허브 로그인</button>
      <button onClick={signOut}>로그아웃</button>
    </>
  );
}
