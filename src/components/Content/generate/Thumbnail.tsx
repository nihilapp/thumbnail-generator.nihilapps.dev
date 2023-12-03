'use client';

import { useAppDispatch, useAppSelector } from '@/src/hooks/rtk';
import {
  initState, setIsShowPicker
} from '@/src/reducers';
import React, {
  useCallback, useEffect, useMemo, useRef, useState
} from 'react';
import { twJoin } from 'tailwind-merge';
import { toCanvas } from 'html-to-image';
import { Icon } from '@iconify/react';
import { Nihil } from '@/src/utils/nihil';
import Image from 'next/image';
import DefaultImage from '@/src/images/defaultImage.png';
import { supabase } from '@/src/utils/supabase/client';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { GoogleDrivePicker } from '../../Common';

export function Thumbnail() {
  const [ randomId, ] = useState(() => Nihil.uuid(0));
  const [ isClick, setIsClick, ] = useState(false);
  const [ isLoading, setIsLoading, ] = useState(false);
  const [ imageSrc, setImageSrc, ] = useState(() => DefaultImage.src);
  const [ isSave, setIsSave, ] = useState(false);
  const [ imagePath, setImagePath, ] = useState('');
  const [ rowId, setRowId, ] = useState('');

  const thRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const router = useRouter();

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
          if (!user || !session) {
            setIsLoading(false);
            toast.success('썸네일 이미지가 생성되었습니다.');
            return;
          }

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
              user_id: user.id,
              text_red: textColor.red,
              text_green: textColor.green,
              text_blue: textColor.blue,
              bg_red: bgColor.red,
              bg_green: bgColor.green,
              bg_blue: bgColor.blue,
              bg_src: imgSrc,
              bg_position: imageY,
              image_link: fileUrl.data.publicUrl,
            }).select('id');

            if (settingSave.data) {
              setRowId(settingSave.data[0].id);
            }

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
      setRowId('');
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
        setRowId('');
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

  const onClickManage = useCallback(() => {
    router.push(`/thumbnails/${rowId}`);
  }, [ rowId, ]);

  const css = {
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
      {isShowPicker && (
        <>
          <GoogleDrivePicker />
        </>
      )}

      {isClick && (
        <div className={css.image} ref={imageRef}>
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
            {user && (
              <button
                onClick={onClickManage}
                className='block flex-1 shrink-0 p-2 bg-blue-500 hover:bg-blue-700 text-white text-[1.5rem]'
              >
                썸네일 관리
              </button>
            )}

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
        <div id='th-container' className={css.container} ref={thRef}>
          <div id='th-frame' style={css.frame}>
            <div id='th-titles' className={css.titles}>
              <h1 id='th-title' className={css.title}>
                {title.split('\\n').map((item, index) => (
                // eslint-disable-next-line react/no-array-index-key
                  <React.Fragment key={`${item}-${index}`}>{item}<br /></React.Fragment>
                ))}
              </h1>
              <h2 id='th-sub-title' className={css.subTitle}>{subTitle}</h2>
            </div>
            {bgType === 'image' && imgSrc && (
              <Image
                src={imgSrc}
                alt='이미지'
                width={1280}
                height={720}
                style={css.backImage}
                crossOrigin='anonymous'
              />
            )}
          </div>
        </div>
      </div>
      {isLoading && (
        <div className={css.message}>
          <Icon icon='mingcute:loading-fill' className='animate-spin text-[3rem] inline-block' /> 설정에 따라 40초 혹은 그 이상의 시간이 소요될 수 있습니다.
        </div>
      )}

      <div className={css.buttons}>
        <button onClick={onClickReset} className={css.button}>초기화</button>
        <button onClick={onClickGenerate} className={css.button}>
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
