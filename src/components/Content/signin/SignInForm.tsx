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
            <span>{errors.email?.message}</span>
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
            <span>{errors.password?.message}</span>
          )}
        </label>
        <button>로그인</button>
      </form>

      <div className='border-t border-black-300'>
        <AuthButton />
      </div>

      {process.env.NODE_ENV === 'development' && (
        <DevTool control={control} placement='top-right' />
      )}
    </>
  );
}
