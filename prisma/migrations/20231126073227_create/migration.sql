-- CreateEnum
CREATE TYPE "Provider" AS ENUM ('EMAIL', 'GOOGLE', 'GITHUB', 'NAVER', 'KAKAO');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "hashedPassword" TEXT NOT NULL,
    "provider" "Provider" DEFAULT 'EMAIL',

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);
