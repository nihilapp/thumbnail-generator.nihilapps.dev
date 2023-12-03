'use client';

import React from 'react';
import { ClassNameValue, twJoin } from 'tailwind-merge';
import { configData } from '@/src/data';
import logo from '@/src/images/thumbnail-generator-logo-w.png';
import Image from 'next/image';
import { PageLink } from '@/src/components/Common';
import { NavBlock } from './NavBlock';
import { UserNav } from './UserNav';

interface Props {
  styles?: ClassNameValue;
}

export function HeaderBlock({ styles, }: Props) {
  const css = {
    default: twJoin([
      `mb-[50px]`,
      styles,
    ]),
    title: twJoin([
      `p-3 py-4 bg-black-700`,
    ]),
    logo: twJoin([
      `w-[300px] h-auto`,
    ]),
    nav: twJoin([
      `flex flex-row justify-end border-b border-black-200 bg-black-100`,
    ]),
  };

  return (
    <>
      <header className={css.default}>
        <h1 className={css.title}>
          <PageLink
            href='/'
            styles={[
              `!bg-transparent border-none hover:bg-transparent !px-0 !w-[300px] !py-0`,
            ]}
          >
            <Image
              src={logo.src}
              width={logo.width}
              height={logo.height}
              alt={`${configData.title} 로고`}
              priority
              className={css.logo}
              aria-hidden
            />
            <span className='a11y-hidden'>니힐앱스 {configData.title}</span>
          </PageLink>
        </h1>

        <div className={css.nav}>
          <NavBlock />
          <UserNav />
        </div>
      </header>
    </>
  );
}
