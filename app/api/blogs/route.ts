import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';



// Initialize Supabase Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);



// ----------------------------------------------------------------------
// 1. GET: Fetch all blog entries (Including hidden ones for Admin view)
// ----------------------------------------------------------------------
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const includeHidden = searchParams.get('includeHidden') === 'true';

    let query = supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });

    // 👈 Only return visible blogs for public users
    if (!includeHidden) {
      query = query.eq('is_visible', true);
    }

    const { data, error } = await query;

    if (error) {
      console.error('[API /api/blogs GET Error]:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data || []);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
// ----------------------------------------------------------------------
// 2. POST: Insert new blog post (Handles JSON and multipart/form-data)
// ----------------------------------------------------------------------
export async function POST(request: Request) {
  try {
    const contentType = request.headers.get('content-type') || '';

    let title: string = '';
    let category: string = '';
    let type: string = 'article';
    let snippet: string = '';
    let content: string = '';
    let isVisible: boolean = true;
    let videoUrl: string | null = null;

    // --- CASE A: Multipart Form Data (Local File Uploads) ---
    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();

      title = (formData.get('title') as string) || '';
      category = (formData.get('category') as string) || '';
      type = (formData.get('type') as string) || 'article';
      snippet = (formData.get('snippet') as string) || '';
      content = (formData.get('content') as string) || '';
      isVisible = formData.get('isVisible') !== 'false'; // defaults to true unless explicitly 'false'

      const videoFile = formData.get('videoFile') as File | null;

      if (videoFile && videoFile.size > 0) {
        // Convert File to Buffer for Supabase Storage
        const bytes = await videoFile.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Sanitize filename
        const cleanFileName = videoFile.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const filePath = `${Date.now()}-${cleanFileName}`;

        // Upload to Supabase 'blog-videos' Bucket
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('blog-videos')
          .upload(filePath, buffer, {
            contentType: videoFile.type || 'video/mp4',
            upsert: false,
          });

        if (uploadError) {
          console.error('Supabase Storage Upload Error:', uploadError);
          return NextResponse.json(
            { error: `Video storage failed: ${uploadError.message}` },
            { status: 500 }
          );
        }

        // Get Public URL
        const { data: publicUrlData } = supabase.storage
          .from('blog-videos')
          .getPublicUrl(uploadData.path);

        videoUrl = publicUrlData.publicUrl;
      } else {
        // Fallback if videoEmbedUrl was passed in form data
        videoUrl = (formData.get('videoEmbedUrl') as string) || null;
      }
    } 
    // --- CASE B: Standard JSON Payload ---
    else {
      const body = await request.json();
      title = body.title || '';
      category = body.category || '';
      type = body.type || 'article';
      snippet = body.snippet || '';
      content = body.content || '';
      isVisible = body.isVisible ?? true;
      videoUrl = body.videoEmbedUrl || body.videoUrl || null;
    }

    // Validation
    if (!title || !category || !content) {
      return NextResponse.json(
        { error: 'Title, category, and content are required.' },
        { status: 400 }
      );
    }

    // Insert into Supabase Database
    const { data, error } = await supabase
      .from('blog_posts')
      .insert([
        {
          title,
          category,
          type,
          snippet,
          content,
          is_visible: isVisible,
          video_embed_url: videoUrl,
        },
      ])
      .select();

    if (error) {
      console.error('Supabase Database Insert Error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Blog created successfully', data: data[0] }, { status: 201 });
  } catch (err: any) {
    console.error('Server POST Error:', err);
    return NextResponse.json(
      { error: err.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// ----------------------------------------------------------------------
// 3. PUT: Update existing blog record in DB
// ----------------------------------------------------------------------
export async function PUT(request: Request) {
  try {
    const contentType = request.headers.get('content-type') || '';
    let id: string = '';
    let updateFields: Record<string, any> = {};

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      id = formData.get('id') as string;

      if (formData.has('title')) updateFields.title = formData.get('title');
      if (formData.has('category')) updateFields.category = formData.get('category');
      if (formData.has('type')) updateFields.type = formData.get('type');
      if (formData.has('snippet')) updateFields.snippet = formData.get('snippet');
      if (formData.has('content')) updateFields.content = formData.get('content');
      if (formData.has('isVisible')) updateFields.is_visible = formData.get('isVisible') === 'true';

      const videoFile = formData.get('videoFile') as File | null;
      if (videoFile && videoFile.size > 0) {
        const bytes = await videoFile.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const cleanFileName = videoFile.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const filePath = `${Date.now()}-${cleanFileName}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('blog-videos')
          .upload(filePath, buffer, {
            contentType: videoFile.type || 'video/mp4',
            upsert: false,
          });

        if (uploadError) {
          return NextResponse.json({ error: `Video upload failed: ${uploadError.message}` }, { status: 500 });
        }

        const { data: publicUrlData } = supabase.storage.from('blog-videos').getPublicUrl(uploadData.path);
        updateFields.video_embed_url = publicUrlData.publicUrl;
      }
    } else {
      const body = await request.json();
      id = body.id;
      if (body.title !== undefined) updateFields.title = body.title;
      if (body.category !== undefined) updateFields.category = body.category;
      if (body.type !== undefined) updateFields.type = body.type;
      if (body.snippet !== undefined) updateFields.snippet = body.snippet;
      if (body.content !== undefined) updateFields.content = body.content;
      if (body.isVisible !== undefined) updateFields.is_visible = body.isVisible;
      if (body.videoEmbedUrl !== undefined) updateFields.video_embed_url = body.videoEmbedUrl;
    }

    if (!id) {
      return NextResponse.json({ error: 'Blog ID is required for updating.' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('blog_posts')
      .update(updateFields)
      .eq('id', id)
      .select();

    if (error) {
      console.error('Supabase PUT Error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Blog updated successfully', data: data[0] }, { status: 200 });
  } catch (err: any) {
    console.error('Server PUT Error:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}

// ----------------------------------------------------------------------
// 4. PATCH: Toggle Visibility (is_visible) directly in DB
// ----------------------------------------------------------------------
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const id = body.id;
    
    // Fallback: accept either camelCase or snake_case from the request payload
    const isVisible = body.isVisible !== undefined ? body.isVisible : body.is_visible;

    if (!id || isVisible === undefined) {
      return NextResponse.json({ error: 'ID and visibility parameters are required.' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('blog_posts')
      .update({ is_visible: isVisible })
      .eq('id', id)
      .select();

    if (error) {
      console.error('Supabase PATCH Error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Visibility updated successfully', data: data[0] }, { status: 200 });
  } catch (err: any) {
    console.error('Server PATCH Error:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}

// ----------------------------------------------------------------------
// 5. DELETE: Remove entry permanently from DB
// ----------------------------------------------------------------------
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Blog ID query parameter is required.' }, { status: 400 });
    }

    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Supabase DELETE Error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Blog deleted successfully' }, { status: 200 });
  } catch (err: any) {
    console.error('Server DELETE Error:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}