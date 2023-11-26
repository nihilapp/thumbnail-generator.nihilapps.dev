import { SignInData } from '@/src/types/api.types';
import { Nihil } from '@/src/utils/nihil';
import { prisma } from '@/src/utils/prisma';
import { HttpStatusCode } from 'axios';
import { compare } from 'bcrypt';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { email, password, }: SignInData = await req.json();

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    return NextResponse.json({
      data: null,
      message: '존재하지 않는 사용자입니다.',
    }, {
      status: HttpStatusCode.NotFound,
    });
  }

  const passwordCompare = await compare(password, user.hashedPassword);

  if (!passwordCompare) {
    return NextResponse.json({
      data: null,
      message: '비밀번호가 일치하지 않습니다.',
    }, {
      status: HttpStatusCode.Unauthorized,
    });
  }

  const {
    hashedPassword: _1,
    accessToken: _2,
    refreshToken: _3,
    ...userWithoutPassword
  } = user;

  const accessToken = Nihil.createToken(
    userWithoutPassword,
    'access'
  );

  const refreshToken = Nihil.createToken(
    userWithoutPassword,
    'refresh',
    {
      algorithm: 'HS256',
      expiresIn: '7d',
    }
  );

  const updatedUser = await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      accessToken,
      refreshToken,
    },
  });

  const { hashedPassword: _4, ...responseUser } = updatedUser;

  return NextResponse.json({
    data: responseUser,
    message: '로그인이 완료되었습니다.',
  }, {
    status: HttpStatusCode.Ok,
  });
}
