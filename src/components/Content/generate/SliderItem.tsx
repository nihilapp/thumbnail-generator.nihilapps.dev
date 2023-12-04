'use client';

import { useAppDispatch } from '@/src/hooks/rtk';
import { Color, setBgColor, setTextColor } from '@/src/reducers';
import { Icon } from '@iconify/react';
import React, {
  ChangeEvent, useCallback, useEffect, useRef, useState
} from 'react';
import { twJoin } from 'tailwind-merge';

interface Props {
  colorType: string;
  colors: Color;
  color: number;
  type: string;
}

export function SliderItem({
  colorType, colors, color, type,
}: Props) {
  const [ editColor, setEditColor, ] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const dispatch = useAppDispatch();

  const onEditColor = useCallback(
    () => {
      setEditColor((prev) => !prev);
    },
    []
  );

  const onChangeObject = {
    red: useCallback(
      (event: ChangeEvent<HTMLInputElement>) => {
        if (+event.target.value > 255) {
          event.target.value = (255).toString();
        }

        setColor([ +event.target.value, colors.green, colors.blue, ]);
      },
      [ colors.green, colors.blue, ]
    ),
    green: useCallback(
      (event: ChangeEvent<HTMLInputElement>) => {
        if (+event.target.value > 255) {
          event.target.value = (255).toString();
        }

        setColor([ colors.red, +event.target.value, colors.blue, ]);
      },
      [ colors.red, colors.blue, ]
    ),
    blue: useCallback(
      (event: ChangeEvent<HTMLInputElement>) => {
        if (+event.target.value > 255) {
          event.target.value = (255).toString();
        }

        setColor([ colors.red, colors.green, +event.target.value, ]);
      },
      [ colors.red, colors.green, ]
    ),
  };

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

  useEffect(() => {
    if (editColor) {
      inputRef.current.focus();
    }
  }, [ inputRef, editColor, ]);

  useEffect(() => {
    setColor([ colors.red, colors.green, colors.blue, ]);
  }, []);

  const css = {
    sliderDiv: twJoin([
      'flex items-center shrink-0',
    ]),
    numberSpan: twJoin([
      'font-900 text-[1.5rem] shrink-0 w-[50px] text-right text-black-base px-1',
    ]),
    numberDiv: twJoin([
      'flex gap-2 items-center shrink-0 px-2',
    ]),
    editButton: twJoin([
      'bg-blue-400 hover:bg-blue-600 text-white p-2 shrink-0',
    ]),
    editInput: twJoin([
      'outline-none font-900 text-[1.5rem] shrink-0 w-[50px] text-blue-500 text-right input-outer-spin:appearance-none input-outer-spin:m-0 input-inner-spin:appearance-none input-inner-spin:m-0 bg-blue-100 px-1',
    ]),
    slider: twJoin([
      `appearance-none bg-black-100 outline-none flex-1 shrink-0 overflow-hidden`,
      'input-slider:appearance-none input-slider:w-10 input-slider:aspect-square input-slider:bg-blue-500 input-slider:cursor-pointer input-slider:shadow-[-520px_0_0_500px] input-slider:shadow-blue-300',
      'input-slider:disabled:bg-black-300 input-slider:disabled:shadow-black-200 disabled:cursor-not-allowed',
    ]),
  };

  return (
    <>
      <div className={css.sliderDiv}>
        <input
          type='range'
          min={0}
          max={255}
          value={color}
          onChange={onChangeObject[colorType]}
          className={css.slider}
          disabled={editColor}
        />
        <div className={css.numberDiv}>
          {editColor ? (
            <input
              type='number'
              min={0}
              max={255}
              value={color}
              onChange={onChangeObject[colorType]}
              className={css.editInput}
              ref={inputRef}
            />
          ) : (
            <span className={css.numberSpan}>{color}</span>
          )}
          <button
            aria-label='edit'
            className={css.editButton}
            onClick={onEditColor}
          >
            <Icon icon={editColor ? 'mdi:check-bold' : 'material-symbols:edit'} />
          </button>
        </div>
      </div>
    </>
  );
}
