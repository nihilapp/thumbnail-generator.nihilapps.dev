import React from 'react';
import { ClassNameValue, twJoin } from 'tailwind-merge';
import { UseFormRegisterReturn } from 'react-hook-form';

interface Props {
  id: string
  type?: string;
  label: string;
  register: UseFormRegisterReturn;
  styles?: ClassNameValue;
}

export function TextInput({
  id, type = 'text', label, register, styles,
}: Props) {
  const css = {
    default: twJoin([
      `flex flex-col gap-1 not-last:mb-3 text-black-base`,
      styles,
    ]),
    label: twJoin([
      `font-500 text-[1.2rem]`,
    ]),
    input: twJoin([
      `p-3 text-[1.1rem] bg-black-100 border-b-[3px] border-black-100 focus:border-blue-500 outline-none transition-colors duration-200 font-500`,
    ]),
  };

  return (
    <>
      <label htmlFor={id} className={css.default}>
        <span className={css.label}>{label}</span>
        <input type={type} id={id} {...register} className={css.input} />
      </label>
    </>
  );
}
