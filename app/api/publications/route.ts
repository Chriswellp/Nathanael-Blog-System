import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const includeHidden = searchParams.get('includeHidden') === 'true';

    let query = supabase.from('publications').select('*').order('created_at', { ascending: false });

    if (!includeHidden) {
      query = query.eq('is_visible', true);
    }

    const { data, error } = await query;
    if (error) throw error;

    return NextResponse.json(
      { success: true, data: data || [] },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, max-age=0, must-revalidate',
        },
      }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 2. POST - Create Publication
export async function POST(request: Request) {
  try {
    const contentType = request.headers.get('content-type') || '';
    let body: any = {};
    let file: File | null = null;

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      file = formData.get('file') as File | null;

      body = {
        title: formData.get('title'),
        category: formData.get('category'),
        author: formData.get('author'),
        journal_or_publisher: formData.get('journal_or_publisher'),
        publication_date: formData.get('publication_date'),
        abstract_summary: formData.get('abstract_summary'),
        external_link: formData.get('external_link'),
        is_visible: formData.get('is_visible') === 'true',
      };
    } else {
      body = await request.json();
    }

    let file_url = '';

    if (file && file.size > 0) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `documents/${fileName}`;

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const { error: storageError } = await supabase.storage
        .from('publications')
        .upload(filePath, buffer, {
          contentType: file.type,
          upsert: true,
        });

      if (storageError) {
        console.error('Storage Upload Error:', storageError);
      } else {
        const { data: publicUrlData } = supabase.storage
          .from('publications')
          .getPublicUrl(filePath);
        file_url = publicUrlData.publicUrl;
      }
    }

    const { data, error } = await supabase
      .from('publications')
      .insert([
        {
          title: body.title,
          category: body.category,
          author: body.author,
          journal_or_publisher: body.journal_or_publisher,
          publication_date: body.publication_date || null,
          abstract_summary: body.abstract_summary,
          external_link: body.external_link,
          file_url: file_url,
          is_visible: body.is_visible ?? true,
        },
      ])
      .select();

    if (error) throw error;

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error: any) {
    console.error('POST Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 3. PUT - Update Publication
export async function PUT(request: Request) {
  try {
    const contentType = request.headers.get('content-type') || '';
    let body: any = {};
    let file: File | null = null;

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      file = formData.get('file') as File | null;
      body = {
        id: formData.get('id'),
        title: formData.get('title'),
        category: formData.get('category'),
        author: formData.get('author'),
        journal_or_publisher: formData.get('journal_or_publisher'),
        publication_date: formData.get('publication_date'),
        abstract_summary: formData.get('abstract_summary'),
        external_link: formData.get('external_link'),
        is_visible: formData.get('is_visible') === 'true',
      };
    } else {
      body = await request.json();
    }

    if (!body.id) {
      return NextResponse.json({ error: 'Publication ID is required' }, { status: 400 });
    }

    const updatePayload: any = {
      title: body.title,
      category: body.category,
      author: body.author,
      journal_or_publisher: body.journal_or_publisher,
      publication_date: body.publication_date || null,
      abstract_summary: body.abstract_summary,
      external_link: body.external_link,
      is_visible: body.is_visible,
      updated_at: new Date().toISOString(),
    };

    if (file && file.size > 0) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `documents/${fileName}`;

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const { error: storageError } = await supabase.storage
        .from('publications')
        .upload(filePath, buffer, { contentType: file.type, upsert: true });

      if (!storageError) {
        const { data: publicUrlData } = supabase.storage
          .from('publications')
          .getPublicUrl(filePath);
        updatePayload.file_url = publicUrlData.publicUrl;
      }
    }

    const { data, error } = await supabase
      .from('publications')
      .update(updatePayload)
      .eq('id', body.id)
      .select();

    if (error) throw error;

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 4. PATCH - Toggle Visibility
export async function PATCH(request: Request) {
  try {
    const { id, is_visible } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'Publication ID is required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('publications')
      .update({ is_visible, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select();

    if (error) throw error;

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 5. DELETE - Delete Publication
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing publication ID' }, { status: 400 });
    }

    const { error } = await supabase
      .from('publications')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true, message: 'Deleted successfully' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}