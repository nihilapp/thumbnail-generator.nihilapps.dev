import React from 'react';
import { Metadata } from 'next';
import { setMeta } from '@/src/hooks/setMeta';
import { twJoin } from 'tailwind-merge';
import Link from 'next/link';

export const metadata: Metadata = setMeta({
  title: '페이지를 찾을 수 없습니다',
});

export default function NotFoundPage() {
  const style = {
    default: twJoin([
      ``,
    ]),
  };

  return (
    <>
      <div className={style.default}>
        <h2>페이지를 찾을 수 없습니다.</h2>
        <Link href='/'>홈으로 돌아가기</Link>
      </div>
    </>
  );
}
