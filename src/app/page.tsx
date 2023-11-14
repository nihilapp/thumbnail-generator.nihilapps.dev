import React from 'react';
import { Metadata } from 'next';
import { setMeta } from '../hooks/setMeta';
import { WordChange } from '../components/Content/Home';

export const metadata: Metadata = setMeta({
  title: '홈',
  url: '/',
});

export default function IndexPage() {
  return (
    <>
      <WordChange />
    </>
  );
}
