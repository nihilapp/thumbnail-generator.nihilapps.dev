'use client';

import React, { useCallback } from 'react';
import { ClassNameValue, twJoin } from 'tailwind-merge';
import { useAppDispatch, useAppSelector } from '@/src/hooks/rtk';
import { initState, setIsSettingSaved } from '@/src/reducers';
import { Thumbnail } from './Thumbnail';
import { TextConfig } from './TextConfig';
import { BackgroundConfig } from './BackgroundConfig';

interface Props {
  styles?: ClassNameValue;
}

export function ThumbnailGenerator({ styles, }: Props) {
  const { isSettingSaved, } = useAppSelector(
    (state) => state.common
  );

  const dispatch = useAppDispatch();

  const onClickReStart = useCallback(
    () => {
      dispatch(setIsSettingSaved(false));
      dispatch(initState());
    },
    []
  );

  const style = {
    default: twJoin([
      ``,
      styles,
    ]),
  };

  return (
    <>
      {isSettingSaved ? (
        <button onClick={onClickReStart}>새로 만들기</button>
      ) : (
        <div>
          <Thumbnail />
          <TextConfig />
          <BackgroundConfig />
        </div>
      )}
    </>
  );
}
