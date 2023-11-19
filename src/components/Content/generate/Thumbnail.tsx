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
import DefaultImage from '@/src/images/defaultImage.png';
import { supabase } from '@/src/utils/supabase/client';
import { toast } from 'react-toastify';

export function Thumbnail() {
  const [ isClick, setIsClick, ] = useState(false);
  const [ isLoading, setIsLoading, ] = useState(false);
  const [ imageSrc, setImageSrc, ] = useState(() => DefaultImage.src);
  const [ isSave, setIsSave, ] = useState(false);

  const thRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();

  const {
    title, subTitle, bgType, imgSrc, bgColor, textColor, imageY,
  } = useAppSelector(
    (state) => state.thumbnail
  );

  const { user, } = useAppSelector(
    (state) => state.auth
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
        setImageSrc(canvas.toDataURL('image/png'));
      }).then(() => {
        setIsLoading(false);
        console.log('이미지 생성이 완료되었습니다.');
      });
    }
  }, [ isLoading, ]);

  const onClickReset = useCallback(
    () => {
      dispatch(initState());
    },
    []
  );

  const saveThumbnail = useCallback(
    async () => {
      supabase.from('thumbnails').insert({
        title,
        sub_title: subTitle,
        user_id: user.id,
        color_red: textColor.red,
        color_green: textColor.green,
        color_blue: textColor.blue,
        bg_red: bgColor.red,
        bg_green: bgColor.green,
        bg_blue: bgColor.blue,
        bg_image: imgSrc,
        bg_position: imageY,
      }).then(() => {
        toast.success('설정이 저장되었습니다.');
        setIsSave(true);
      });
    },
    [ title, subTitle, textColor, bgColor, imgSrc, imageY, user, ]
  );

  const getImageFile = useCallback(
    () => {
      const link = document.createElement('a');
      link.download = title;
      link.href = imageSrc;
      link.style.position = 'absolute';
      link.style.left = '-50%';

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);
    },
    [ imageSrc, title, ]
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
    (event: React.MouseEvent<HTMLButtonElement | HTMLDivElement>) => {
      const target = event.target as HTMLElement;

      if ((target.tagName === 'BUTTON' && target.id === 'close-button') || target.tagName === 'DIV') {
        setIsClick(false);
        setImageSrc(DefaultImage.src);
        setIsSave(false);
      }
    },
    [ DefaultImage, ]
  );

  const style = {
    container: twJoin([
      `overflow-hidden w-[1280px] h-[720px]`,
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
      'fixed m-0 p-0 left-0 top-0 z-30 bg-black-base/80 w-screen h-screen flex flex-col gap-3 items-center justify-center',
    ]),
    closeButton: twJoin([
      `block flex-1 shrink-0 p-2 bg-blue-500 hover:bg-blue-700 text-white text-[1.5rem]`,
      isSave && 'disabled:bg-black-300 disabled:text-black-500 cursor-not-allowed',
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
        <div className={style.image} ref={imageRef} onClick={onClickClose}>
          <Image
            src={imageSrc}
            alt='다운로드 이미지'
            width={1280}
            height={720}
            className='block'
          />

          <div className='flex flex-row gap-2 w-[1280px]'>
            <button
              onClick={saveThumbnail}
              disabled={isSave}
              className={style.closeButton}
            >
              설정 저장
            </button>
            <button
              onClick={getImageFile}
              className='block flex-1 shrink-0 p-2 bg-blue-500 hover:bg-blue-700 text-white text-[1.5rem]'
            >
              이미지 파일 다운로드
            </button>
            <button
              id='close-button'
              onClick={onClickClose}
              className='block flex-1 shrink-0 bg-red-400 hover:bg-red-500 text-white text-[1.5rem] p-2'
            >
              닫기
            </button>
          </div>
        </div>
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
