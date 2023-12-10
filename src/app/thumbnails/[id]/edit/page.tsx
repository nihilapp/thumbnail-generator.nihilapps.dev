import React from 'react';
import { supabase } from '@/src/utils/supabase/client';
import { EditThumbnail } from '@/src/components/Content/MyPage';
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
    title: `썸네일 수정(${params.id})`,
    url: `/thumbnails/${params.id}/edit`,
  });
}

export default function page({ params, }: Props) {
  return (
    <>
      <EditThumbnail id={params.id} />
    </>
  );
}
