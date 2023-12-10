'use client';

import React from 'react';
import { ClassNameValue, twJoin } from 'tailwind-merge';
import { BackgroundEdit } from '@/src/components/Content/MyPage/BackgroundEdit';
import { TextEdit } from '@/src/components/Content/MyPage/TextEdit';
import { EditThumbnailScreen } from '@/src/components/Content/MyPage/EditThumbnailScreen';

interface Props {
  id: string;
  styles?: ClassNameValue;
}

export function EditThumbnail({ id, styles, }: Props) {
  const css = {
    default: twJoin([
      ``,
      styles,
    ]),
  };

  return (
    <>
      <div className={css.default}>
        <EditThumbnailScreen id={id} />
        <TextEdit />
        <BackgroundEdit />
      </div>
    </>
  );
}
