import { IConfigData } from '@/src/types/common.types';

export const configData: IConfigData = {
  title: '썸네일 생성기',
  description: '간단하게 썸네일을 생성할 수 있습니다.',
  keywords: 'thumbnail, 썸네일',
  author: {
    name: 'NIHILncunia',
    url: 'https://github.com/NIHILncunia',
  },
  type: 'website',
  url: process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000'
    : 'https://thumbnail-generator.nihilapps.dev',
  image: '',
  version: 'v0.0.0',
};
