import { v4 as uuid } from 'uuid';
import dayjs from 'dayjs';
import ko from 'dayjs/locale/ko';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Color } from '../store/thumbnail.store';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);
dayjs.tz.setDefault('Asia/Seoul');
dayjs.locale(ko);

export class Nihil {
  static uuid(index?: number) {
    return uuid() + (index || 0);
  }

  static string(data: any) {
    return JSON.stringify(data);
  }

  static parse(stringData: string) {
    return JSON.parse(stringData);
  }

  static toRGBHex(color: Color) {
    const { red, green, blue, } = color;

    let redHex = Number(red).toString(16);
    redHex = redHex.length > 1 ? redHex : `0${redHex}`;

    let greenHex = Number(green).toString(16);
    greenHex = greenHex.length > 1 ? greenHex : `0${greenHex}`;

    let blueHex = Number(blue).toString(16);
    blueHex = blueHex.length > 1 ? blueHex : `0${blueHex}`;

    return `#${redHex}${greenHex}${blueHex}`;
  }

  static date(date?: (string | number | Date)) {
    return dayjs(date || new Date()).tz('Asia/Seoul');
  }

  static dateFormat(date?: (string | number | Date), format?: string) {
    return this.date(date || new Date()).format(format || 'YYYY-MM-DD');
  }
}
