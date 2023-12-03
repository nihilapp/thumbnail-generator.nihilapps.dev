import React from 'react';
import { Metadata } from 'next';
import { setMeta } from '@/src/hooks/setMeta';
import { ThumbnailGenerator } from '@/src/components/Content/generate';

export const metadata: Metadata = setMeta({
  title: '생성하기',
  url: '/generate',
});

export default function GeneratePage() {
  return (
    <>
      <ThumbnailGenerator />
    </>
  );
}
