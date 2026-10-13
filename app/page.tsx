'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { User } from '@supabase/supabase-js';
import { supabase } from '../src/lib/supabaseClient';
import LiveStreamsSection from '../src/components/LiveStreamsSection';
import Navbar from '../src/components/Navbar';
import Home from '../src/components/Home';
import AboutSection from '../src/components/AboutSection';
import SwabHubSection from '../src/components/SwabHubSection';
import BlogSection from '../src/components/BlogSection';
import ContactSection from '../src/components/ContactSection';
import PublicationsSection from '../src/components/PublicationsSection';
import SpeakingSection from '../src/components/SpeakingSection';
import AdminDashboard from '../src/components/AdminDashboard';
import ResourcesSection from '../src/components/ResourcesSection';

function MainContent() {
  const [activePage, setActivePage] = useState('home');
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read URL search parameters to preserve redirected section state safely inside Suspense
  useEffect(() => {
    const pageParam = searchParams.get('page');
    const redirectParam = searchParams.get('redirect');
    const speakingSectionParam = searchParams.get('speakingsection');

    if (speakingSectionParam) {
      setActivePage('speaking');
    } else if (redirectParam) {
      if (redirectParam === 'live' || redirectParam === 'livestreams') {
        setActivePage('live');
      } else {
        setActivePage(redirectParam);
      }
    } else if (pageParam) {
      if (pageParam === 'livestreams') {
        setActivePage('live');
      } else {
        setActivePage(pageParam);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    // Initial session retrieval (Does not block guest access)
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth state changes in real time
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const isAdmin = user?.user_metadata?.role === 'admin' || user?.email === 'admin@nathanael.com';

  return (
    <div className="min-h-screen flex flex-col font-sans bg-swab-bgLight">
      <Navbar activePage={activePage} setActivePage={setActivePage} user={user} />

      <main className="flex-1 bg-slate-100">
        {activePage === 'home' && <Home setActivePage={setActivePage} />}
        {activePage === 'about' && <AboutSection setActivePage={setActivePage} />}
        {activePage === 'swab' && <SwabHubSection setActivePage={setActivePage} />}
        {activePage === 'blog' && <BlogSection setActivePage={setActivePage} user={user} />}
        {activePage === 'publications' && <PublicationsSection _setActivePage={setActivePage} />}
        {activePage === 'speaking' && <SpeakingSection setActivePage={setActivePage} user={user} />}

        {activePage === 'admin' && (
          isAdmin ? (
            <AdminDashboard setActivePage={setActivePage} />
          ) : (
            <div className="max-w-4xl mx-auto my-12 p-8 bg-white rounded-2xl border border-slate-200 text-center shadow-sm space-y-4">
              <h2 className="text-xl font-bold text-slate-900">Restricted Area</h2>
              <p className="text-sm text-slate-600">You must be signed in as an administrator to access this page.</p>
              <button
                onClick={() => router.push('/login')}
                className="px-5 py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-semibold text-xs rounded-xl uppercase tracking-wider transition cursor-pointer"
              >
                Go to Sign In
              </button>
            </div>
          )
        )}

        {activePage === 'resources' && <ResourcesSection _setActivePage={setActivePage} />}
        {activePage === 'contact' && <ContactSection />}
        {activePage === 'live' && <LiveStreamsSection />}
      </main>

      <footer className="bg-swab-navy text-white border-t border-swab-gold/30 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-gray-400 space-y-2">
          <p>© {new Date().getFullYear()} Nathanael Maradza. All rights reserved.</p>
          <p className="text-swab-gold font-medium">Social Work Across Borders (SWAB)</p>
        </div>
      </footer>
    </div>
  );
}

export default function MainPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-100 flex items-center justify-center text-xs text-slate-600">Loading portal...</div>}>
      <MainContent />
    </Suspense>
  );
}