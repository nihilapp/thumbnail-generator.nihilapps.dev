import React from 'react';
import { ClassNameValue, twJoin } from 'tailwind-merge';
import { configData } from '@/src/data';
import { Nav } from './Nav';
import { UserNav } from './UserNav';

interface Props {
  styles?: ClassNameValue;
}

export function Header({ styles, }: Props) {
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
          <Nav />
          <UserNav />
        </div>
      </header>
    </>
  );
}
