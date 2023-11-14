import React from 'react';
import { ClassNameValue, twJoin } from 'tailwind-merge';
import { Nav } from './Nav';

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
        <Nav />
      </header>
    </>
  );
}
