'use client';

import React from 'react';
import { ClassNameValue, twJoin } from 'tailwind-merge';

interface Props {
  styles?: ClassNameValue;
  children: React.ReactNode;
}

export function MainBlock({ styles, children, }: Props) {
  const css = {
    default: twJoin([
      `w-[1284px] mx-auto`,
      styles,
    ]),
  };

  return (
    <>
      <main className={css.default}>{children}</main>
    </>
  );
}
