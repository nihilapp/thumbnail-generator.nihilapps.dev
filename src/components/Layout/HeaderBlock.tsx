'use client';

import React from 'react';
import { ClassNameValue, twJoin } from 'tailwind-merge';
import { configData } from '@/src/data';
import { NavBlock } from './NavBlock';
import { UserNav } from './UserNav';

interface Props {
  styles?: ClassNameValue;
}

export function HeaderBlock({ styles, }: Props) {
  const style = {
    default: twJoin([
      ``,
      styles,
    ]),
  };

  return (
    <>
      <header className={style.default}>
        <h1>{configData.title}</h1>

        <div>
          <NavBlock />
          <UserNav />
        </div>
      </header>
    </>
  );
}
