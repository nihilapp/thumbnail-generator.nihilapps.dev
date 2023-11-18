'use client';

import { Color } from '@/src/reducers';
import { Nihil } from '@/src/utils/nihil';
import React from 'react';

interface Props {
  children: React.ReactNode;
  $bgType: 'color' | 'image';
  $textColor: Color;
  $bgColor: Color;
  $imgSrc: string;
  $imageY: number;
}

export function ImageFrame({
  children, $textColor, $bgType, $bgColor, $imageY, $imgSrc,
}: Props) {
  const style: React.CSSProperties = {
    width: 'inherit',
    height: 'inherit',
    position: 'relative',
    overflow: 'auto',
    color: Nihil.toRGBHex($textColor),
    backgroundColor: $bgType === 'color'
      ? Nihil.toRGBHex($bgColor)
      : '',
    backgroundImage: $bgType === 'image' && `url(${$imgSrc})`,
    backgroundSize: $bgType === 'image' && 'cover',
    backgroundPositionY: $bgType === 'image' && `${$imageY}px`,
  };
  return (
    <>
      <div style={style}>{children}</div>
    </>
  );
}
