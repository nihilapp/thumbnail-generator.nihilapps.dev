import React from 'react';
import { ClassNameValue, twJoin } from 'tailwind-merge';

interface Props {
  styles?: ClassNameValue;
  children: React.ReactNode;
}

export function Main({ styles, children, }: Props) {
  const style = {
    default: twJoin([
      `w-[1280px] mx-auto`,
      styles,
    ]),
  };

  return (
    <>
      <main className={style.default}>{children}</main>
    </>
  );
}
