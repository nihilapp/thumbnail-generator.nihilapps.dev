'use client';

import { useAppDispatch, useAppSelector } from '@/src/hooks/rtk';
import { setSubTitle, setTitle } from '@/src/reducers';
import React, { ChangeEvent, useCallback } from 'react';
import { twJoin } from 'tailwind-merge';
import { ColorSlider } from './ColorSlider';

export function TextConfig() {
  const { title, subTitle, } = useAppSelector(
    (state) => state.thumbnail
  );

  const dispatch = useAppDispatch();

  const onChangeTitle = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      dispatch(setTitle(event.target.value));
    },
    []
  );

  const onChangeSubTitle = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      dispatch(setSubTitle(event.target.value));
    },
    []
  );

  const css = {
    inputs: twJoin([
      `space-y-2 p-5 bg-white border-2 border-t-0 border-black-600`,
    ]),
    inputBlock: twJoin([
      `flex flex-col gap-1`,
    ]),
    input: twJoin([
      `p-2 outline-none text-normal bg-black-100 text-black-base placeholder:text-black-300 border-b-[2px] border-transparent transition-colors duration-200 focus:border-blue-500`,
    ]),
    label: twJoin([
      `font-semibold text-normal text-black-base`,
    ]),
    h2: twJoin([
      `text-h2 text-white font-black p-3 bg-black-600`,
    ]),
  };

  return (
    <>
      <h2 className={css.h2}>텍스트 설정</h2>
      <div className={css.inputs}>
        <label htmlFor='title' className={css.inputBlock}>
          <span className={css.label}>제목</span>
          <input
            type='text'
            id='title'
            placeholder='제목'
            autoComplete='off'
            value={title}
            onChange={onChangeTitle}
            className={css.input}
          />
        </label>
        <label htmlFor='sub-title' className={css.inputBlock}>
          <span className={css.label}>부제</span>
          <input
            type='text'
            id='sub-title'
            placeholder='부제'
            autoComplete='off'
            value={subTitle}
            onChange={onChangeSubTitle}
            className={css.input}
          />
        </label>
        <div>
          <span className={css.label}>색상</span>
          <ColorSlider type='text' />
        </div>
      </div>
    </>
  );
}
