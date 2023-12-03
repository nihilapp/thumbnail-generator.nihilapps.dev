import React from 'react';
import { ClassNameValue, twJoin } from 'tailwind-merge';

interface Props {
  no?: number;
  level?: ('h2' | 'h3' | 'h4' | 'h5' | 'h6');
  children: React.ReactNode;
  styles?: ClassNameValue;
}

export function Heading({
  no, level: Level, children, styles,
}: Props) {
  const css = {
    default: twJoin([
      `font-900 flex flex-row leading-none mb-4`,
      Level === 'h2' && `text-h2`,
      Level === 'h3' && `text-h3`,
      Level === 'h4' && `text-h4`,
      Level === 'h5' && `text-h5`,
      Level === 'h6' && `text-h6`,
      styles,
    ]),
    no: twJoin([
      `p-3 px-2 pb-4 bg-blue-500 text-white`,
    ]),
    body: twJoin([
      `p-3 pb-4 flex-1 text-white bg-black-600`,
    ]),
  };

  return (
    <>
      <Level className={css.default}>
        {no && (
          <span className={css.no}>{no}.</span>
        )}
        <span className={css.body}>{children}</span>
      </Level>
    </>
  );
}
