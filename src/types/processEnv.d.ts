// eslint-disable-next-line no-unused-vars
declare module NodeJS {
  // eslint-disable-next-line no-unused-vars
  interface ProcessEnv {
    NEXT_PUBLIC_SUPABASE_PROJECT: string;
    NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY: string;
    NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
    NEXT_PUBLIC_SUPABASE_JWT_SECRET: string;

    NEXT_PUBLIC_GOOGLE_CLIENT_ID: string;
    NEXT_PUBLIC_GOOGLE_CLIENT_SECRET: string;

    NEXT_PUBLIC_GITHUB_CLIENT_ID: string;
    NEXT_PUBLIC_GITHUB_CLIENT_SECRET: string;
  }
}
