import NextAuth from 'next-auth/next';
import Github from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';
import type { NextAuthOptions } from 'next-auth';

export const config = {
  theme: {
    logo: '',
  },
  providers: [
    Github({
      clientId: '',
      clientSecret: '',
    }),
    Google({
      clientId: '',
      clientSecret: '',
    }),
  ],
  callbacks: {
    authorized({ request, auth, }) {
      const { pathname, } = request.nextUrl;
      if (pathname === '/middleware-example') return !!auth;
      return true;
    },
  },
} satisfies NextAuthOptions;

export const {
  handlers, auth, signIn, signOut,
} = NextAuth(config);
