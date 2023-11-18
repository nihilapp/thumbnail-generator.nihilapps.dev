import React from 'react';
import { Metadata } from 'next';
import { setMeta } from '@/src/hooks/setMeta';
import { CanvasTest } from '@/src/components/Content/test';

export const metadata: Metadata = setMeta({
  title: '테스트',
  url: '/test',
});

export default function TestPage() {
  return (
    <>
      <CanvasTest />
    </>
  );
}
