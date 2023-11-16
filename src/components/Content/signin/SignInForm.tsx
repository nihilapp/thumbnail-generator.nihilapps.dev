'use client';

import React, { useCallback } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { ClassNameValue, twJoin } from 'tailwind-merge';
import { DevTool } from '@hookform/devtools';
import { supabase } from '@/src/utils/supabase/client';
import { useRouter } from 'next/navigation';

interface Props {
  styles?: ClassNameValue;
}

interface Inputs {
  email: string;
  password: string;
}

export function SignInForm({ styles, }: Props) {
  const {
    register, handleSubmit, control, formState: { errors, },
  } = useForm<Inputs>({ mode: 'all', });

  const router = useRouter();

  const onSubmitForm: SubmitHandler<Inputs> = useCallback(
    (data) => {
      supabase.auth.signInWithPassword(data)
        .then((response) => {
          console.log(response);

          router.push('/');
        });
    },
    []
  );

  const style = {
    default: twJoin([
      `space-y-2`,
      styles,
    ]),
    input: twJoin([
      `bg-black-100 p-2 border border-black-400 focus:bg-blue-100 focus:border-blue-400 outline-none`,
    ]),
    label: twJoin([
      `block mb-1 font-500`,
    ]),
    inputBlock: twJoin([
      `block`,
    ]),
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmitForm)} noValidate className={style.default}>
        <label htmlFor='email' className={style.inputBlock}>
          <span className={style.label}>이메일</span>
          <input
            type='email'
            id='email'
            className={style.input}
            {...register('email', {
              required: {
                value: true,
                message: '이메일을 입력하세요.',
              },
              pattern: {
                value: /(\w+)@(\w+.\w+)/g,
                message: '이메일 형식이 아닙니다.',
              },
            })}
          />
        </label>
        {errors.email && (
          <span>{errors.email?.message}</span>
        )}
        <label htmlFor='password' className={style.inputBlock}>
          <span className={style.label}>비밀번호</span>
          <input
            type='password'
            id='password'
            autoComplete='off'
            className={style.input}
            {...register('password', {
              required: {
                value: true,
                message: '비밀번호를 입력하세요.',
              },
              minLength: {
                value: 8,
                message: '비밀번호는 8자 이상이어야합니다.',
              },
            })}
          />
        </label>
        {errors.password && (
          <span>{errors.password?.message}</span>
        )}
        <button>로그인</button>
      </form>

      {process.env.NODE_ENV === 'development' && (
        <DevTool control={control} placement='top-right' />
      )}
    </>
  );
}
