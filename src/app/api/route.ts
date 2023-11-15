import createClient from '@/src/utils/supabase/server';

export async function GET() {
  const supabase = createClient();

  const session = await supabase.auth.getSession();

  return Response.json({ session, });
}
