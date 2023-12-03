'use client';

import { Nihil } from '@/src/utils/nihil';
import { supabase } from '@/src/utils/supabase/client';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { ClassNameValue, twJoin } from 'tailwind-merge';
import Link from 'next/link';

interface Props {
  styles?: ClassNameValue;
}

export function MyThumbnails({ styles, }: Props) {
  const [ thumbnails, setThumbnails, ] = useState([]);

  useEffect(() => {
    const getThmubnails = async () => {
      const thumbnails = await supabase.from('thumbnails').select();

      setThumbnails(thumbnails.data);
    };

    getThmubnails();
  }, []);

  const css = {
    default: twJoin([
      ``,
      styles,
    ]),
  };

  return (
    <>
      <div className={css.default}>
        {thumbnails.map((thumbnail) => (
          <div key={Nihil.uuid(0)}>
            <Link href={`/thumbnails/${thumbnail.id}`}>{thumbnail.title}</Link>
          </div>
        ))}
      </div>
      {/*<div>*/}
      {/*  {thumbnails.map((thumbnail) => (*/}
      {/*    <div key={Nihil.uuid(0)}>*/}
      {/*      <Image*/}
      {/*        src={thumbnail.imageLink}*/}
      {/*        alt={thumbnail.title}*/}
      {/*        width={1280}*/}
      {/*        height={720}*/}
      {/*        className='w-[300px] h-auto'*/}
      {/*        priority*/}
      {/*      />*/}
      {/*    </div>*/}
      {/*  ))}*/}
      {/*</div>*/}
    </>
  );
}
