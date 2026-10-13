// File: app/api/chat/messages/route.ts
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Or NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  // Fetch messages where the user is either the sender OR receiver
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
    .order('created_at', { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Map database schema (is_admin_reply) to frontend expected shape (sender_type)
  const formattedMessages = data.map((msg) => ({
    id: msg.id,
    sender_id: msg.sender_id,
    receiver_id: msg.receiver_id,
    sender_type: msg.is_admin_reply ? 'admin' : 'user',
    content: msg.content,
    created_at: msg.created_at,
  }));

  return NextResponse.json(formattedMessages);
}