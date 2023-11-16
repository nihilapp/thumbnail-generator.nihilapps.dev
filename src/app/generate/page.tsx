import React from 'react';
import { Metadata } from 'next';
import { setMeta } from '@/src/hooks/setMeta';

export const metadata: Metadata = setMeta({
  title: '생성',
  url: '/generate',
});

export default function GeneratePage() {
  return (
    <>
      <div>content</div>
    </>
  );
}
