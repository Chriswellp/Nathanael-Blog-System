
'use client';

import { useState, useEffect, Suspense, useCallback } from 'react';
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

// ============================================================
// PAGE ROUTING
// ============================================================

// Maps menu submenu IDs to the actual components that render them.
// The selected submenu ID itself is preserved in activePage.
const PAGE_ROUTE_MAP: Record<string, string> = {
  // ABOUT
  'who-we-are': 'about',
  'vision': 'about',

  // SWAB HUB
  'relocation-support': 'swab',
  'transition-programme': 'swab',
  'probation-support': 'swab',
  'employer-induction': 'swab',
  'training': 'swab',
  'mentoring': 'swab',

  // KNOWLEDGE HUB
  'knowledge-hub': 'blog',
  'practice-articles': 'blog',
  'research': 'blog',
  'international-perspectives': 'blog',
  'podcasts': 'blog',

  // RESOURCES
  'resources': 'resources',

  // PUBLICATIONS
  'publications': 'publications',

  // SPEAKING
  'keynote-speaking': 'speaking',
  'conferences': 'speaking',
  'university-lectures': 'speaking',
  'professional-forums': 'speaking',
  'workforce-events': 'speaking',

  // CONTACT
  'registration': 'contact',
  'partnerships': 'contact',

  // LIVE STREAMS
  'livestreams': 'live',
};

function resolvePage(page: string): string {
  return PAGE_ROUTE_MAP[page] || page;
}

// ============================================================
// SEARCH PARAMETER HANDLER
// ============================================================

function SearchParamsHandler({
  setActivePage,
}: {
  setActivePage: (page: string) => void;
}) {
  const searchParams = useSearchParams();

  useEffect(() => {
    const pageParam = searchParams.get('page');
    const redirectParam = searchParams.get('redirect');
    const speakingSectionParam = searchParams.get('speakingsection');

    if (speakingSectionParam) {
      setActivePage('speaking');
      return;
    }

    if (redirectParam) {
      const target =
        redirectParam === 'livestreams' ? 'live' : redirectParam;

      setActivePage(target);
      return;
    }

    if (pageParam) {
      const target =
        pageParam === 'livestreams' ? 'live' : pageParam;

      setActivePage(target);
    }
  }, [searchParams, setActivePage]);

  return null;
}

// ============================================================
// MAIN PAGE
// ============================================================

export default function MainPage() {
  // Keep the actual navigation destination, including submenu IDs.
  const [activePage, setActivePage] = useState('home');

  const [user, setUser] = useState<User | null>(null);

  // Homepage preloaded content
  const [initialHero, setInitialHero] = useState<any>(null);
  const [initialCards, setInitialCards] = useState<any[]>([]);

  const router = useRouter();

  // Stable page state setter for SearchParamsHandler
  const updateActivePage = useCallback((page: string) => {
    setActivePage(page);
  }, []);

  // ============================================================
  // HOMEPAGE DATA PREFETCH
  // ============================================================

  useEffect(() => {
    let isMounted = true;

    async function loadHomeContent() {
      try {
        const [heroRes, cardsRes] = await Promise.all([
          fetch('/api/home-content/hero', {
            cache: 'no-store',
          }),
          fetch('/api/home-content/card', {
            cache: 'no-store',
          }),
        ]);

        if (heroRes.ok) {
          const heroData = await heroRes.json();

          if (isMounted) {
            setInitialHero(heroData.data || heroData);
          }
        }

        if (cardsRes.ok) {
          const cardsData = await cardsRes.json();

          if (isMounted) {
            setInitialCards(
              Array.isArray(cardsData)
                ? cardsData
                : cardsData.data || []
            );
          }
        }
      } catch (err) {
        console.error('Error pre-fetching home data:', err);
      }
    }

    loadHomeContent();

    return () => {
      isMounted = false;
    };
  }, []);

  // ============================================================
  // AUTHENTICATION
  // ============================================================

  useEffect(() => {
    let mounted = true;

    // Retrieve initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (mounted) {
        setUser(session?.user ?? null);
      }
    });

    // Listen for authentication changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        setUser(session?.user ?? null);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // ============================================================
  // ADMIN ACCESS
  // ============================================================

  const isAdmin =
    user?.user_metadata?.role === 'admin' ||
    user?.email === 'admin@nathanael.com';

  // ============================================================
  // ROUTE RESOLUTION
  // ============================================================

  const renderedPage = resolvePage(activePage);

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="min-h-screen flex flex-col font-sans bg-swab-bgLight">

      {/* URL PARAMETER HANDLER */}
      <Suspense fallback={null}>
        <SearchParamsHandler setActivePage={updateActivePage} />
      </Suspense>

      {/* NAVIGATION */}
      <Navbar
        activePage={activePage}
        setActivePage={updateActivePage}
        user={user}
      />

      {/* MAIN CONTENT */}
      <main className="flex-1 bg-slate-100">

        {/* HOME */}
        {renderedPage === 'home' && (
          <Home
            setActivePage={updateActivePage}
            initialHero={initialHero}
            initialCards={initialCards}
          />
        )}

        {/* ABOUT */}
        {renderedPage === 'about' && (
          <AboutSection setActivePage={updateActivePage} />
        )}

        {/* SWAB HUB */}
        {renderedPage === 'swab' && (
          <SwabHubSection setActivePage={updateActivePage} />
        )}

        {/* KNOWLEDGE HUB / BLOG */}
        {renderedPage === 'blog' && (
          <BlogSection
            setActivePage={updateActivePage}
            user={user}
          />
        )}

        {/* PUBLICATIONS */}
        {renderedPage === 'publications' && (
          <PublicationsSection
            _setActivePage={updateActivePage}
          />
        )}

        {/* SPEAKING */}
        {renderedPage === 'speaking' && (
          <SpeakingSection
            setActivePage={updateActivePage}
            user={user}
          />
        )}

        {/* ADMIN DASHBOARD */}
        {renderedPage === 'admin' && (
          isAdmin ? (
            <AdminDashboard
              setActivePage={updateActivePage}
            />
          ) : (
            <div className="max-w-4xl mx-auto my-12 p-8 bg-white rounded-2xl border border-slate-200 text-center shadow-sm space-y-4">
              <h2 className="text-xl font-bold text-slate-900">
                Restricted Area
              </h2>

              <p className="text-sm text-slate-600">
                You must be signed in as an administrator to access this page.
              </p>

              <button
                type="button"
                onClick={() => router.push('/login')}
                className="px-5 py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-semibold text-xs rounded-xl uppercase tracking-wider transition"
              >
                Go to Sign In
              </button>
            </div>
          )
        )}

        {/* RESOURCES */}
        {renderedPage === 'resources' && (
          <ResourcesSection
            _setActivePage={updateActivePage}
          />
        )}

        {/* CONTACT */}
        {renderedPage === 'contact' && (
          <ContactSection />
        )}

        {/* LIVE STREAMS */}
        {renderedPage === 'live' && (
          <LiveStreamsSection />
        )}

        {/* FALLBACK FOR UNKNOWN ROUTES */}
        {![
          'home',
          'about',
          'swab',
          'blog',
          'publications',
          'speaking',
          'admin',
          'resources',
          'contact',
          'live',
        ].includes(renderedPage) && (
          <div className="min-h-[50vh] flex items-center justify-center px-4">
            <div className="max-w-lg w-full bg-white p-8 rounded-2xl border border-slate-200 shadow-sm text-center">
              <h2 className="text-xl font-bold text-slate-900 mb-3">
                Page Not Found
              </h2>

              <p className="text-sm text-slate-600 mb-6">
                The page you are looking for is unavailable or has not yet been added.
              </p>

              <button
                type="button"
                onClick={() => updateActivePage('home')}
                className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs font-bold uppercase tracking-wider transition"
              >
                Return to Home
              </button>
            </div>
          </div>
        )}

      </main>

      {/* FOOTER */}
      <footer className="bg-swab-navy text-white border-t border-swab-gold/30 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-gray-400 space-y-2">
          <p>
            © {new Date().getFullYear()} Social Work Across Borders (SWAB).
            All rights reserved.
          </p>

          <p className="text-swab-gold font-medium">
            Supporting social work practice, transition, learning and development across borders.
          </p>
        </div>
      </footer>

    </div>
  );
}
