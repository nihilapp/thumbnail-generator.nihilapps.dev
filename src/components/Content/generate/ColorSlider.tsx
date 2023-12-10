'use client';

import React, { useEffect, useMemo } from 'react';
import { twJoin } from 'tailwind-merge';
import { Nihil } from '@/src/utils/nihil';
import { setBgColor, setTextColor, thumbnailStore } from '@/src/store/thumbnail.store';
import type { Color } from '@/src/store/thumbnail.store';
import { usePathname } from 'next/navigation';
import { SliderItem } from './SliderItem';

interface Props {
  align?: ('horizontal' | 'vertical');
  type?: ('text' | 'background');
}

export function ColorSlider({ align = 'vertical', type = 'background', }: Props) {
  const {
    textRed, textGreen, textBlue, bgRed, bgGreen, bgBlue,
  } = thumbnailStore();
  const pathName = usePathname();

  useEffect(() => {
    if (pathName === '/generate') {
      setTextColor({
        red: '51',
        green: '51',
        blue: '51',
      });
      setBgColor({
        red: '255',
        green: '255',
        blue: '255',
      });
      // thumbnailStore.setState((state) => ({
      //   ...state,
      //   textRed: '51',
      //   textGreen: '51',
      //   textBlue: '51',
      //   bgRed: '255',
      //   bgGreen: '255',
      //   bgBlue: '255',
      // }));
    }

    return () => {
      setTextColor({
        red: '51',
        green: '51',
        blue: '51',
      });
      setBgColor({
        red: '255',
        green: '255',
        blue: '255',
      });
      // thumbnailStore.setState((state) => ({
      //   ...state,
      //   textRed: '51',
      //   textGreen: '51',
      //   textBlue: '51',
      //   bgRed: '255',
      //   bgGreen: '255',
      //   bgBlue: '255',
      // }));
    };
  }, [ thumbnailStore, pathName, ]);

  const textColors: Color = useMemo(() => {
    return {
      red: textRed,
      green: textGreen,
      blue: textBlue,
    };
  }, [ textRed, textGreen, textBlue, ]);

  const bgColors: Color = useMemo(() => {
    return {
      red: bgRed,
      green: bgGreen,
      blue: bgBlue,
    };
  }, [ bgRed, bgGreen, bgBlue, ]);

  const css = {
    container: twJoin([
      align === 'vertical' && 'flex w-full',
      align === 'horizontal' && `flex flex-col w-full`,
    ]),
    colorSliders: twJoin([
      align === 'vertical' && `flex flex-col justify-between flex-1 shrink-0`,
      align === 'horizontal' && 'order-2 flex flex-row',
    ]),
    colorView: twJoin([
      align === 'vertical' && `w-[150px] aspect-square border-2 border-[black]`,
      align === 'horizontal' && `w-full h-20 border-2 border-[black] order-1`,
    ]),
  };

  return (
    <>
      <div className={css.container}>
        <div className={css.colorSliders}>
          {type === 'text' ? (
            <>
              <SliderItem color={textRed} type={type} colors={textColors} colorType='red' />
              <SliderItem color={textGreen} type={type} colors={textColors} colorType='green' />
              <SliderItem color={textBlue} type={type} colors={textColors} colorType='blue' />
            </>
          ) : (
            <>
              <SliderItem color={bgRed} type={type} colors={bgColors} colorType='red' />
              <SliderItem color={bgGreen} type={type} colors={bgColors} colorType='green' />
              <SliderItem color={bgBlue} type={type} colors={bgColors} colorType='blue' />
            </>
          )}
        </div>
        <div
          className={css.colorView}
          style={{
            backgroundColor: Nihil.toRGBHex(
              type === 'text'
                ? textColors
                : bgColors
            ),
          }}
        />
      </div>
    </>
  );
}
