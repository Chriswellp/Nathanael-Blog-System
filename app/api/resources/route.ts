import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase Client safely
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// ----------------------------------------------------------------------
// 1. GET: Fetch all resources
// ----------------------------------------------------------------------
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('resources')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase GET Error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (err: any) {
    console.error('Server GET Error:', err);
    return NextResponse.json(
      { error: err.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// ----------------------------------------------------------------------
// 2. POST: Upload & Insert new resource
// ----------------------------------------------------------------------
export async function POST(request: Request) {
  try {
    const contentType = request.headers.get('content-type') || '';

    let title: string = '';
    let category: string = '';
    let description: string = '';
    let isVisible: boolean = true;
    let fileUrl: string = '';
    let fileType: string = 'unknown';
    let fileSize: string = '0 KB';

    // --- CASE A: Multipart Form Data (File Upload) ---
    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();

      title = (formData.get('title') as string) || '';
      category = (formData.get('category') as string) || '';
      description = (formData.get('description') as string) || 'Uploaded via Admin Panel';
      isVisible = formData.get('isVisible') !== 'false';

      const file = formData.get('file') as File | null;

      if (file && file.size > 0) {
        const fileExt = file.name.split('.').pop() || '';
        fileType = fileExt.toLowerCase();

        const sizeInMB = file.size / (1024 * 1024);
        fileSize = sizeInMB < 1 
          ? `${Math.round(file.size / 1024)} KB` 
          : `${sizeInMB.toFixed(1)} MB`;

        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `toolkits/${fileName}`;

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const { error: uploadError } = await supabase.storage
          .from('resources')
          .upload(filePath, buffer, {
            contentType: file.type || 'application/octet-stream',
            upsert: true,
          });

        if (uploadError) {
          console.error('Storage Upload Failure:', uploadError);
          return NextResponse.json(
            { error: `Storage Error: ${uploadError.message}` },
            { status: 500 }
          );
        }

        const { data: urlData } = supabase.storage
          .from('resources')
          .getPublicUrl(filePath);

        fileUrl = urlData.publicUrl;
      }
    } 
    // --- CASE B: Standard JSON Payload ---
    else {
      const body = await request.json();
      title = body.title || '';
      category = body.category || '';
      description = body.description || 'Uploaded via Admin Panel';
      isVisible = body.isVisible ?? true;
      fileUrl = body.fileUrl || body.file_url || '';
      fileType = body.fileType || body.file_type || 'link';
      fileSize = body.fileSize || body.file_size || 'N/A';
    }

    if (!title || !category) {
      return NextResponse.json(
        { error: 'Title and category are required.' },
        { status: 400 }
      );
    }

    const { data, error: dbError } = await supabase
      .from('resources')
      .insert([
        {
          title,
          category,
          description,
          is_visible: isVisible,
          file_url: fileUrl,
          file_type: fileType,
          file_size: fileSize,
        },
      ])
      .select();

    if (dbError) {
      console.error('Database Insert Failure:', dbError);
      return NextResponse.json(
        { error: `Database Error: ${dbError.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: 'Resource created successfully', data: data[0] }, { status: 201 });
  } catch (err: any) {
    console.error('Server POST Error:', err);
    return NextResponse.json(
      { error: err.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// ----------------------------------------------------------------------
// 3. PUT: Update existing resource record
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
      if (formData.has('description')) updateFields.description = formData.get('description');
      if (formData.has('isVisible')) updateFields.is_visible = formData.get('isVisible') === 'true';

      const file = formData.get('file') as File | null;
      if (file && file.size > 0) {
        const fileExt = file.name.split('.').pop() || '';
        const fileType = fileExt.toLowerCase();

        const sizeInMB = file.size / (1024 * 1024);
        const fileSize = sizeInMB < 1 
          ? `${Math.round(file.size / 1024)} KB` 
          : `${sizeInMB.toFixed(1)} MB`;

        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `toolkits/${fileName}`;

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const { error: uploadError } = await supabase.storage
          .from('resources')
          .upload(filePath, buffer, {
            contentType: file.type || 'application/octet-stream',
            upsert: true,
          });

        if (uploadError) {
          return NextResponse.json({ error: `Storage Error: ${uploadError.message}` }, { status: 500 });
        }

        const { data: urlData } = supabase.storage.from('resources').getPublicUrl(filePath);

        updateFields.file_url = urlData.publicUrl;
        updateFields.file_type = fileType;
        updateFields.file_size = fileSize;
      }
    } else {
      const body = await request.json();
      id = body.id;
      if (body.title !== undefined) updateFields.title = body.title;
      if (body.category !== undefined) updateFields.category = body.category;
      if (body.description !== undefined) updateFields.description = body.description;
      if (body.isVisible !== undefined) updateFields.is_visible = body.isVisible;
      if (body.fileUrl !== undefined) updateFields.file_url = body.fileUrl;
      if (body.fileType !== undefined) updateFields.file_type = body.fileType;
      if (body.fileSize !== undefined) updateFields.file_size = body.fileSize;
    }

    if (!id) {
      return NextResponse.json({ error: 'Resource ID is required for updating.' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('resources')
      .update(updateFields)
      .eq('id', id)
      .select();

    if (error) {
      console.error('Supabase PUT Error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Resource updated successfully', data: data[0] }, { status: 200 });
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
    const { id, isVisible } = await request.json();

    if (!id || isVisible === undefined) {
      return NextResponse.json({ error: 'ID and isVisible parameters are required.' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('resources')
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
// 5. DELETE: Remove resource permanently from DB
// ----------------------------------------------------------------------
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Resource ID query parameter is required.' }, { status: 400 });
    }

    const { error } = await supabase
      .from('resources')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Supabase DELETE Error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Resource deleted successfully' }, { status: 200 });
  } catch (err: any) {
    console.error('Server DELETE Error:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}