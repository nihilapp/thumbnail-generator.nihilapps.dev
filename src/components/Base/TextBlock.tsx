import React from 'react';
import { ClassNameValue, twJoin } from 'tailwind-merge';

interface Props {
  children: React.ReactNode;
  styles?: ClassNameValue;
}

export function TextBlock({ children, styles, }: Props) {
  const css = {
    default: twJoin([
      `mt-4 text-justify text-[1.1rem] text-black-base font-500`,
      styles,
    ]),
  };

  return (
    <>
      <p className={css.default}>{children}</p>
    </>
  );
}
