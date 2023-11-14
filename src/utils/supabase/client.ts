import { createBrowserClient } from '@supabase/ssr';

export default async function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_PROJECT!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
