import React from 'react';
import { ClassNameValue, twJoin } from 'tailwind-merge';

interface Props {
  styles?: ClassNameValue;
}

export function FooterBlock({ styles, }: Props) {
  const style = {
    default: twJoin([
      ``,
      styles,
    ]),
  };

  return (
    <>
      <footer className={style.default}>Footer</footer>
    </>
  );
}
