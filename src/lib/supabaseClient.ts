// lib/supabaseClient.ts
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Fallback to empty string / placeholder during build time if env vars are missing
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder';

// Global variable to hold client instance in browser/development environments
declare global {
  var supabaseGlobal: SupabaseClient | undefined;
}

// Function to create client with sessionStorage persistence
const createSupabaseClient = () =>
  createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      // Use sessionStorage so tokens clear automatically when the tab/window closes
      storage: typeof window !== 'undefined' ? window.sessionStorage : undefined,
      persistSession: true,
      autoRefreshToken: true,
    },
  });

export const supabase = globalThis.supabaseGlobal ?? createSupabaseClient();

if (process.env.NODE_ENV !== 'production') {
  globalThis.supabaseGlobal = supabase;
}