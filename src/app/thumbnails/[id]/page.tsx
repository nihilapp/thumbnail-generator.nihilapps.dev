import React from 'react';
import { supabase } from '@/src/utils/supabase/client';
import { ThumbnailData } from '@/src/components/Content/MyPage';
import { setMeta } from '@/src/hooks/setMeta';

export async function generateStaticParams() {
  const { data, } = await supabase
    .from('thumbnails').select();

  return data.map((item) => ({
    id: item.id,
  }));
}

interface Props {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params, }: Props) {
  return setMeta({
    title: `썸네일 관리(${params.id})`,
    url: `/thumbnails/${params.id}`,
  });
}

export default function ThumbnailManagePage({ params: { id, }, }: Props) {
  console.log('id >> ', id);

  return (
    <>
      <ThumbnailData id={id} />
    </>
  );
}
