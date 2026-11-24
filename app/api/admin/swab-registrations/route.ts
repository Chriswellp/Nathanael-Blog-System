import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const authorization = request.headers.get('authorization') || '';
    const accessToken = authorization.startsWith('Bearer ')
      ? authorization.slice(7)
      : '';

    if (!accessToken) {
      return NextResponse.json({ error: 'Authentication is required.' }, { status: 401 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !anonKey || !serviceRoleKey) {
      console.error('Missing Supabase environment configuration for registrations API.');
      return NextResponse.json({ error: 'The registrations service is not configured.' }, { status: 500 });
    }

    // Verify the bearer token against Supabase Auth.
    const authClient = createClient(supabaseUrl, anonKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { data: authData, error: authError } = await authClient.auth.getUser(accessToken);

    if (authError || !authData.user) {
      return NextResponse.json({ error: 'Your session is invalid or has expired. Please sign in again.' }, { status: 401 });
    }

    const user = authData.user;
    const userEmail = (user.email || '').trim().toLowerCase();
    const appRole = user.app_metadata?.role;
    const isAdmin = userEmail === 'admin@nathanael.com' || appRole === 'admin';

    if (!isAdmin) {
      return NextResponse.json({ error: 'You are not authorised to view professional registrations.' }, { status: 403 });
    }

    // The service-role key is used only on the server because this table has RLS
    // enabled with no browser SELECT policy. Never expose this key to the client.
    const adminClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { data, error } = await adminClient
      .from('swab_registrations')
      .select('id, first_name, surname, email, whatsapp_number, registration_data, email_status, email_error, created_at')
      .order('created_at', { ascending: false })
      .limit(1000);

    if (error) {
      console.error('Supabase swab_registrations query failed:', error);
      return NextResponse.json({ error: 'The registrations could not be retrieved from the database.' }, { status: 500 });
    }

    return NextResponse.json({ data: data || [] }, {
      status: 200,
      headers: { 'Cache-Control': 'no-store, max-age=0' },
    });
  } catch (error) {
    console.error('Unexpected registrations API error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred while loading registrations.' }, { status: 500 });
  }
}
