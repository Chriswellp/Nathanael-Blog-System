import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();

    // 1. Initialize Supabase Client with request cookies
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          },
        },
      }
    );

    // 2. Verify Session & User Authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized: You must be signed in to access live calls.' },
        { status: 401 }
      );
    }

    // 3. Extract request body parameters
    const { roomName, userName, isAdmin } = await request.json();

    // 4. Validate JaaS Environment Credentials
    const appId = process.env.JAAS_APP_ID;
    const keyId = process.env.JAAS_KEY_ID;
    const rawPrivateKey = process.env.JAAS_PRIVATE_KEY;

    if (!appId || !keyId || !rawPrivateKey) {
      return NextResponse.json(
        { error: 'Server misconfiguration: missing JaaS credentials' },
        { status: 500 }
      );
    }

    // Format RSA Private Key from environment variables
    let privateKey = rawPrivateKey.trim();
    if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
      privateKey = privateKey.slice(1, -1);
    }
    privateKey = privateKey.replace(/\\n/g, '\n');

    const now = Math.floor(Date.now() / 1000);

    // 5. Construct JWT Payload using authenticated Supabase user attributes
    const authenticatedName =
      userName ||
      user.user_metadata?.full_name ||
      user.email?.split('@')[0] ||
      (isAdmin ? 'Admin Host' : 'Attendee');

    const payload = {
      aud: 'jitsi',
      iss: 'chat',
      sub: appId,
      room: roomName || '*',
      exp: now + 3600 * 3, // Token valid for 3 hours
      nbf: now - 10,
      context: {
        user: {
          name: authenticatedName,
          email: user.email || '',
          avatar: user.user_metadata?.avatar_url || '',
          id: user.id, // Enforces actual Supabase User ID in JaaS room
          moderator: Boolean(isAdmin),
        },
        features: {
          livestreaming: 'true',
          recording: 'true',
          transcription: 'true',
          'outbound-call': 'false',
          lobby: 'true', // Enforces lobby/waiting room at JWT level
          chat: 'true',  // Enforces chat permission at JWT level
        },
      },
    };

    // 6. Sign JWT with RS256 algorithm
    const token = jwt.sign(payload, privateKey, {
      algorithm: 'RS256',
      header: {
        kid: keyId,
        alg: 'RS256',
      },
    });

    return NextResponse.json({ token });
  } catch (error: any) {
    console.error('Error generating JaaS token:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}