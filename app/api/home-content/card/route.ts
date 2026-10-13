import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  return createClient(supabaseUrl, supabaseKey);
}

// GET: Fetch all cards
export async function GET() {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('home_cards')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) throw error;

    return NextResponse.json(data || [], { status: 200 });
  } catch (err: any) {
    console.error('GET Cards Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST: Add new Card with Media Upload
export async function POST(request: Request) {
  try {
    const supabase = getSupabaseClient();
    const formData = await request.formData();

    const title = formData.get('title') as string;
    const desc = (formData.get('desc') || formData.get('description')) as string;
    const icon = formData.get('icon') as string;
    const mediaType = (formData.get('media_type') || 'none') as string;
    const isVisible = formData.get('isVisible') === 'true';
    const linkPage = formData.get('link_page') as string;
    const storyText = formData.get('story_text') as string;
    const file = formData.get('file') as File | null;
    let mediaUrl = (formData.get('media_url') as string) || null;

    // Handle File Upload to Supabase Storage Bucket ('home_media')
    if (file && file.size > 0) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('home_media')
        .upload(filePath, file);

      if (!uploadError) {
        const { data: publicUrlData } = supabase.storage
          .from('home_media')
          .getPublicUrl(filePath);

        mediaUrl = publicUrlData.publicUrl;
      } else {
        console.warn('Storage upload error (falling back to URL if provided):', uploadError);
      }
    }

    const payload = {
      title,
      description: desc,
      icon,
      media_type: mediaType,
      media_url: mediaUrl,
      story_text: storyText || null,
      link_page: linkPage || null,
      is_visible: isVisible,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('home_cards')
      .insert(payload)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ message: 'Card created successfully', data }, { status: 201 });
  } catch (err: any) {
    console.error('POST Card Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PUT: Update existing Card
export async function PUT(request: Request) {
  try {
    const supabase = getSupabaseClient();
    const formData = await request.formData();

    const id = formData.get('id') as string;
    if (!id) {
      return NextResponse.json({ error: 'Card ID is required for update' }, { status: 400 });
    }

    const title = formData.get('title') as string;
    const desc = (formData.get('desc') || formData.get('description')) as string;
    const icon = formData.get('icon') as string;
    const mediaType = (formData.get('media_type') || 'none') as string;
    const isVisible = formData.get('isVisible') === 'true';
    const linkPage = formData.get('link_page') as string;
    const storyText = formData.get('story_text') as string;
    const file = formData.get('file') as File | null;
    let mediaUrl = (formData.get('media_url') as string) || null;

    // Handle File Upload if new file provided
    if (file && file.size > 0) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('home_media')
        .upload(filePath, file);

      if (!uploadError) {
        const { data: publicUrlData } = supabase.storage
          .from('home_media')
          .getPublicUrl(filePath);

        mediaUrl = publicUrlData.publicUrl;
      }
    }

    const payload: Record<string, any> = {
      title,
      description: desc,
      icon,
      media_type: mediaType,
      story_text: storyText || null,
      link_page: linkPage || null,
      is_visible: isVisible,
      updated_at: new Date().toISOString(),
    };

    if (mediaUrl) {
      payload.media_url = mediaUrl;
    }

    const { data, error } = await supabase
      .from('home_cards')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ message: 'Card updated successfully', data }, { status: 200 });
  } catch (err: any) {
    console.error('PUT Card Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE: Remove card by ID
export async function DELETE(request: Request) {
  try {
    const supabase = getSupabaseClient();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing Card ID' }, { status: 400 });
    }

    const { error } = await supabase.from('home_cards').delete().eq('id', id);
    if (error) throw error;

    return NextResponse.json({ message: 'Card deleted successfully' }, { status: 200 });
  } catch (err: any) {
    console.error('DELETE Card Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}