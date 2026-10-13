import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables.');
  }

  return createClient(supabaseUrl, supabaseKey);
}

// GET: Fetch Hero Data
export async function GET() {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('hero_content')
      .select('*')
      .limit(1)
      .maybeSingle();

    if (error) throw error;

    const formattedData = data
      ? {
          id: data.id,
          badgeText: data.badge_text || '',
          authorName: data.author_name || '',
          tagline: data.tagline || '',
          quote: data.quote || '',
          logoUrl: data.logo_url || '',
          cardTitle: data.card_title || '',
          cardSubtitle: data.card_subtitle || '',
          cardDescription: data.card_description || '',
        }
      : {
          badgeText: '',
          authorName: '',
          tagline: '',
          quote: '',
          logoUrl: '',
          cardTitle: '',
          cardSubtitle: '',
          cardDescription: '',
        };

    return NextResponse.json(formattedData, { status: 200 });
  } catch (err: any) {
    console.error('GET Hero Error:', err);
    return NextResponse.json(
      { error: err.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// POST: Save or Update Hero Section
export async function POST(request: Request) {
  try {
    const supabase = getSupabaseClient();
    const body = await request.json();

    // Find existing single hero record ID
    const { data: existingHero } = await supabase
      .from('hero_content')
      .select('id')
      .limit(1)
      .maybeSingle();

    const targetId = body.id || existingHero?.id;

    // Database payload explicitly mapped to Supabase table column names
    const payload = {
      badge_text: body.badgeText ?? '',
      author_name: body.authorName ?? '',
      tagline: body.tagline ?? '',
      quote: body.quote ?? '',
      logo_url: body.logoUrl ?? '',
      card_title: body.cardTitle ?? '',
      card_subtitle: body.cardSubtitle ?? '',
      card_description: body.cardDescription ?? '',
      updated_at: new Date().toISOString(),
    };

    let result;

    if (targetId) {
      result = await supabase
        .from('hero_content')
        .update(payload)
        .eq('id', targetId)
        .select()
        .single();
    } else {
      result = await supabase
        .from('hero_content')
        .insert(payload)
        .select()
        .single();
    }

    if (result.error) throw result.error;

    return NextResponse.json(
      { message: 'Hero content saved successfully', data: result.data },
      { status: 200 }
    );
  } catch (err: any) {
    console.error('POST Hero Error:', err);
    return NextResponse.json(
      { error: err.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}