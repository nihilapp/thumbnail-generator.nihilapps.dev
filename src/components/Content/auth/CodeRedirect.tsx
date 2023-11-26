'use client';

import { Nihil } from '@/src/utils/nihil';
import axios from 'axios';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react';
import { ClassNameValue, twJoin } from 'tailwind-merge';

interface Props {
  styles?: ClassNameValue;
}

export function CodeRedirect({ styles, }: Props) {
  const query = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    console.log(query.get('code'));

    const getToken = async () => {
      const { data, } = await axios.post('https://accounts.google.com/o/oauth2/token', {
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        client_secret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
        redirect_url: 'http://localhost:3000/auth/redirect',
        grant_type: 'authorization_code',
        code: query.get('code'),
      }, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });

      console.log(data);

      localStorage.setItem('tokens', Nihil.string(data));
      router.push('/');
    };

    getToken();
  }, []);

  const style = {
    default: twJoin([
      ``,
      styles,
    ]),
  };

  return (
    <>
      <h2>Get Code</h2>
    </>
  );
}
