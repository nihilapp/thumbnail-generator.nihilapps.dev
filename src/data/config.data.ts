import { IConfigData } from '@/src/types/common.types';

export class configData {
  static title = '썸네일 생성기';
  static description = '간단하게 썸네일을 생성할 수 있습니다.';
  static keywords = 'thumbnail, 썸네일';
  static author = {
    name: 'NIHILncunia',
    url: 'https://github.com/NIHILncunia',
  };
  static type = 'website';
  static url = process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000'
    : 'https://thumbnail-generator.nihilapps.dev';
  static image = '';
  static version = 'v0.0.0';
  static baseApiUrl = `${this.url}/api`;
}
