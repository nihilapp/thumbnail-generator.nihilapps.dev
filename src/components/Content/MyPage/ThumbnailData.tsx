'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { ClassNameValue, twJoin } from 'tailwind-merge';
import { supabase } from '@/src/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { setMessage, setMessageShown, setMessageType } from '@/src/store/common.store';
import Image from 'next/image';
import { Heading } from '@/src/components/Base';
import { IThumbnails } from '@/src/types/entity.types';
import { Nihil } from '@/src/utils/nihil';
import { authStore } from '@/src/store/auth.store';
import { thumbnailStore } from '@/src/store/thumbnail.store';

interface Props {
  id: string;
  styles?: ClassNameValue;
}

export function ThumbnailData({ id, styles, }: Props) {
  const [ thumbnail, setThumbnail, ] = useState<IThumbnails>(null);
  const { user, } = authStore();

  const router = useRouter();

  useEffect(() => {
    const getThumbnailById = async () => {
      try {
        const { data: [ thumbnail, ], } = await supabase
          .from('thumbnails').select().eq('id', id);

        setThumbnail(thumbnail);
        thumbnailStore.setState({
          width: thumbnail.width,
          height: thumbnail.height,
          title: thumbnail.title,
          subTitle: thumbnail.sub_title,
          textRed: thumbnail.text_red.toString(),
          textGreen: thumbnail.text_green.toString(),
          textBlue: thumbnail.text_blue.toString(),
          bgRed: thumbnail.bg_red.toString(),
          bgGreen: thumbnail.bg_green.toString(),
          bgBlue: thumbnail.bg_blue.toString(),
          bgType: thumbnail.bg_src ? 'image' : 'color',
          imageY: thumbnail.bg_position,
          imgSrc: thumbnail.bg_src,
          imagePath: thumbnail.image_path,
        });
      } catch (error) {
        setMessageType('error');
        setMessage(error.message);
        setMessageShown(false);

        router.push('/');
      }
    };

    getThumbnailById();
  }, []);

  const onClickUpload = useCallback(
    () => {
      router.push(`/thumbnails/${thumbnail.id}/upload`);
    },
    [ thumbnail, ]
  );

  const onClickEdit = useCallback(
    () => {
      router.push(`/thumbnails/${thumbnail.id}/edit`);
    },
    [ thumbnail, ]
  );

  const onClickDelete = useCallback(
    async (id: string, path: string) => {
      await supabase
        .from('thumbnails')
        .delete()
        .eq('id', id);

      await supabase.storage
        .from('thumbnails')
        .remove([ path, ]);

      router.push('/mypage');
    },
    []
  );

  const css = {
    default: twJoin([
      ``,
      styles,
    ]),
    buttons: twJoin([
      `flex gap-5 mb-5`,
    ]),
    blueButton: twJoin([
      `flex-1 flex items-center justify-center bg-blue-400 hover:bg-blue-600 text-white p-2 text-[1.1rem] font-500`,
    ]),
    redButton: twJoin([
      `flex-1 flex items-center justify-center bg-red-400 hover:bg-red-600 text-white p-2 text-[1.1rem] font-500`,
    ]),
    propBlock: twJoin([
      `mb-1 flex flex-row gap-2 items-start`,
    ]),
    label: twJoin([
      `text-[1.2rem] font-900 mb-1 text-black-base py-1 px-2 bg-black-100`,
    ]),
    content: twJoin([
      `text-[1.1rem] font-500 text-black-base py-1 px-2`,
    ]),
  };

  return (
    <>
      <div className={css.default}>
        {!thumbnail && (
          ''
        )}
        {thumbnail && (
          <>
            <Heading level='h2'>썸네일 관리</Heading>
            <div className={css.buttons}>
              {user?.app_metadata.provider === 'google' && (
                <button className={css.blueButton} onClick={onClickUpload}>
                  드라이브에 업로드
                </button>
              )}
              <button
                className={css.blueButton}
                onClick={onClickEdit}
              >
                수정하기
              </button>
              <button
                className={css.redButton}
                onClick={() => onClickDelete(thumbnail.id, thumbnail.image_path)}
              >
                삭제
              </button>
            </div>
            <div className='flex gap-5'>
              <div className='flex-1'>
                <Heading level='h3' styles='text-h6'>썸네일 미리보기</Heading>
                <Image
                  src={thumbnail.image_link}
                  alt='썸네일 이미지'
                  width={1280}
                  height={720}
                  priority
                  className='w-full border border-black-400'
                />
              </div>
              <form className='flex-1 flex flex-col gap-2'>
                <div>
                  <Heading level='h3' styles='text-h6'>해상도 설정</Heading>
                  <div className={css.propBlock}>
                    <p className={css.label}>너비</p>
                    <p className={css.content}>{thumbnail.width}</p>
                  </div>
                  <div className={css.propBlock}>
                    <p className={css.label}>높이</p>
                    <p className={css.content}>{thumbnail.height}</p>
                  </div>
                </div>
                <div>
                  <Heading level='h3' styles='text-h6'>텍스트 설정</Heading>
                  <div className={css.propBlock}>
                    <p className={css.label}>제목</p>
                    <p className={css.content}>{thumbnail.title}</p>
                  </div>
                  <div className={css.propBlock}>
                    <p className={css.label}>부제목</p>
                    <p className={css.content}>{thumbnail.sub_title || '-'}</p>
                  </div>
                  <div className={css.propBlock}>
                    <p className={css.label}>텍스트 색상</p>
                    <p className={css.content}>
                      {Nihil.toRGBHex({
                        red: thumbnail.text_red.toString(),
                        green: thumbnail.text_green.toString(),
                        blue: thumbnail.text_blue.toString(),
                      }).toUpperCase()}
                      {' '}
                      {`(${thumbnail.text_red}, ${thumbnail.text_green}, ${thumbnail.text_blue})`}
                    </p>
                  </div>
                  {/*<TextInput id='title' label='제목' register={register('title')} />*/}
                  {/*<TextInput id='subTitle' label='부제목' register={register('subTitle')} />*/}
                </div>
                <div>
                  <Heading level='h3' styles='text-h6'>배경 설정</Heading>
                  <div className={css.propBlock}>
                    <p className={css.label}>배경 유형</p>
                    <p className={css.content}>{thumbnail.bg_src ? '이미지' : '단색'}</p>
                  </div>
                  {thumbnail.bg_src ? (
                    <div className={css.propBlock}>
                      <p className={css.label}>배경 이미지 주소</p>
                      <p className={css.content}>{thumbnail.bg_src || '-'}</p>
                    </div>
                  ) : (
                    <div className='flex flex-row items-start'>
                      <p className={css.label}>배경 색상</p>
                      <p className={css.content}>
                        {Nihil.toRGBHex({
                          red: thumbnail.bg_red.toString(),
                          green: thumbnail.bg_green.toString(),
                          blue: thumbnail.bg_blue.toString(),
                        }).toUpperCase()}
                        {' '}
                        {`(${thumbnail.bg_red}, ${thumbnail.bg_green}, ${thumbnail.bg_blue})`}
                      </p>
                    </div>
                  )}
                </div>
              </form>
            </div>
          </>
        )}
      </div>
    </>
  );
}
