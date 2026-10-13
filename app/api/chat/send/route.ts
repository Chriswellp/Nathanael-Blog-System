// File: app/api/chat/send/route.ts
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const { receiver_id, sender_type, content } = await request.json();

    if (!receiver_id || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const isAdmin = sender_type === 'admin';

    // Insert message into Supabase
    const { data, error } = await supabase
      .from('messages')
      .insert([
        {
          receiver_id: receiver_id,
          // If admin is sending, set sender_id to receiver_id (or your admin user ID)
          sender_id: receiver_id, 
          content: content,
          is_admin_reply: isAdmin,
        },
      ])
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: data[0] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}