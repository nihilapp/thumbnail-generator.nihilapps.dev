import { SignUpData } from '@/src/types/api.types';
import { prisma } from '@/src/utils/prisma';
import { HttpStatusCode } from 'axios';
import { hash } from 'bcrypt';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { email, userName, password, }: SignUpData = await req.json();

  const users = await prisma.user.findMany();

  const isHasUser = users.find(
    (user) => user.email === email
  );

  if (isHasUser) {
    return NextResponse.json({
      data: null,
      message: '이미 가입된 이메일입니다.',
    }, {
      status: HttpStatusCode.Conflict,
    });
  }

  const hashedPassword = await hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      hashedPassword,
      userName,
    },
  });

  const { hashedPassword: _, ...newUser } = user;

  return NextResponse.json({
    data: newUser,
    message: '회원가입이 완료',
  }, {
    status: HttpStatusCode.Ok,
  });
}
