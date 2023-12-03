import React from 'react';
import { ClassNameValue, twJoin } from 'tailwind-merge';

interface Props {
  href: string;
  children: React.ReactNode;
  styles?: ClassNameValue;
}

export function OuterLink({ href, children, styles, }: Props) {
  const css = {
    default: twJoin([
      `p-2 bg-black-500 hover:bg-white hover:text-black-base text-[150%] w-[45px] aspect-square flex items-center justify-center`,
      styles,
    ]),
  };

  return (
    <>
      <a
        href={href}
        target='_blank'
        rel='noopener noreferrer'
        className={css.default}
      >
        {children}
      </a>
    </>
  );
}
