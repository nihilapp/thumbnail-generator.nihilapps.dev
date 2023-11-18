'use client';

import { useAppDispatch, useAppSelector } from '@/src/hooks/rtk';
import { initState } from '@/src/reducers';
import React, {
  useCallback, useEffect, useRef, useState
} from 'react';
import { twJoin } from 'tailwind-merge';
import { toCanvas } from 'html-to-image';
import { Icon } from '@iconify/react';
import { Nihil } from '@/src/utils/nihil';
import Image from 'next/image';

export function Thumbnail() {
  const [ isClick, setIsClick, ] = useState(false);
  const [ isLoading, setIsLoading, ] = useState(false);

  const thRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();

  const {
    title, subTitle, bgType, imgSrc, bgColor, textColor, imageY,
  } = useAppSelector(
    (state) => state.thumbnail
  );

  useEffect(() => {
    dispatch(initState());
  }, []);

  useEffect(() => {
    if (isLoading) {
      toCanvas(thRef.current, {
        includeQueryParams: true,
        backgroundColor: `rgb(${bgColor.red}, ${bgColor.green}, ${bgColor.blue})`,
        cacheBust: true,
        type: 'image/png',
      }).then((canvas) => {
        const img = document.createElement('img');
        // img.src = dataURL;
        img.src = canvas.toDataURL('image/png');
        img.style.display = 'block';

        imageRef.current.innerHTML = '';
        imageRef.current.appendChild(img);
      }).then(() => {
        setIsLoading(false);
        console.log('이미지 생성이 완료되었습니다.');
      });
    }
  }, [ isLoading, imageRef, ]);

  const onClickReset = useCallback(
    () => {
      dispatch(initState());
    },
    []
  );

  const onClickDownload = useCallback(
    () => {
      console.log('이미지 생성을 시작합니다.');
      setIsLoading(true);
      setIsClick(true);
    },
    []
  );

  const onClickClose = useCallback(
    () => {
      setIsClick(false);
    },
    []
  );

  const style = {
    container: twJoin([
      `mb-5 overflow-hidden w-[1280px] h-[720px]`,
    ]),
    titles: twJoin([
      `absolute z-20 top-[50%] translate-y-[-50%] left-[50%] translate-x-[-50%] text-center w-full`,
    ]),
    title: twJoin([
      `text-[4rem] font-black whitespace-pre-line`,
    ]),
    subTitle: twJoin([
      `text-[3rem] font-semibold`,
    ]),
    buttons: twJoin([
      `flex gap-5 mb-10`,
    ]),
    button: twJoin([
      `flex-1 flex items-center justify-center shrink-0 bg-blue-400 text-white p-3 hover:bg-blue-600 disabled:bg-black-300 disabled:cursor-not-allowed text-[1.2rem]`,
    ]),
    image: twJoin([
      `fixed m-0 p-0 left-0 top-0 z-30 bg-black-base/80 w-screen h-screen flex items-center justify-center`,
    ]),
    frame: {
      width: 'inherit',
      height: 'inherit',
      position: 'relative',
      overflow: 'hidden',
      color: Nihil.toRGBHex(textColor),
      backgroundColor: bgType === 'color'
        ? Nihil.toRGBHex(bgColor)
        : '',
    } as React.CSSProperties,
    backImage: {
      display: 'block',
      overflow: 'hidden',
      position: 'absolute',
      objectFit: 'cover',
      objectPosition: `0 ${imageY}px`,
    } as React.CSSProperties,
    message: twJoin([
      `fixed top-[50%] translate-y-[-50%] left-[50%] translate-x-[-50%] z-30 items-center justify-center text-[3rem] text-white`,
    ]),
  };

  return (
    <>
      {isClick && (
        <div className={style.image} ref={imageRef} onClick={onClickClose} />
      )}

      <div className='border-2 border-black-600 mb-5'>
        <div id='th-container' className={style.container} ref={thRef}>
          <div id='th-frame' style={style.frame}>
            <div id='th-titles' className={style.titles}>
              <h1 id='th-title' className={style.title}>
                {title.split('\\n').map((item, index) => (
                // eslint-disable-next-line react/no-array-index-key
                  <React.Fragment key={`${item}-${index}`}>{item}<br /></React.Fragment>
                ))}
              </h1>
              <h2 id='th-sub-title' className={style.subTitle}>{subTitle}</h2>
            </div>
            {bgType === 'image' && imgSrc && (
              <Image
                src={imgSrc}
                alt='이미지'
                width={1280}
                height={720}
                style={style.backImage}
                crossOrigin='anonymous'
              />
            )}
          </div>
        </div>
      </div>
      {isLoading && (
        <div className={style.message}>
          <Icon icon='mingcute:loading-fill' className='animate-spin text-[3rem] inline-block' /> 설정에 따라 40초 혹은 그 이상의 시간이 소요됩니다.
        </div>
      )}

      <div className={style.buttons}>
        <button onClick={onClickReset} className={style.button}>초기화</button>
        <button onClick={onClickDownload} className={style.button}>
          {isLoading ? (
            <Icon icon='mingcute:loading-fill' className='animate-spin' />
          ) : (
            '이미지로 저장'
          )}
        </button>
      </div>
    </>
  );
}
