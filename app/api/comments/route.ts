import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Forces Next.js not to cache GET responses for dynamic comments
export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
// Prefers Service Role Key for backend operations to bypass RLS issues, falls back to Anon Key
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
  },
});

// GET: Fetch comments (All comments for Admin Dashboard, or filtered by blogId for specific posts)
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const blogId = searchParams.get('blogId');

    let query = supabase
      .from('comments')
      .select('*')
      .order('created_at', { ascending: false });

    // Filter by blog_id if provided by front-end blog/video pages
    if (blogId) {
      query = query.eq('blog_id', String(blogId));
    }

    const { data, error } = await query;

    if (error) {
      console.error('[API /api/comments GET Error]:', error);
      return NextResponse.json({ error: error.message, details: error.details }, { status: 500 });
    }

    return NextResponse.json(data || []);
  } catch (err: any) {
    console.error('[API /api/comments GET Unexpected Error]:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}

// POST: Add a new comment
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { blog_id, user_id, user_email, user_name, content } = body;

    if (!blog_id || !content || !content.trim()) {
      return NextResponse.json({ error: 'Missing blog_id or comment content' }, { status: 400 });
    }

    // Dynamic payload object to prevent PGRST204 errors if user_email or user_name columns aren't present
    const payload: Record<string, any> = {
      blog_id: String(blog_id),
      user_id: user_id || null,
      content: content.trim(),
    };

    // Include optional fields only if passed in request body
    if (user_email !== undefined) payload.user_email = user_email;
    if (user_name !== undefined) payload.user_name = user_name;

    const { data, error } = await supabase
      .from('comments')
      .insert([payload])
      .select();

    if (error) {
      console.error('[API /api/comments POST Error]:', error);
      return NextResponse.json({ error: error.message, details: error.details }, { status: 500 });
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ error: 'Failed to insert comment into database' }, { status: 500 });
    }

    return NextResponse.json(data[0], { status: 201 });
  } catch (err: any) {
    console.error('[API /api/comments POST Unexpected Error]:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE: Remove a comment by ID (for Admin moderation)
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Comment ID is required' }, { status: 400 });
    }

    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('[API /api/comments DELETE Error]:', error);
      return NextResponse.json({ error: error.message, details: error.details }, { status: 500 });
    }

    return NextResponse.json({ message: 'Comment deleted successfully' });
  } catch (err: any) {
    console.error('[API /api/comments DELETE Unexpected Error]:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}