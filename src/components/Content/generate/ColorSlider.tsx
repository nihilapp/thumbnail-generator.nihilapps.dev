'use client';

import React, { useMemo } from 'react';
import { useAppSelector } from '@/src/hooks/rtk';
import { twJoin } from 'tailwind-merge';
import { Nihil } from '@/src/utils/nihil';
import { SliderItem } from './SliderItem';

interface Props {
  align?: ('horizontal' | 'vertical');
  type?: ('text' | 'background');
}

export function ColorSlider({ align = 'vertical', type = 'background', }: Props) {
  const { textColor, bgColor, } = useAppSelector(
    (state) => state.thumbnail
  );

  const color = useMemo(() => {
    return type === 'text'
      ? textColor
      : bgColor;
  }, [ textColor, bgColor, ]);

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
          <SliderItem color={color.red} type={type} colors={color} colorType='red' />
          <SliderItem color={color.green} type={type} colors={color} colorType='green' />
          <SliderItem color={color.blue} type={type} colors={color} colorType='blue' />
        </div>
        <div className={css.colorView} style={{ backgroundColor: Nihil.toRGBHex(color), }} />
      </div>
    </>
  );
}
