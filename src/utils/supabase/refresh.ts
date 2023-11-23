import { createSupabaseServerClient } from './server';

export const refreshSession = async () => {
  const supabase = createSupabaseServerClient();
};
