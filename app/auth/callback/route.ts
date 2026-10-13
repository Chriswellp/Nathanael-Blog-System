import { NextResponse } from 'next/server';
import { supabase } from '@/src/lib/supabaseClient';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') ?? '/login';

  if (code) {
    await supabase.auth.exchangeCodeForSession(code);
  }

  // Use production site URL if defined, otherwise fallback to request origin
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || requestUrl.origin;

  return NextResponse.redirect(`${baseUrl}${next}`);
}