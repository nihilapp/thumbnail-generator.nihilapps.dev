import React from 'react';
import { Metadata } from 'next';
import { setMeta } from '@/src/hooks/setMeta';

export const metadata: Metadata = setMeta({
  title: '회원가입',
  url: '/signup',
});

export default function SignUpPage() {
  return (
    <>
      <div>content</div>
    </>
  );
}
