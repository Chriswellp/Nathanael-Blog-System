'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/src/lib/supabaseClient';
import LiveRoomModal from './LiveRoomModal';

export interface LiveStream {
  id: string;
  title: string;
  description?: string;
  host_name?: string;
  meeting_url: string;
  status: 'upcoming' | 'live' | 'ended';
  scheduled_at?: string;
  created_at?: string;
}

export default function LiveStreamsSection() {
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [streams, setStreams] = useState<LiveStream[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeCallUrl, setActiveCallUrl] = useState<string | null>(null);

  useEffect(() => {
    // 1. Check user authentication status using shared Supabase instance
    const checkAuthAndFetch = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
      } catch (err) {
        console.error('Error verifying auth status:', err);
      } finally {
        setAuthLoading(false);
      }
    };

    checkAuthAndFetch();
    fetchStreams();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchStreams = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/streams', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setStreams(data);
      }
    } catch (err) {
      console.error('Error fetching live streams:', err);
    } finally {
      setLoading(false);
    }
  };

  // Loading state during auth check
  if (authLoading) {
    return (
      <section className="min-h-[60vh] bg-slate-950 text-slate-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs text-slate-400">Verifying session permissions...</p>
        </div>
      </section>
    );
  }

  // 2. Restricted Access UI for Unauthenticated Users
  if (!user) {
    return (
      <section className="min-h-[75vh] bg-slate-950 text-slate-100 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 bg-amber-400/10 border border-amber-400/20 rounded-full flex items-center justify-center mx-auto text-amber-400 text-3xl">
            🔒
          </div>
          <div className="space-y-2">
            <span className="text-[10px] font-mono tracking-widest uppercase text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/20">
              Authentication Required
            </span>
            <h2 className="text-2xl font-bold font-serif text-white pt-2">Live Sessions Restricted</h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Please sign in to your account to join live broadcasts, participate in workshops, and access room discussions.
            </p>
          </div>
          <div className="pt-2 space-y-3">
            <Link
              href="/login?redirect=live"
              className="block w-full bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold py-3 rounded-xl transition text-sm shadow-lg shadow-amber-400/20 cursor-pointer"
            >
              Sign In to Join Call
            </Link>
            <p className="text-[11px] text-slate-500">
              Don’t have an account? <Link href="/signup?redirect=live" className="text-amber-400 hover:underline">Register here</Link>
            </p>
          </div>
        </div>
      </section>
    );
  }

  // 3. Authenticated User View
  const liveStreams = streams.filter((s) => s.status === 'live');
  const upcomingStreams = streams.filter((s) => s.status === 'upcoming');
  const endedStreams = streams.filter((s) => s.status === 'ended');

  // Retrieve user full name or fall back to email prefix
  const displayName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Attendee';

  return (
    <section className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Header Banner */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-amber-400 font-semibold text-xs tracking-widest uppercase bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
            Real-Time Sessions
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-serif text-white tracking-tight">
            Live Talks & Interactive Workshops
          </h1>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Join live discussions on transnational safeguarding, child protection, and international social work practice directly from your browser.
          </p>
        </div>

        {loading ? (
          <div className="py-20 text-center text-slate-500 text-sm">
            Loading session schedule...
          </div>
        ) : (
          <div className="space-y-12">

            {/* 1. ACTIVE LIVE BROADCASTS */}
            {liveStreams.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-rose-500/30 pb-3">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
                  </span>
                  <h2 className="text-xl font-bold text-rose-400">Broadcasting Now</h2>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  {liveStreams.map((stream) => (
                    <div
                      key={stream.id}
                      className="bg-gradient-to-r from-slate-900 to-slate-900/90 border-2 border-rose-500/50 rounded-2xl p-6 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6"
                    >
                      <div className="space-y-2 max-w-2xl">
                        <span className="text-[10px] uppercase tracking-wider font-bold text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-full border border-rose-500/20">
                          🔴 Live Room Active
                        </span>
                        <h3 className="text-2xl font-bold text-white">{stream.title}</h3>
                        <p className="text-sm text-slate-300 leading-relaxed">
                          {stream.description || 'Interactive live room open for attendees.'}
                        </p>
                        <div className="text-xs text-slate-400 pt-1">
                          Hosted by <span className="text-amber-400 font-semibold">{stream.host_name || 'Nathanael Maradza'}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => setActiveCallUrl(stream.meeting_url)}
                        className="bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white font-bold px-6 py-3 rounded-xl transition shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2 cursor-pointer text-sm shrink-0"
                      >
                        🎥 Join Live Call
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 2. UPCOMING SESSIONS */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-amber-400 border-b border-slate-800 pb-3">
                Upcoming Live Sessions
              </h2>

              {upcomingStreams.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-sm bg-slate-900/40 rounded-xl border border-slate-800/60">
                  No upcoming broadcasts scheduled right now. Check back soon!
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {upcomingStreams.map((stream) => (
                    <div
                      key={stream.id}
                      className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4 flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20">
                            Upcoming
                          </span>
                          <span className="text-xs text-slate-400">
                            {stream.scheduled_at
                              ? new Date(stream.scheduled_at).toLocaleString([], {
                                  dateStyle: 'medium',
                                  timeStyle: 'short',
                                })
                              : 'To Be Announced'}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-white">{stream.title}</h3>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          {stream.description || 'Schedule details for this upcoming interactive workshop.'}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                        <span className="text-slate-500">Host: {stream.host_name || 'Nathanael Maradza'}</span>
                        <span className="text-slate-400 font-medium">Registration Open</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 3. PAST RECENT SESSIONS */}
            {endedStreams.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-slate-400 border-b border-slate-800 pb-3">
                  Past Sessions
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {endedStreams.map((stream) => (
                    <div
                      key={stream.id}
                      className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-4 space-y-2 opacity-75 hover:opacity-100 transition"
                    >
                      <span className="text-[10px] font-bold uppercase text-slate-500">Ended</span>
                      <h4 className="text-sm font-bold text-slate-200">{stream.title}</h4>
                      <p className="text-xs text-slate-500 line-clamp-2">{stream.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}
      </div>

      {/* EMBEDDED JITSI / JAAS LIVE ROOM MODAL */}
      {activeCallUrl && (
        <LiveRoomModal
          roomUrl={activeCallUrl}
          displayName={displayName}
          onClose={() => setActiveCallUrl(null)}
        />
      )}
    </section>
  );
}