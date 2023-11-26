import React from 'react';
import { Metadata } from 'next';
import { setMeta } from '@/src/hooks/setMeta';
import { CodeRedirect } from '@/src/components/Content/auth';

export const metadata: Metadata = setMeta({
  title: 'get code',
  url: '/auth/redirect',
});

export default function page() {
  return (
    <>
      <CodeRedirect />
    </>
  );
}
