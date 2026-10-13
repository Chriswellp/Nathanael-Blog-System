import { NextRequest, NextResponse } from 'next/server';
import ytdl from '@distube/ytdl-core';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const videoUrl = searchParams.get('url');
  const title = searchParams.get('title') || 'video';

  if (!videoUrl || !ytdl.validateURL(videoUrl)) {
    return NextResponse.json({ error: 'Invalid or missing YouTube URL' }, { status: 400 });
  }

  try {
    // 1. Get Video Information
    const info = await ytdl.getInfo(videoUrl);
    
    // 2. Select combined MP4 video + audio format
    const format = ytdl.chooseFormat(info.formats, {
      quality: 'highestvideo',
      filter: (f) => f.container === 'mp4' && f.hasAudio && f.hasVideo,
    });

    if (!format || !format.url) {
      // Fallback to highest overall format if specific mp4 is unavailable
      const fallbackFormat = ytdl.chooseFormat(info.formats, { quality: 'highest' });
      if (!fallbackFormat?.url) {
        return NextResponse.json({ error: 'No streamable format found' }, { status: 404 });
      }
      return NextResponse.redirect(fallbackFormat.url);
    }

    // 3. Fetch stream directly and pipe it back to user as a file download
    const response = await fetch(format.url);
    const safeTitle = title.replace(/[^a-zA-Z0-9_\- ]/g, '_');

    return new NextResponse(response.body, {
      headers: {
        'Content-Disposition': `attachment; filename="${safeTitle}.mp4"`,
        'Content-Type': 'video/mp4',
        'Content-Length': format.contentLength || response.headers.get('content-length') || '',
      },
    });
  } catch (error: any) {
    console.error('Direct download error:', error?.message || error);
    return NextResponse.json(
      { error: 'Failed to stream video directly from YouTube' },
      { status: 500 }
    );
  }
}