'use client';

import React from 'react';
import { ClassNameValue, twJoin } from 'tailwind-merge';
import { Thumbnail } from './Thumbnail';
import { TextConfig } from './TextConfig';
import { BackgroundConfig } from './BackgroundConfig';

interface Props {
  styles?: ClassNameValue;
}

export function ThumbnailGenerator({ styles, }: Props) {
  const css = {
    button: twJoin([
      ``,
      styles,
    ]),
  };

  return (
    <>
      <div>
        <Thumbnail />
        <TextConfig />
        <BackgroundConfig />
      </div>
    </>
  );
}
