import React from 'react';
import { Metadata } from 'next';
import { setMeta } from '@/src/hooks/setMeta';
import { twJoin } from 'tailwind-merge';

export const metadata: Metadata = setMeta({
  title: '페이지를 찾을 수 없습니다',
});

export default function NotFoundPage() {
  const css = {
    default: twJoin([
      `py-[250px]`,
    ]),
  };

  return (
    <>
      <div className={css.default}>
        <h2 className='font-900 text-h2 text-center mb-3'>페이지를 찾을 수 없습니다.</h2>
        <p className='text-red-600 font-900 text-center text-[3rem]'>404</p>
      </div>
    </>
  );
}
