import { IConfigData } from '@/src/types/common.types';

export const configData: IConfigData = {
  title: '사이트 이름',
  description: '사이트 설명',
  keywords: '',
  author: {
    name: 'NIHILncunia',
    url: 'https://github.com/NIHILncunia',
  },
  type: 'website',
  url: process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000'
    : '',
  image: '',
  version: 'v0.0.0',
};
