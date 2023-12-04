'use client';

import React, { useCallback } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { ClassNameValue, twJoin } from 'tailwind-merge';
import { DevTool } from '@hookform/devtools';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { useAppDispatch } from '@/src/hooks/rtk';
import { setMessage, setMessageShown, setMessageType } from '@/src/reducers';
import { supabase } from '@/src/utils/supabase/client';
import { Heading } from '@/src/components/Base';
import { AuthButton } from '../../Common';

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

  const dispatch = useAppDispatch();
  const router = useRouter();

  const onSubmitForm: SubmitHandler<Inputs> = useCallback(
    async (data) => {
      supabase.auth.signInWithPassword(data)
        .then((response) => {
          if (response.error) {
            toast.error('로그인 실패. 이메일 혹은 비밀번호를 확인해주세요.');
          } else {
            dispatch(setMessageType('success'));
            dispatch(setMessageShown(false));
            dispatch(setMessage('로그인 되었습니다.'));
            router.push('/');
          }
        });
    },
    []
  );

  const css = {
    default: twJoin([
      `mb-5 flex flex-col gap-5 w-2/4 mx-auto text-black-base`,
      styles,
    ]),
    inputBlock: twJoin([
      `flex flex-col gap-1 text-[1.1rem]`,
    ]),
    label: twJoin([
      `font-700 text-[1.2rem]`,
    ]),
    input: twJoin([
      `p-3 bg-black-100 border-b-[3px] border-black-100 focus:border-blue-500 outline-none transition-colors duration-200 font-500`,
    ]),
    button: twJoin([
      `p-3 bg-blue-400 hover:bg-blue-600 text-white text-[1.2rem] mt-5`,
    ]),
    errorMessage: twJoin([
      `text-red-500 font-700 italic`,
    ]),
  };

  return (
    <>
      <Heading level='h2' styles='text-center mb-[50px] w-2/4 mx-auto'>
        로그인
      </Heading>
      <form onSubmit={handleSubmit(onSubmitForm)} noValidate className={css.default}>
        <label htmlFor='email' className={css.inputBlock}>
          <span className={css.label}>이메일</span>
          <input
            type='email'
            id='email'
            className={css.input}
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
          {errors.email && (
            <span className={css.errorMessage}>{errors.email?.message}</span>
          )}
        </label>

        <label htmlFor='password' className={css.inputBlock}>
          <span className={css.label}>비밀번호</span>
          <input
            type='password'
            id='password'
            autoComplete='off'
            className={css.input}
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
          {errors.password && (
            <span className={css.errorMessage}>{errors.password?.message}</span>
          )}
        </label>
        <button className={css.button}>로그인</button>
      </form>

      <AuthButton />

      {process.env.NODE_ENV === 'development' && (
        <DevTool control={control} placement='top-right' />
      )}
    </>
  );
}
