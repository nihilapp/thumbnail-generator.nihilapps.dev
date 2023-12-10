'use client';

import React from 'react';
import { ClassNameValue, twJoin } from 'tailwind-merge';
import { ResolutionConfig } from '@/src/components/Content/generate/ResolutionConfig';
import { BackgroundConfig } from '@/src/components/Content/generate/BackgroundConfig';
import { Thumbnail } from './Thumbnail';
import { TextConfig } from './TextConfig';

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
        {/*<ResolutionConfig />*/}
        <TextConfig />
        <BackgroundConfig />
      </div>
    </>
  );
}
