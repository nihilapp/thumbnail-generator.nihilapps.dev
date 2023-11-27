'use client';

import { DevTool } from '@hookform/devtools';
import React, { useCallback } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { ClassNameValue, twJoin } from 'tailwind-merge';
import { supabase } from '@/src/utils/supabase/client';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { AuthButton } from '../../Common';

interface Props {
  styles?: ClassNameValue;
}

interface Inputs {
  email: string;
  userName: string;
  password: string;
  passwordCheck: string;
}

export function SignUpForm({ styles, }: Props) {
  const {
    register, handleSubmit, control, watch, formState: { errors, },
  } = useForm<Inputs>({
    mode: 'all',
  });

  const router = useRouter();

  const onSubmitForm: SubmitHandler<Inputs> = useCallback(
    async (data) => {
      supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            userName: data.userName,
          },
        },
      }).then(() => {
        toast.success('회원가입이 완료되었습니다.');
        router.push('/');
      });
    },
    []
  );

  const style = {
    default: twJoin([
      'mb-5 flex flex-col gap-2 w-1/4',
      styles,
    ]),
    inputBlock: twJoin([
      'flex flex-col gap-1',
    ]),
    label: twJoin([
      'font-700',
    ]),
    input: twJoin([
      'bg-black-100 focus:bg-blue-100 outline-none p-2 border border-black-400 focus:border-blue-400',
    ]),
    button: twJoin([
      'p-2 bg-black-200 hover:bg-blue-200 border border-black-400 hover:border-blue-400',
    ]),
    errorMessage: twJoin([
      'text-red-500 font-700 italic',
    ]),
  };

  return (
    <>
      <form className={style.default} onSubmit={handleSubmit(onSubmitForm)} noValidate>
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
          {errors.email && (
            <span className={style.errorMessage}>{errors.email?.message}</span>
          )}
        </label>

        <label htmlFor='user-name' className={style.inputBlock}>
          <span className={style.label}>닉네임</span>
          <input
            type='text'
            id='user-name'
            className={style.input}
            {...register('userName', {
              required: {
                value: true,
                message: '닉네임을 입력하세요.',
              },
            })}
          />
          {errors.userName && (
            <span className={style.errorMessage}>{errors.userName?.message}</span>
          )}
        </label>

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
          {errors.password && (
            <span className={style.errorMessage}>{errors.password?.message}</span>
          )}
        </label>

        <label htmlFor='password-check' className={style.inputBlock}>
          <span className={style.label}>비밀번호 확인</span>
          <input
            type='password'
            id='password-check'
            autoComplete='off'
            className={style.input}
            {...register('passwordCheck', {
              required: {
                value: true,
                message: '비밀번호를 입력하세요.',
              },
              minLength: {
                value: 8,
                message: '비밀번호는 8자 이상이어야합니다.',
              },
              validate: {
                misMatchPassword: (value) => {
                  return watch('password') === value || '입력한 비밀번호와 다릅니다.';
                },
              },
            })}
          />
          {errors.passwordCheck && (
            <span className={style.errorMessage}>{errors.passwordCheck?.message}</span>
          )}
        </label>

        <button className={style.button}>회원가입</button>
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
