'use client';

import React, {
  ChangeEvent, useCallback, useState
} from 'react';
import { useAppDispatch, useAppSelector } from '@/src/hooks/rtk';
import { setBgType, setImg, setY as setImageY } from '@/src/reducers';
import { twJoin } from 'tailwind-merge';
import { ColorSlider } from './ColorSlider';

export function BackgroundConfig() {
  const [ srcValue, setSrcValue, ] = useState('');
  const [ y, setY, ] = useState(0);

  const { bgType, } = useAppSelector(
    (state) => state.thumbnail
  );
  const dispatch = useAppDispatch();

  const onClickColor = useCallback(
    () => {
      dispatch(setBgType('color'));
    },
    []
  );

  const onClickImage = useCallback(
    () => {
      dispatch(setBgType('image'));
      dispatch(setImg(''));
    },
    []
  );

  const onChangeSrc = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setSrcValue(event.target.value);
      dispatch(setImg(event.target.value));
    },
    []
  );

  const onChangeY = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setY(+event.target.value);
      dispatch(setImageY(+event.target.value));
    },
    []
  );

  const style = {
    colors: twJoin([
      `flex mt-10`,
    ]),
    bgTypeTab: (type: string) => {
      return twJoin([
        `p-3 flex-1 shrink-0 text-h2 font-black border-2 border-b-0`,
        bgType === type
          ? `bg-black-600 text-white border-black-600`
          : `bg-black-200 text-black-400 border-black-200`,
      ]);
    },
    tabBottom: twJoin([
      `flex flex-row gap-5 border-2 border-black-600 p-5 bg-white`,
    ]),
    inputBlock: twJoin([
      `flex flex-col gap-1 w-full`,
      ``,
    ]),
    label: twJoin([
      `font-semibold text-normal text-black-base`,
    ]),
    input: twJoin([
      `p-2 outline-none text-normal bg-black-100 text-black-base placeholder:text-black-300 border-b-[2px] border-transparent transition-colors duration-200`,
      `focus:border-blue-500`,
    ]),
  };

  return (
    <>
      <div className={style.colors}>
        <button
          className={style.bgTypeTab('color')}
          onClick={onClickColor}
        >
          단색 배경
        </button>
        <button
          className={style.bgTypeTab('image')}
          onClick={onClickImage}
        >
          이미지 배경
        </button>
      </div>

      {bgType === 'color' && (
        <div className={style.tabBottom}>
          <ColorSlider type='background' align='vertical' />
        </div>
      )}

      {bgType === 'image' && (
        <div className={style.tabBottom}>
          <label htmlFor='image-src' className={style.inputBlock}>
            <span className={style.label}>이미지 주소</span>
            <input
              type='text'
              id='image-src'
              placeholder='이미지 주소를 입력하세요'
              value={srcValue}
              onChange={onChangeSrc}
              className={style.input}
            />
          </label>

          <label htmlFor='image-y' className={style.inputBlock}>
            <span className={style.label}>Y좌표</span>
            <input
              type='text'
              id='image-y'
              placeholder='원하는 좌표를 입력하세요'
              value={y}
              onChange={onChangeY}
              className={style.input}
            />
          </label>
        </div>
      )}
    </>
  );
}
