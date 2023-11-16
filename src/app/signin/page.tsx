import React from 'react';
import { Metadata } from 'next';
import { setMeta } from '@/src/hooks/setMeta';
import { SignInForm } from '@/src/components/Content/signin';

export const metadata: Metadata = setMeta({
  title: '로그인',
  url: '/signin',
});

export default function SignInPage() {
  return (
    <>
      <SignInForm />
    </>
  );
}
