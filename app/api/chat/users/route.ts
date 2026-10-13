import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Uses service role to read auth.users
);

export async function GET() {
  // Option A: Pull directly from Supabase Auth via Admin API
  const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const formattedUsers = users.map((u) => ({
    id: u.id,
    name: u.user_metadata?.display_name || u.email?.split('@')[0] || 'User',
    email: u.email,
    isOnline: false, // Wire up to your Presence/WebSockets if available
  }));

  return NextResponse.json(formattedUsers);
}