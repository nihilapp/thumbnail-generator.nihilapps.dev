import createClient from '@/src/utils/supabase/client';

export const useGetUser = async () => {
  const supabase = await createClient();

  const { data: userData, } = await supabase.auth.getUser();
  // eslint-disable-next-line camelcase
  const { user_metadata, } = userData.user;

  // eslint-disable-next-line camelcase
  return user_metadata;
};
