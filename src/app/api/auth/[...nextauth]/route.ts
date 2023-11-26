import NextAuth from 'next-auth/next';
import CredentialProvider from 'next-auth/providers/credentials';
import GoogleProvier from 'next-auth/providers/google';
import GithubProvider from 'next-auth/providers/github';
import { apiPost } from '@/src/utils/axios';
import { ApiResponse, SignInData } from '@/src/types/api.types';
import { UserWithoutPassword } from '@/src/types/entity.types';

const handler = NextAuth({
  providers: [
    CredentialProvider({
      name: 'Credentials',
      credentials: {
        email: {
          label: 'email',
          type: 'email',
        },
        password: {
          label: 'password',
          type: 'password',
        },
      },
      async authorize({ email, password, }) {
        console.log({ email, password, });

        const { data: { data, }, } = await apiPost<ApiResponse<UserWithoutPassword>, SignInData>(
          '/auth/signin',
          {
            email,
            password,
          }
        );

        if (data) {
          return data;
        } else {
          return null;
        }
      },
    }),
    GoogleProvier({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          scope: [
            'openid',
            'https://www.googleapis.com/auth/userinfo.email',
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/drive',
          ].join(' '),
        },
      },
    }),
    GithubProvider({
      clientId: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID,
      clientSecret: process.env.NEXT_PUBLIC_GITHUB_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    jwt({ token, user, }) {
      return { ...token, ...user, };
    },
    session({ session, token, }) {
      session.user = token as any;
      return session;
    },
    signIn({ user, account, profile, }) {
      console.log('user >> ', user);
      console.log('account >> ', account);
      console.log('profile >> ', profile);

      return true;
    },
  },
  debug: process.env.NODE_ENV === 'development',
  pages: {
    signIn: '/signin',
    newUser: '/signup',
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
});

export { handler as GET, handler as POST };
