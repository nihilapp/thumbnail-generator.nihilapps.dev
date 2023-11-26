import { v4 as uuid } from 'uuid';
import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';
import { Color } from '../reducers';

export class Nihil {
  static createToken(payload: JwtPayload, mode: ('access' | 'refresh'), options?: SignOptions) {
    const key = mode === 'access'
      ? process.env.NEXT_PUBLIC_JWT_SECRET!
      : process.env.NEXT_PUBLIC_JWT_REFRESH_SECRET!;

    const defaultExp = '1h';

    const token = jwt.sign(
      payload,
      key,
      options || {
        algorithm: 'HS256',
        expiresIn: defaultExp,
      }
    );

    return token;
  }

  static uuid(index: number) {
    return uuid() + index;
  }

  static string(data: any) {
    return JSON.stringify(data);
  }

  static parse(stringData: string) {
    return JSON.parse(stringData);
  }

  static toRGBHex(color: Color) {
    const { red, green, blue, } = color;

    let redHex = red.toString(16);
    redHex = redHex.length > 1 ? redHex : `0${redHex}`;

    let greenHex = green.toString(16);
    greenHex = greenHex.length > 1 ? greenHex : `0${greenHex}`;

    let blueHex = blue.toString(16);
    blueHex = blueHex.length > 1 ? blueHex : `0${blueHex}`;

    return `#${redHex}${greenHex}${blueHex}`;
  }
}
