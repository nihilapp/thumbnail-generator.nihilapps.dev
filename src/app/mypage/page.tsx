import React from 'react';
import { Metadata } from 'next';
import { setMeta } from '@/src/hooks/setMeta';

export const metadata: Metadata = setMeta({
  title: '마이페이지',
  url: '/mypage',
});

export default function MyPage() {
  return (
    <>
      <div>content</div>
    </>
  );
}
