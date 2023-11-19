import { Database } from '@/src/types/supabase.types';
import { createBrowserClient } from '@supabase/ssr';

export const supabase = createBrowserClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_PROJECT!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
