import React from 'react';
import { Metadata } from 'next';
import { setMeta } from '@/src/hooks/setMeta';
import { SupaBaseTest } from '@/src/components/Content/Test/SupaBaseTest';

export const metadata: Metadata = setMeta({
  title: '테스트',
  url: '/test',
});

export default function TestPage() {
  return (
    <>
      <SupaBaseTest />
    </>
  );
}
