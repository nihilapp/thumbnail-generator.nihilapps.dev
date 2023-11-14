import React from 'react';
import { Metadata } from 'next';
import { GetBoards } from '@/src/components/Content/Example';
import { setMeta } from '@/src/hooks/setMeta';

export const metadata: Metadata = setMeta({
  title: '예시',
  url: '/example',
});

export default function ExamplePage() {
  return (
    <>
      <GetBoards />
    </>
  );
}
