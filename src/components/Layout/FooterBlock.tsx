'use client';

import React, { useCallback, useMemo, useState } from 'react';
import { ClassNameValue, twJoin } from 'tailwind-merge';
import { OuterLink } from '@/src/components/Common';
import { Icon } from '@iconify/react';
import Image from 'next/image';
import nihilAppsLogo from '@/src/images/nihilapps-logo-w.png';
import nihilAppsLogoB from '@/src/images/nihilapps-logo.png';

interface Props {
  styles?: ClassNameValue;
}

export function FooterBlock({ styles, }: Props) {
  const [ isHover, setIsHover, ] = useState(false);
  const year = useMemo(() => {
    const startYear = 2023;
    const nowYear = new Date().getFullYear();

    return startYear < nowYear
      ? `${startYear}-${nowYear}`
      : startYear;
  }, []);

  const onMouseEnter = useCallback(
    () => {
      setIsHover(true);
    },
    []
  );

  const onMouseLeave = useCallback(
    () => {
      setIsHover(false);
    },
    []
  );

  const css = {
    default: twJoin([
      `bg-black-700 p-2 py-4 text-white flex flex-col gap-2 mt-[50px]`,
      styles,
    ]),
    links: twJoin([
      `flex flex-row gap-2 items-center justify-center`,
    ]),
    copy: twJoin([
      `flex flex-row gap-1 items-center justify-center text-[1rem]`,
    ]),
  };

  return (
    <>
      <footer className={css.default}>
        <div className={css.links}>
          <OuterLink href='mailto:nihil_ncunia@naver.com,anikai7556@gmail.com'>
            <Icon icon='mdi:email' />
          </OuterLink>
          <OuterLink href='https://www.instagram.com/nihil_illust/'>
            <Icon icon='fa6-brands:instagram' />
          </OuterLink>
          <OuterLink href='https://github.com/NIHILncunia'>
            <Icon icon='fa6-brands:github' />
          </OuterLink>
          <a
            href='https://nihilapps.dev'
            target='_blank'
            rel='noopener noreferrer'
            className='w-[120px] h-[45px] ml-5 p-2 bg-black-500 hover:bg-white flex items-center justify-center'
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
          >
            <Image
              src={isHover ? nihilAppsLogoB.src : nihilAppsLogo.src}
              width={nihilAppsLogo.width}
              height={nihilAppsLogo.height}
              alt='니힐앱스로 이동'
              priority
            />
          </a>
        </div>
        <small className={css.copy}>
          <Icon icon='fa6-regular:copyright' /> {year}. NIHILncunia.
        </small>
      </footer>
    </>
  );
}
