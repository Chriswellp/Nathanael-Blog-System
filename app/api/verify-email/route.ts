// src/app/api/verify-email/route.ts
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    const cleanEmail = email ? email.trim().toLowerCase() : '';

    if (!cleanEmail) {
      return NextResponse.json({ valid: false, reason: 'Email is required' }, { status: 400 });
    }

    // Use server-side API key (without NEXT_PUBLIC prefix) or fallback to public one if defined
    const apiKey = process.env.ABSTRACT_EMAIL_API_KEY || process.env.NEXT_PUBLIC_ABSTRACT_EMAIL_API_KEY;

    if (!apiKey) {
      console.warn('ABSTRACT_EMAIL_API_KEY is missing in environment variables. Bypassing verification.');
      return NextResponse.json({ valid: true });
    }

    // Abstract API Request
    const response = await fetch(
      `https://emailvalidation.abstractapi.com/v1/?api_key=${apiKey}&email=${encodeURIComponent(cleanEmail)}`
    );

    const data = await response.json();

    // LOG THIS TO YOUR TERMINAL TO INSPECT EXACT API DATA
    console.log('--- Abstract API Raw Response ---', data);

    // Check if Abstract API returned an error (e.g. rate limit, invalid key)
    if (data.error) {
      console.error('Abstract API Error:', data.error.message);
      // Fallback: don't block user registration if Abstract API quota fails
      return NextResponse.json({ valid: true });
    }

    const isDeliverable = data.deliverability === 'DELIVERABLE' || data.deliverability === 'RISKY';
    const isDisposable = data.is_disposable_email?.value === true;
    const isValidFormat = data.is_valid_format?.value === true;
    const isMxFound = data.is_mx_found?.value === true;

    if (data.is_valid_format && !isValidFormat) {
      return NextResponse.json({ valid: false, reason: 'Invalid email address format.' });
    }

    if (data.is_mx_found && !isMxFound) {
      return NextResponse.json({ valid: false, reason: 'Domain does not have active mail servers.' });
    }

    if (isDisposable) {
      return NextResponse.json({ valid: false, reason: 'Temporary or disposable emails are not allowed.' });
    }

    if (data.deliverability && !isDeliverable) {
      return NextResponse.json({ valid: false, reason: 'Email inbox does not exist or cannot accept emails.' });
    }

    return NextResponse.json({ valid: true });
  } catch (error) {
    console.error('Email verification error:', error);
    // Fallback: If verification service fails, allow registration to proceed
    return NextResponse.json({ valid: true, warning: 'Verification service unavailable' });
  }
}