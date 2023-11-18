'use client';

import React, {
  ChangeEvent, useCallback, useEffect, useMemo
} from 'react';
import { useAppDispatch, useAppSelector } from '@/src/hooks/rtk';
import { setBgColor, setTextColor } from '@/src/reducers';
import { twJoin } from 'tailwind-merge';
import { Nihil } from '@/src/utils/nihil';

interface Props {
  align?: ('horizontal' | 'vertical');
  type?: ('text' | 'background');
}

export function ColorSlider({ align = 'vertical', type = 'background', }: Props) {
  const { textColor, bgColor, } = useAppSelector(
    (state) => state.thumbnail
  );

  const color = useMemo(() => {
    return type === 'text'
      ? textColor
      : bgColor;
  }, [ textColor, bgColor, ]);

  const dispatch = useAppDispatch();

  useEffect(() => {
    setColor([ color.red, color.green, color.blue, ]);
  }, []);

  const onChangeRed = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setColor([ +event.target.value, color.green, color.blue, ]);
    },
    [ color.green, color.blue, ]
  );

  const onChangeGreen = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setColor([ color.red, +event.target.value, color.blue, ]);
    },
    [ color.red, color.blue, ]
  );

  const onChangeBlue = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setColor([ color.red, color.green, +event.target.value, ]);
    },
    [ color.red, color.green, ]
  );

  function setColor(colors: number[]) {
    if (type === 'background') {
      dispatch(setBgColor({
        red: colors[0],
        green: colors[1],
        blue: colors[2],
      }));
    } else {
      dispatch(setTextColor({
        red: colors[0],
        green: colors[1],
        blue: colors[2],
      }));
    }
  }

  const style = {
    container: twJoin([
      align === 'vertical' && `flex w-full`,
      align === 'horizontal' && `flex flex-col gap-2 w-full`,
    ]),
    colorSliders: twJoin([
      align === 'vertical' && `flex flex-col justify-between flex-1 shrink-0`,
      align === 'horizontal' && `order-2 flex flex-row`,
      `[&>div]:flex [&>div]:flex-row [&>div]:items-center [&>div]:flex-1 [&>div]:shrink-0`,
      `[&_span]:shrink-0 [&_span]:basis-[100px] [&_span]:text-center [&_span]:font-black [&_span]:text-black-base [&_span]:text-big`,
    ]),
    slider: twJoin([
      `appearance-none bg-black-100 outline-none h-10 flex-1 shrink-0 overflow-hidden`,
      `[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-10 [&::-webkit-slider-thumb]:aspect-square [&::-webkit-slider-thumb]:bg-blue-500 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-[-520px_0_0_500px] [&::-webkit-slider-thumb]:shadow-blue-300`,
    ]),
    colorView: twJoin([
      align === 'vertical' && `w-[150px] aspect-square border-2 border-[black]`,
      align === 'horizontal' && `w-full h-20 border-2 border-[black] order-1`,
    ]),
  };

  return (
    <>
      <div className={style.container}>
        <div className={style.colorSliders}>
          <div>
            <input
              type='range'
              min={0}
              max={255}
              value={color.red}
              onChange={onChangeRed}
              className={style.slider}
            />
            <span>{color.red}</span>
          </div>
          <div>
            <input
              type='range'
              min={0}
              max={255}
              value={color.green}
              onChange={onChangeGreen}
              className={style.slider}
            />
            <span>{color.green}</span>
          </div>
          <div>
            <input
              type='range'
              min={0}
              max={255}
              value={color.blue}
              onChange={onChangeBlue}
              className={style.slider}
            />
            <span>{color.blue}</span>
          </div>
        </div>
        <div className={style.colorView} style={{ backgroundColor: Nihil.toRGBHex(color), }} />
      </div>
    </>
  );
}
