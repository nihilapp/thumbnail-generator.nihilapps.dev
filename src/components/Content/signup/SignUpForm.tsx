'use client';

import { DevTool } from '@hookform/devtools';
import React, { useCallback } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { ClassNameValue, twJoin } from 'tailwind-merge';
import { supabase } from '@/src/utils/supabase/client';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { Heading } from '@/src/components/Base';
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
        회원가입
      </Heading>
      <form className={css.default} onSubmit={handleSubmit(onSubmitForm)} noValidate>
        <label htmlFor='email' className={css.inputBlock}>
          <span className={css.label}>이메일</span>
          <input
            type='email'
            id='email'
            className={twJoin([
              css.input,
              errors.email && `border-red-500`,
            ])}
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

        <label htmlFor='user-name' className={css.inputBlock}>
          <span className={css.label}>닉네임</span>
          <input
            type='text'
            id='user-name'
            className={twJoin([
              css.input,
              errors.userName && `border-red-500`,
            ])}
            {...register('userName', {
              required: {
                value: true,
                message: '닉네임을 입력하세요.',
              },
            })}
          />
          {errors.userName && (
            <span className={css.errorMessage}>{errors.userName?.message}</span>
          )}
        </label>

        <label htmlFor='password' className={css.inputBlock}>
          <span className={css.label}>비밀번호</span>
          <input
            type='password'
            id='password'
            autoComplete='off'
            className={twJoin([
              css.input,
              errors.password && `border-red-500`,
            ])}
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

        <label htmlFor='password-check' className={css.inputBlock}>
          <span className={css.label}>비밀번호 확인</span>
          <input
            type='password'
            id='password-check'
            autoComplete='off'
            className={twJoin([
              css.input,
              errors.passwordCheck && `border-red-500`,
            ])}
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
            <span className={css.errorMessage}>{errors.passwordCheck?.message}</span>
          )}
        </label>

        <button className={css.button}>회원가입</button>
      </form>

      <AuthButton />

      {process.env.NODE_ENV === 'development' && (
        <DevTool control={control} placement='top-right' />
      )}
    </>
  );
}
