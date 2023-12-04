'use client';

import { Nihil } from '@/src/utils/nihil';
import { supabase } from '@/src/utils/supabase/client';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { ClassNameValue, twJoin } from 'tailwind-merge';
import Link from 'next/link';
import { Tables } from '@/src/types/supabase.types';
import { IThumbnails } from '@/src/types/entity.types';
import { Heading } from '@/src/components/Base';

interface Props {
  styles?: ClassNameValue;
}

export function MyThumbnails({ styles, }: Props) {
  const [ thumbnails, setThumbnails, ] = useState<IThumbnails[]>([]);

  useEffect(() => {
    const getThmubnails = async () => {
      return supabase.from('thumbnails').select();
    };

    getThmubnails().then((thumbnails) => {
      setThumbnails(thumbnails.data);
    });
  }, []);

  const css = {
    default: twJoin([
      ``,
      styles,
    ]),
    itemList: twJoin([
      `flex flex-wrap gap-4`,
    ]),
    item: twJoin([
      `border border-black-200 p-2 w-[calc(33.33%-(32px/3))] shrink-0 `,
    ]),
    itemImage: twJoin([
      ``,
    ]),
    title: twJoin([
      ``,
    ]),
    subTitle: twJoin([
      ``,
    ]),
  };

  return (
    <>
      <div className={css.default}>
        <Heading level='h2'>내 썸네일 목록</Heading>

        <div className={css.itemList}>
          {thumbnails.map((thumbnail) => (
            <div key={Nihil.uuid(0)} className={css.item}>
              <Image
                src={thumbnail.image_link}
                alt={thumbnail.title}
                width={1280}
                height={720}
                className={css.itemImage}
                priority
              />
              <div className=''>
                <h3 className={css.title}>{thumbnail.title}</h3>
                {thumbnail.sub_title && (
                  <p className={css.subTitle}>{thumbnail.sub_title}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
