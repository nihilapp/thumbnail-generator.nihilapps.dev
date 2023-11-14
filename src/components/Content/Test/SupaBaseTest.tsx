'use client';

import React, { useCallback, useEffect } from 'react';
import { ClassNameValue, twJoin } from 'tailwind-merge';
import createClient from '@/src/utils/supabase/client';

interface Props {
  styles?: ClassNameValue;
}

export function SupaBaseTest({ styles, }: Props) {
  const test = async () => {
    const supabase = await createClient();

    await supabase.auth.signUp({
      email: 'nihil_ncunia@naver.com',
      password: '123456789!',
    }).then((response) => {
      const { data, } = response;
      console.log('data >> ', data);
    });
  };

  const getSession = useCallback(
    async () => {
      const supabase = await createClient();

      const session = await supabase.auth.getSession();

      console.log(session);
    },
    []
  );

  const login = useCallback(
    async () => {
      const supabase = await createClient();

      const { data, } = await supabase.auth.signInWithPassword({
        email: 'nihil_ncunia@naver.com',
        password: '123456789!',
      });

      console.log('data >> ', data);
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
      <button onClick={test}>회원가입</button>
      <button onClick={getSession}>로그인 여부</button>
      <button onClick={login}>로그인</button>
    </>
  );
}
