'use client';

import { Nihil } from '@/src/utils/nihil';
import { supabase } from '@/src/utils/supabase/client';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { ClassNameValue, twJoin } from 'tailwind-merge';
import { IThumbnails } from '@/src/types/entity.types';
import { Heading } from '@/src/components/Base';
import { authStore } from '@/src/store/auth.store';
import Link from 'next/link';

interface Props {
  styles?: ClassNameValue;
}

export function MyThumbnails({ styles, }: Props) {
  const [ thumbnails, setThumbnails, ] = useState<IThumbnails[]>([]);

  const { user, } = authStore();
  console.log('user >> ', user);

  useEffect(() => {
    if (user) {
      const getThumbnails = async () => {
        return supabase.from('thumbnails').select().eq('user_id', user.id);
      };

      getThumbnails().then((thumbnails) => {
        console.log(thumbnails);
        setThumbnails(thumbnails.data);
      });
    }
  }, [ user, ]);

  const css = {
    default: twJoin([
      ``,
      styles,
    ]),
    itemList: twJoin([
      `flex flex-wrap gap-4`,
    ]),
    item: twJoin([
      `border-2 border-black-700 w-[calc((100%-32px)/3)] shrink-0 flex flex-col`,
    ]),
    itemImage: twJoin([
      `mb-2 border-b-4 border-black-200`,
    ]),
    title: twJoin([
      `text-[1.3rem] font-900 flex flex-row gap-2 mb-1 mx-2 items-stretch`,
    ]),
    subTitle: twJoin([
      `flex flex-row gap-2 text-[1.1rem] font-500 mx-2 items-stretch`,
    ]),
    manageButton: twJoin([
      `p-2 block text-center m-2 py-3 bg-blue-400 hover:bg-blue-600 text-white text-[1.2rem]`,
    ]),
  };

  return (
    <>
      <div className={css.default}>
        <Heading level='h2'>내 썸네일 목록</Heading>

        <div className={css.itemList}>
          {thumbnails?.map((thumbnail) => (
            <div key={Nihil.uuid(0)} className={css.item}>
              <Image
                src={thumbnail.image_link}
                alt={thumbnail.title}
                width={1280}
                height={720}
                className={css.itemImage}
                priority
              />
              <div className='mb-4 flex-1'>
                <div className={css.title}>
                  <span className='basis-[70px] text-center p-1 px-2 bg-black-100 flex items-center justify-center'>제목</span>
                  <span className='flex-1'>{thumbnail.title}</span>
                </div>
                <div className={css.subTitle}>
                  <span className='basis-[70px] text-center flex items-center justify-center p-1 px-2 bg-black-100'>부제목</span>
                  <span className='flex-1'>
                    {thumbnail.sub_title ? (
                      thumbnail.sub_title
                    ) : (
                      '-'
                    )}
                  </span>
                </div>
              </div>
              <Link
                href={`/thumbnails/${thumbnail.id}`}
                className={css.manageButton}
              >
                관리
              </Link>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
