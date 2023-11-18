'use client';

import React, { useEffect, useRef } from 'react';
import { ClassNameValue, twJoin } from 'tailwind-merge';

interface Props {
  styles?: ClassNameValue;
}

export function CanvasTest({ styles, }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    const drawText = (canvas: HTMLCanvasElement, title: string, subTitle: string) => {
      console.log('title >> ', title);
      console.log('subTitle >> ', subTitle);

      console.log(canvas.width, canvas.height);

      const context = canvas.getContext('2d');

      const titleLines = title.split('\n');

      console.log(titleLines);

      const titleSize = 64;
      const subTitleSize = subTitle ? 48 : 0;
      const lineHeight = subTitle ? 10 : 0;
      const x = canvas.width / 2;
      const y = (canvas.height / 2);

      const totalHeight = (titleLines.length * (titleSize + lineHeight)) + subTitleSize;
      // const totalHeight = (titleLines.length * (titleSize + lineHeight)) + subTitleSize;

      context.textAlign = 'center';

      titleLines.forEach((line, index) => {
        context.font = `900 ${titleSize}px Noto Sans KR`;

        const titleY = y - totalHeight / 2 + index * (titleSize + lineHeight);

        context.fillStyle = '#333333';
        context.fillText(line, x, titleY);
      });

      if (subTitle) {
        context.font = `600 ${subTitleSize}px Noto Sans KR`;

        const subTitleY = y + totalHeight / 2 + subTitleSize / 2;
        context.fillText(subTitle, x, subTitleY);
      }
    };

    drawText(canvas, '제목을 입\n력하세요', '부제입니다');
  }, []);

  const style = {
    default: twJoin([
      `bg-black-100`,
      styles,
    ]),
  };

  return (
    <>
      <canvas width={1280} height={720} ref={canvasRef} className={style.default} />
    </>
  );
}
