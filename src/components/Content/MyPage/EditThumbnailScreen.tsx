'use client';

import React, {
  useCallback, useEffect, useRef, useState
} from 'react';
import { twJoin } from 'tailwind-merge';
import { toCanvas } from 'html-to-image';
import { Nihil } from '@/src/utils/nihil';
import Image from 'next/image';
import { supabase } from '@/src/utils/supabase/client';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import {
  initState, setBgColor, setImageFileSrc, setTextColor, thumbnailStore
} from '@/src/store/thumbnail.store';
import { authStore } from '@/src/store/auth.store';
import DefaultImage from '@/src/images/defaultImage.png';

interface Props {
  id: string;
}

export function EditThumbnailScreen({ id, }: Props) {
  const [ isClick, setIsClick, ] = useState(false);
  const [ isLoading, setIsLoading, ] = useState(false);
  const [ rowId, setRowId, ] = useState('');

  const thRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  const router = useRouter();

  const {
    title, subTitle, bgType, imgSrc, bgRed, bgGreen, bgBlue, imageY, textRed, textGreen, textBlue, imageFileSrc, width, height, imagePath, testInit,
  } = thumbnailStore();

  const { user, session, } = authStore();

  useEffect(() => {
    return () => {
      console.log('컴포넌트가 죽어요');
      thumbnailStore.persist.clearStorage();
      setIsClick(false);
      setIsLoading(false);
      setImageFileSrc(DefaultImage.src);
      setRowId('');
    };
  }, []);

  useEffect(() => {
    if (isLoading) {
      toCanvas(thRef.current, {
        includeQueryParams: true,
        backgroundColor: `rgb(${bgRed}, ${bgGreen}, ${bgBlue})`,
        cacheBust: true,
        type: 'image/png',
        skipFonts: true,
      }).then((canvas) => {
        setImageFileSrc(canvas.toDataURL());
        canvas.toBlob(async (blob) => {
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

          await supabase.storage.from('thumbnails').remove([
            imagePath,
          ]).then((response) => {
            console.log(response.data);
            console.log('기존의 썸네일 이미지가 삭제됩니다.');

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

              const updateThumbnail = await supabase
                .from('thumbnails')
                .update({
                  title,
                  sub_title: subTitle,
                  user_id: user.id,
                  text_red: +textRed,
                  text_green: +textGreen,
                  text_blue: +textBlue,
                  bg_red: +bgRed,
                  bg_green: +bgGreen,
                  bg_blue: +bgBlue,
                  bg_src: imgSrc,
                  bg_position: imageY,
                  image_link: fileUrl.data.publicUrl,
                  image_path: response.data.path,
                  width,
                  height,
                })
                .eq('id', id)
                .select('id');

              if (updateThumbnail.data) {
                setRowId(updateThumbnail.data[0].id);
              }

              if (!updateThumbnail.error) {
                toast.success('설정이 저장되었습니다.');
              } else {
                toast.error('설정이 저장되지 않았습니다.');
              }

              setIsLoading(false);
              toast.success('썸네일 이미지가 수정되었습니다.');
            });
          });
        });
      });
    }
  }, [ isLoading, title, subTitle, thRef, bgRed, bgGreen, bgBlue, user, textRed, textGreen, textBlue, imgSrc, imageY, imagePath, ]);

  const getImageFile = useCallback(
    () => {
      const link = document.createElement('a');
      link.download = `${title}.png`;
      link.href = imageFileSrc;
      link.style.position = 'absolute';
      link.style.left = '-50%';

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);
    },
    [ imageFileSrc, title, user, ]
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
        router.push(`/thumbnails/${id}`);
      }
    },
    []
  );

  const onClickManage = useCallback(() => {
    router.push(`/thumbnails/${rowId}`);
  }, [ rowId, ]);

  const onClickBack = useCallback(
    () => {
      router.back();
    },
    []
  );

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
      color: Nihil.toRGBHex({
        red: textRed,
        green: textGreen,
        blue: textBlue,
      }),
      backgroundColor: bgType === 'color'
        ? Nihil.toRGBHex({
          red: bgRed,
          green: bgGreen,
          blue: bgBlue,
        })
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
        <div className={css.image} ref={imageRef}>
          <Image
            src={imageFileSrc}
            alt='다운로드 이미지'
            width={1280}
            height={720}
            className='block'
          />

          <div className='flex flex-row gap-2 w-[1280px]'>
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

      <div className={css.buttons}>
        <button onClick={onClickBack} className={css.button}>
          뒤로가기
        </button>
        <button onClick={onClickGenerate} className={css.button}>
          썸네일 수정
        </button>
      </div>
    </>
  );
}
