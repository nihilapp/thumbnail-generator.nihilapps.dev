'use client';

import { useAppDispatch, useAppSelector } from '@/src/hooks/rtk';
import { initState } from '@/src/reducers';
import React, {
  useCallback, useEffect, useRef, useState
} from 'react';
import { twJoin } from 'tailwind-merge';
import { toCanvas, toPng } from 'html-to-image';
import { Icon } from '@iconify/react';
import html2canvas from 'html2canvas';
import { Nihil } from '@/src/utils/nihil';
import { ImageFrame } from './ImageFrame';

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

  // useEffect(() => {
  //   if (isLoading) {
  //     toCanvas(thRef.current, {
  //       includeQueryParams: true,
  //       backgroundColor: `rgb(${bgColor.red}, ${bgColor.green}, ${bgColor.blue})`,
  //       cacheBust: true,
  //       type: 'image/png',
  //     }).then((canvas) => {
  //       const img = document.createElement('img');
  //       // img.src = dataURL;
  //       img.src = canvas.toDataURL('image/png');
  //       img.style.display = 'block';

  //       imageRef.current.innerHTML = '';
  //       imageRef.current.appendChild(img);

  //       // console.log(response);
  //       // console.log('이미지 생성이 완료되었습니다.');
  //       setIsLoading(false);
  //     });
  //   }
  // }, [ isLoading, imageRef, ]);

  const onClickReset = useCallback(
    () => {
      dispatch(initState());
    },
    []
  );

  // const onClickDownload = useCallback(
  //   () => {
  //     console.log('이미지 생성을 시작합니다.');
  //     setIsLoading(true);
  //     setIsClick(true);
  //   },
  //   []
  // );

  const onClickDownload = useCallback(
    () => {
      const bodyWidth = document.documentElement.clientWidth;

      const thRefWidth = thRef.current.clientWidth;

      const headerElement = document.querySelector('body>header');
      const headerHeight = headerElement.clientHeight;

      let formula: number;

      if (thRefWidth < bodyWidth) {
        formula = (bodyWidth - thRefWidth) / 2;
      }

      window.scrollTo(0, 0);

      html2canvas(thRef.current, {
        allowTaint: true,
        useCORS: true,
        foreignObjectRendering: true,
        x: thRefWidth < bodyWidth ? -formula : 0,
        y: -headerHeight,
        backgroundColor: `rgb(${bgColor.red}, ${bgColor.green}, ${bgColor.blue})`,
        logging: true,
      }).then((canvas) => {
        const img = document.createElement('img');
        img.src = canvas.toDataURL('image/png');
        img.style.display = 'block';
        img.crossOrigin = 'anonymous';

        imageRef.current.innerHTML = '';
        imageRef.current.appendChild(img);
      });

      setIsClick(true);
    },
    [ thRef, ]
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
      `absolute top-[50%] translate-y-[-50%] left-[50%] translate-x-[-50%] text-center w-full`,
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
      `fixed m-0 p-0 left-0 top-0 z-10 bg-black-base/80 w-screen h-screen flex items-center justify-center`,
    ]),
    frame: {
      width: 'inherit',
      height: 'inherit',
      position: 'relative',
      overflow: 'auto',
      color: Nihil.toRGBHex(textColor),
      backgroundColor: bgType === 'color'
        ? Nihil.toRGBHex(bgColor)
        : '',
      backgroundImage: bgType === 'image' && `url(${imgSrc})`,
      backgroundSize: bgType === 'image' && 'cover',
      backgroundPositionY: bgType === 'image' && `${imageY}px`,
    } as React.CSSProperties,
  };

  return (
    <>
      {isClick && (
        <div className={style.image} ref={imageRef} onClick={onClickClose} />
        // <div className={style.image} ref={imageRef} onClick={onClickClose}>
        //   {isLoading ? (
        //     <Icon icon='mingcute:loading-fill' className='animate-spin text-white text-[4rem]' />
        //   ) : (
        //     ''
        //   )}
        // </div>
      )}

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
        </div>
      </div>

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
