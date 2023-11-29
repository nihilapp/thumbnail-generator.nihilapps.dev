'use client';

import { useAppDispatch, useAppSelector } from '@/src/hooks/rtk';
import {
  initState, setImageFileSrc, setIsSettingSaved, setIsShowPicker
} from '@/src/reducers';
import React, {
  useCallback, useEffect, useMemo, useRef, useState
} from 'react';
import { twJoin } from 'tailwind-merge';
import { toBlob, toCanvas, toPng } from 'html-to-image';
import { Icon } from '@iconify/react';
import { Nihil } from '@/src/utils/nihil';
import Image from 'next/image';
import DefaultImage from '@/src/images/defaultImage.png';
import { supabase } from '@/src/utils/supabase/client';
import { toast } from 'react-toastify';
import { GoogleDrivePicker } from '../../Common';

export function Thumbnail() {
  const [ randomId, ] = useState(() => Nihil.uuid(0));
  const [ isClick, setIsClick, ] = useState(false);
  const [ isLoading, setIsLoading, ] = useState(false);
  const [ imageSrc, setImageSrc, ] = useState(() => DefaultImage.src);
  const [ isSave, setIsSave, ] = useState(false);
  const [ imagePath, setImagePath, ] = useState('');

  const thRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();

  const {
    title, subTitle, bgType, imgSrc, bgColor, textColor, imageY,
  } = useAppSelector(
    (state) => state.thumbnail
  );

  const { user, session, } = useAppSelector(
    (state) => state.auth
  );

  const { isShowPicker, } = useAppSelector(
    (state) => state.common
  );

  const userProviders = useMemo(() => {
    if (user) {
      return user.identities.map((item) => item.provider);
    } else {
      return [];
    }
  }, []);

  useEffect(() => {
    onClickReset();

    return () => {
      onClickReset();
    };
  }, [ randomId, ]);

  useEffect(() => {
    if (isLoading) {
      toCanvas(thRef.current, {
        includeQueryParams: true,
        backgroundColor: `rgb(${bgColor.red}, ${bgColor.green}, ${bgColor.blue})`,
        cacheBust: true,
        type: 'image/png',
      }).then((canvas) => {
        setImageSrc(canvas.toDataURL());
        canvas.toBlob((blob) => {
          const file = new File([ blob, ], 'image.png', {
            type: 'image/png',
          });

          const folder = user.id;
          const nowDate = Nihil.date().format();

          supabase.storage.from('thumbnails').upload(
            `${folder}/${nowDate}.png`,
            file,
            {
              contentType: 'image/png',
            }
          ).then(async (response) => {
            const fileUrl = supabase.storage
              .from('thumbnails')
              .getPublicUrl(response.data.path);

            const settingSave = await supabase.from('thumbnails').insert({
              title,
              subTitle,
              usersId: user.id,
              textRed: textColor.red,
              textGreen: textColor.green,
              textBlue: textColor.blue,
              bgRed: bgColor.red,
              bgGreen: bgColor.green,
              bgBlue: bgColor.blue,
              imageSrc: imgSrc,
              imagePosition: imageY,
              imageLink: fileUrl.data.publicUrl,
            });

            if (!settingSave.error) {
              toast.success('설정이 저장되었습니다.');
            } else {
              toast.error('설정이 저장되지 않았습니다.');
            }

            setImagePath(response.data.path);
            setIsLoading(false);
            toast.success('썸네일 이미지가 생성되었습니다.');
          });
        });
      });
    }
  }, [ isLoading, title, subTitle, thRef, bgColor, user, textColor, imgSrc, imageY, ]);

  const onClickReset = useCallback(
    () => {
      dispatch(initState());
      setIsClick(false);
      setIsLoading(false);
      setIsSave(false);
      setImageSrc(DefaultImage.src);
    },
    [ DefaultImage, ]
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

      if (!user) {
        console.log('로그인 안했을 경우');
        dispatch(setIsSettingSaved(true));
      } else {
        setIsSave(true);
      }
    },
    [ imageSrc, title, user, ]
  );

  const onClickGenerate = useCallback(
    () => {
      console.log('이미지 생성을 시작합니다.');
      setIsLoading(true);
      setIsClick(true);
    },
    []
  );

  const onClickClose = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      const target = event.target as HTMLElement;

      if (target.tagName === 'BUTTON' && target.id === 'close-button') {
        setIsClick(false);
        setImageSrc(DefaultImage.src);
        setIsSave(false);
        dispatch(initState());
      }
    },
    [ DefaultImage, ]
  );

  const onClickShowPicker = useCallback(
    () => {
      dispatch(setIsShowPicker(true));
    },
    []
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
      !isSave && 'disabled:bg-black-300 disabled:text-black-500 cursor-not-allowed',
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
      {/* 열기 버튼을 클릭하면 피커가 로드되게 구성 */}
      {/* 피커가 로드되면 구글 드라이브에 있는 최상위 폴더들을 리스팅해줌. */}
      {/* 최대 50개를 가져오고 더 있다면 추가로 가져옴. */}
      {/* 폴더는 5열로 보여짐. */}
      {/* 폴더를 클릭하면 그 폴더에 이미지 파일을 업로드 할 수 있음. */}
      {/* 새로운 폴더를 만들 수도 있음. */}
      {/* 오로지 최상위 폴더만 보임. */}
      {isShowPicker && (
        <>
          <GoogleDrivePicker />
        </>
      )}

      {isClick && (
        <div className={style.image} ref={imageRef}>
          <Image
            src={imageSrc}
            alt='다운로드 이미지'
            width={1280}
            height={720}
            className='block'
          />

          <div className='flex flex-row gap-2 w-[1280px]'>
            {/* {user && userProviders.includes('google') && (
              <button
                onClick={onClickShowPicker}
                className='p-2 flex-1 block shrink-0 bg-blue-500 hover:bg-blue-700 text-white text-[1.5rem]'
              >
                드라이브에 업로드
              </button>
            )} */}

            <button
              onClick={getImageFile}
              className='block flex-1 shrink-0 p-2 bg-blue-500 hover:bg-blue-700 text-white text-[1.5rem]'
            >
              다운로드
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
          <Icon icon='mingcute:loading-fill' className='animate-spin text-[3rem] inline-block' /> 설정에 따라 40초 혹은 그 이상의 시간이 소요될 수 있습니다.
        </div>
      )}

      <div className={style.buttons}>
        <button onClick={onClickReset} className={style.button}>초기화</button>
        <button onClick={onClickGenerate} className={style.button}>
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
