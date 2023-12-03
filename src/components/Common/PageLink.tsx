import React from 'react';
import { ClassNameValue, twJoin } from 'tailwind-merge';
import Link from 'next/link';
import { Icon } from '@iconify/react';

interface Props {
  href: string;
  as?: string;
  icon?: string;
  children: React.ReactNode;
  styles?: ClassNameValue;
}

export function PageLink({
  href, as, icon, children, styles,
}: Props) {
  const css = {
    default: twJoin([
      `p-2 px-4 flex flex-col items-center justify-center border-l border-b-0 border-t-0 border-black-200 hover:border-black-400 hover:bg-black-400 bg-white text-black-base hover:text-white asd w-[100px] font-500`,
      styles,
    ]),
  };

  return (
    <>
      <Link
        href={href}
        as={as}
        className={css.default}
      >
        {icon && (
          <Icon icon={icon} className='text-[1.5rem]' />
        )}
        {children}
      </Link>
    </>
  );
}
