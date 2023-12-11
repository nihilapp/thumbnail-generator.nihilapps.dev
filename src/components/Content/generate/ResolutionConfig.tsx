'use client';

import React, { ChangeEvent, useCallback } from 'react';
import { ClassNameValue, twJoin } from 'tailwind-merge';
import { Heading } from '@/src/components/Base';
import { setHeight, setWidth, thumbnailStore } from '@/src/store/thumbnail.store';

interface Props {
  styles?: ClassNameValue;
}

export function ResolutionConfig({ styles, }: Props) {
  const { width, height, } = thumbnailStore();

  const onChangeWidth = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setWidth(+event.target.value);
    },
    []
  );

  const onChangeHeight = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setHeight(+event.target.value);
    },
    []
  );

  const css = {
    default: twJoin([
      `mb-10 space-y-2 p-5 bg-white border-2 border-black-600`,
      styles,
    ]),
    inputBlock: twJoin([
      `flex flex-col gap-1 text-[1.1rem]`,
    ]),
    input: twJoin([
      `p-3 outline-none text-normal bg-black-100 text-black-base placeholder:text-black-300 border-b-[3px] border-black-100 transition-colors duration-200 focus:border-blue-500 font-500 disabled:text-black-200 disabled:cursor-not-allowed`,
    ]),
    label: twJoin([
      `font-700 text-[1.2rem] text-black-base`,
    ]),
  };

  return (
    <>
      <Heading level='h2' styles='mb-0'>해상도 설정</Heading>
      <div className={css.default}>
        <label htmlFor='width' className={css.inputBlock}>
          <span className={css.label}>너비</span>
          <input
            type='text'
            id='width'
            placeholder='너비'
            autoComplete='off'
            value={width}
            onChange={onChangeWidth}
            className={css.input}
            disabled
          />
        </label>
        <label htmlFor='height' className={css.inputBlock}>
          <span className={css.label}>높이</span>
          <input
            type='text'
            id='height'
            placeholder='높이'
            autoComplete='off'
            value={height}
            onChange={onChangeHeight}
            className={css.input}
            disabled
          />
        </label>
      </div>
    </>
  );
}
