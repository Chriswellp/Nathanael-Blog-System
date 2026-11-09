'use client';

import React, { useState, useEffect, useRef } from 'react';
import { sluggifyTitle } from '@/src/lib/stringUtils';

export interface HomePillarCard {
  id: string;
  title: string;
  desc?: string;
  description?: string;
  icon?: string;
  link_page?: string;
  link_anchor?: string;
  is_visible?: boolean;
  media_type?: 'image' | 'video' | 'none';
  media_url?: string;
  story_text?: string;
}

export interface HomeHeroData {
  badgeText?: string;
  logoUrl?: string;
  cardTitle?: string;
  cardSubtitle?: string;
  cardDescription?: string;
}

interface HomeProps {
  setActivePage: (page: string) => void;
  initialHero?: any;
  initialCards?: HomePillarCard[];
}

// Fallback pillars to show while loading or on error
const defaultPillars: HomePillarCard[] = [
  {
    id: 'blog',
    title: 'Reflections & Blogs',
    desc: 'Penning down practice and professional reflections to inspire learning, critical thinking, and better practice.',
    icon: '📖',
    link_page: 'blog',
    link_anchor: 'reflections-blogs', 
    is_visible: true,
  },
  {
    id: 'swab',
    title: 'Comparing Systems',
    desc: 'Comparisons of legislation, policy, and practice across different countries to promote understanding and improve outcomes.',
    icon: '⚖️',
    link_page: 'swab',
    link_anchor: 'swab',
    is_visible: true,
  },
  {
    id: 'speaking-learning',
    title: 'Learning & Exchange',
    desc: 'Learning from different countries, cultures, and approaches to build knowledge and strengthen social work practice.',
    icon: '🌐',
    link_page: 'speaking',
    link_anchor: 'learning-exchange', 
    is_visible: true,
  },
  {
    id: 'speaking-talks',
    title: 'Talks & Conversations',
    desc: 'Discussions with social workers, researchers, and experts to explore ideas, share experiences, and inspire action.',
    icon: '🎙️',
    link_page: 'speaking',
    link_anchor: 'talks-conversations', 
    is_visible: true,
  },
  {
    id: 'publications',
    title: 'Research & Knowledge',
    desc: 'Research, evidence, insights, and innovative practice that inform, influence, and improve social work outcomes.',
    icon: '🔍',
    link_page: 'publications',
    link_anchor: 'research-knowledge', 
    is_visible: true,
  },
  {
    id: 'resources',
    title: 'Children, Families & Safeguarding',
    desc: 'Putting children, young people, and families at the heart of everything we do.',
    icon: '🛡️',
    link_page: 'resources',
    link_anchor: 'children-families-safeguarding', 
    is_visible: true,
  },
];

// Fallback hero data
const fallbackHero: HomeHeroData = {
  badgeText: 'Social Work Across Borders (SWAB)',
  logoUrl: '/logo2.png',
  cardTitle: 'SOCIAL WORK ACROSS BORDERS',
  cardSubtitle: 'Different Countries. Shared Purpose. Better Outcomes for Children and Families.',
  cardDescription: 'Connecting Practice, Research and Lived Experience Across Africa and England.',
};

/**
 * Autoplay video component triggered when scrolled into view
 */
function ScrollAutoplayVideo({ src }: { src: string }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, [src]);

  return (
    <video
      ref={videoRef}
      src={src}
      controls
      muted
      playsInline
      loop
      controlsList="nodownload"
      onContextMenu={(e) => e.preventDefault()}
      className="w-full h-full object-cover"
    >
      Your browser does not support the video tag.
    </video>
  );
}

/**
 * Modern Interactive Photo Slideshow Component
 */
function ImageSlideshow({ images }: { images: { url: string; title: string; caption: string }[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused || images.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isPaused, images.length]);

  if (images.length === 0) return null;

  return (
    <div 
      className="relative w-full max-w-6xl mx-auto h-80 sm:h-[460px] rounded-3xl overflow-hidden shadow-2xl border border-slate-200/50 bg-[#071326] group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {images.map((img, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            idx === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          <img
            src={img.url}
            alt={img.title}
            className="w-full h-full object-cover object-top select-none pointer-events-none"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#071326] via-[#071326]/30 to-transparent" />

          <div className="absolute bottom-0 inset-x-0 p-6 sm:p-10 text-white space-y-1">
            <span className="text-amber-400 font-serif font-bold text-xl sm:text-3xl tracking-wide block drop-shadow">
              {img.title}
            </span>
            <p className="text-slate-200 text-xs sm:text-sm font-light max-w-2xl leading-relaxed">
              {img.caption}
            </p>
          </div>
        </div>
      ))}

      <button
        onClick={() => setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-slate-950/70 hover:bg-amber-500 text-white hover:text-slate-950 w-11 h-11 rounded-full flex items-center justify-center font-bold text-lg transition border border-white/20 shadow-xl cursor-pointer opacity-0 group-hover:opacity-100 active:scale-90"
        aria-label="Previous slide"
      >
        &#10094;
      </button>

      <button
        onClick={() => setCurrentIndex((prev) => (prev + 1) % images.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-slate-950/70 hover:bg-amber-500 text-white hover:text-slate-950 w-11 h-11 rounded-full flex items-center justify-center font-bold text-lg transition border border-white/20 shadow-xl cursor-pointer opacity-0 group-hover:opacity-100 active:scale-90"
        aria-label="Next slide"
      >
        &#10095;
      </button>

      <div className="absolute bottom-6 right-8 z-20 flex gap-2">
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
              idx === currentIndex ? 'bg-amber-400 w-8' : 'bg-white/40 hover:bg-white w-2.5'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default function Home({ setActivePage, initialHero, initialCards }: HomeProps) {
  const [pillars, setPillars] = useState<HomePillarCard[]>(() => {
    if (initialCards && initialCards.length > 0) {
      return initialCards
        .map((card: any) => ({
          ...card,
          desc: card.desc || card.description || '',
          link_anchor: card.link_anchor || sluggifyTitle(card.title),
        }))
        .filter((p: HomePillarCard) => p.is_visible !== false);
    }
    return defaultPillars;
  });

  const [hero, setHero] = useState<HomeHeroData>(initialHero || fallbackHero);
  const [selectedPillar, setSelectedPillar] = useState<HomePillarCard | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // If props were already provided by the server/parent fetch, skip duplicate client fetch
    if (initialHero && initialCards && initialCards.length > 0) return;

    const fetchHomeContent = async () => {
      try {
        const [heroRes, cardsRes] = await Promise.all([
          fetch('/api/home-content/hero', { cache: 'no-store' }),
          fetch('/api/home-content/card', { cache: 'no-store' }),
        ]);

        if (heroRes.ok) {
          const heroResult = await heroRes.json();
          const heroPayload = heroResult.data || heroResult;
          if (heroPayload && Object.keys(heroPayload).length > 0) {
            setHero(heroPayload);
          }
        }

        if (cardsRes.ok) {
          const cardsResult = await cardsRes.json();
          const loadedCards = Array.isArray(cardsResult)
            ? cardsResult
            : cardsResult.data || [];

          if (loadedCards.length > 0) {
            const formattedCards = loadedCards.map((card: any) => ({
              ...card,
              desc: card.desc || card.description || '',
              link_anchor: card.link_anchor || sluggifyTitle(card.title) 
            }));

            setPillars(formattedCards.filter((p: HomePillarCard) => p.is_visible !== false));
          }
        }
      } catch (err) {
        console.error('Error fetching home data:', err);
      }
    };

    fetchHomeContent();
  }, [initialHero, initialCards]);

  const preventDownloadContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  const handleCrossPageNav = (targetPage: string, targetSectionId?: string) => {
    setActivePage(targetPage);
    const strictHash = targetSectionId || targetPage;
    window.location.hash = strictHash;
    setSelectedPillar(null);
  };

  const galleryImages = pillars
    .filter((p) => p.media_type === 'image' && p.media_url)
    .map((p) => ({
      url: p.media_url || '',
      title: p.title,
      caption: p.desc || 'Social Work Across Borders field practice and research exchange.',
    }));

  const visiblePillars = pillars.filter((pillar) => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return true;
    return `${pillar.title} ${pillar.desc || pillar.description || ''}`.toLowerCase().includes(query);
  });

  return (
    <div className="bg-[#f2f4f8] min-h-screen text-slate-800 selection:bg-amber-400 selection:text-slate-950">
      
      {/* ORGANISATION-LED HERO */}
      <section className="relative overflow-hidden bg-[#10243a] text-white">
        <div className="absolute inset-0 opacity-30 pointer-events-none" aria-hidden="true">
          <div className="absolute -top-40 -right-24 h-[34rem] w-[34rem] rounded-full bg-[#e85d04]/30 blur-3xl" />
          <div className="absolute -bottom-48 -left-20 h-[30rem] w-[30rem] rounded-full bg-sky-500/20 blur-3xl" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.035)_1px,transparent_1px)] bg-[size:44px_44px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 pb-24 pt-10 sm:px-6 sm:pb-28 lg:px-8">
          <div className="mb-14 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img
                src={hero.logoUrl || fallbackHero.logoUrl}
                alt="Social Work Across Borders logo"
                onContextMenu={preventDownloadContextMenu}
                className="h-12 w-12 rounded-xl bg-white/10 object-contain p-1.5 ring-1 ring-white/15"
              />
              <div>
                <p className="text-sm font-extrabold tracking-[0.16em] text-white">SWAB</p>
                <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-slate-300">Social Work Across Borders</p>
              </div>
            </div>
            <button
              onClick={() => handleCrossPageNav('contact')}
              className="rounded-full border border-white/25 px-4 py-2.5 text-xs font-bold text-white transition hover:border-amber-400 hover:bg-white/10 sm:px-5"
            >
              Contact SWAB <span aria-hidden="true">↗</span>
            </button>
          </div>

          <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_.85fr]">
            <div className="max-w-3xl space-y-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-300/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-amber-300">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-300" />
                An international social work platform
              </div>

              <div className="space-y-5">
                <h1 className="text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
                  Social Work
                  <span className="block text-amber-300">Across Borders.</span>
                </h1>
                <p className="max-w-2xl text-lg leading-relaxed text-slate-200 sm:text-xl">
                  Connecting knowledge, practice and people across countries to strengthen social work and improve outcomes for children, young people and families.
                </p>
                <p className="max-w-2xl text-sm leading-7 text-slate-300">
                  SWAB creates space for cross-border learning, evidence-informed practice, policy exchange and collaboration across the social work community.
                </p>
              </div>

              <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                <button
                  onClick={() => handleCrossPageNav('swab')}
                  className="rounded-xl bg-[#e85d04] px-7 py-4 text-sm font-extrabold text-white shadow-lg shadow-orange-950/20 transition hover:-translate-y-0.5 hover:bg-[#d94f00]"
                >
                  Discover SWAB <span aria-hidden="true">→</span>
                </button>
                <button
                  onClick={() => handleCrossPageNav('publications')}
                  className="rounded-xl border border-white/25 bg-white/5 px-7 py-4 text-sm font-bold text-white transition hover:bg-white/10"
                >
                  Explore research
                </button>
              </div>

              <div className="flex flex-wrap gap-x-6 gap-y-3 border-t border-white/15 pt-6 text-xs font-semibold text-slate-300">
                <span>Cross-border perspectives</span>
                <span>Evidence-informed practice</span>
                <span>Children and family wellbeing</span>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-md">
              <div className="relative overflow-hidden rounded-[1.75rem] border border-slate-100 bg-white p-8 text-center shadow-[0_24px_70px_rgba(2,12,27,0.28)] sm:p-10">
                <div className="mx-auto mb-6 flex h-48 w-48 items-center justify-center sm:h-56 sm:w-56">
                  <img
                    src={hero.logoUrl || fallbackHero.logoUrl}
                    alt="Social Work Across Borders (SWAB)"
                    onContextMenu={preventDownloadContextMenu}
                    className="h-full w-full select-none object-contain"
                  />
                </div>
                <p className="mb-2 text-[10px] font-extrabold uppercase tracking-[0.22em] text-[#e85d04]">Our shared purpose</p>
                <h2 className="text-2xl font-extrabold leading-tight tracking-tight text-[#10243a] sm:text-3xl">
                  Different contexts.
                  <span className="block text-[#e85d04]">Shared commitment.</span>
                </h2>
                <p className="mx-auto mt-4 max-w-xs text-sm leading-6 text-slate-600">
                  Building connections that support stronger practice, better understanding and positive change.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-20 grid gap-4 border-t border-white/15 pt-8 sm:grid-cols-3">
            {[
              { number: '01', title: 'Connect', description: 'Bring practitioners, researchers and communities into conversation.' },
              { number: '02', title: 'Learn', description: 'Share knowledge and compare approaches across different contexts.' },
              { number: '03', title: 'Strengthen', description: 'Support thoughtful, inclusive and effective social work practice.' },
            ].map((item) => (
              <div key={item.number} className="flex gap-4 rounded-2xl bg-white/[0.045] p-5 ring-1 ring-white/10">
                <span className="pt-1 text-sm font-extrabold text-amber-300">{item.number}</span>
                <div>
                  <h3 className="mb-1 font-bold text-white">{item.title}</h3>
                  <p className="text-xs leading-5 text-slate-300">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TOPIC SEARCH */}
      <section className="relative z-20 mx-auto -mt-8 max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-900/10 sm:p-7">
          <div className="mb-4">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#e85d04]">Explore the platform</p>
            <h2 className="mt-1 text-xl font-bold tracking-tight text-[#10243a] sm:text-2xl">What would you like to discover?</h2>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              placeholder="Search focus areas, research, safeguarding..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-5 py-3.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#e85d04] focus:bg-white focus:ring-4 focus:ring-orange-100"
              aria-label="Search SWAB focus areas"
            />
            <button
              onClick={() => {
                if (searchQuery.trim()) {
                  document.getElementById('focus-areas')?.scrollIntoView({ behavior: 'smooth' });
                } else {
                  handleCrossPageNav('blog');
                }
              }}
              className="rounded-xl bg-[#10243a] px-7 py-3.5 text-sm font-bold text-white transition hover:bg-[#1d3b5b]"
            >
              Search topics
            </button>
          </div>
          <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-slate-500">
            <span className="mr-1 self-center text-slate-400">Explore:</span>
            <button onClick={() => { setSearchQuery('policy'); document.getElementById('focus-areas')?.scrollIntoView({ behavior: 'smooth' }); }} className="rounded-full bg-slate-100 px-3 py-1.5 transition hover:bg-orange-50 hover:text-[#e85d04]">Policy & systems</button>
            <button onClick={() => { setSearchQuery('research'); document.getElementById('focus-areas')?.scrollIntoView({ behavior: 'smooth' }); }} className="rounded-full bg-slate-100 px-3 py-1.5 transition hover:bg-orange-50 hover:text-[#e85d04]">Research</button>
            <button onClick={() => { setSearchQuery('learning'); document.getElementById('focus-areas')?.scrollIntoView({ behavior: 'smooth' }); }} className="rounded-full bg-slate-100 px-3 py-1.5 transition hover:bg-orange-50 hover:text-[#e85d04]">Learning exchange</button>
            <button onClick={() => { setSearchQuery('safeguarding'); document.getElementById('focus-areas')?.scrollIntoView({ behavior: 'smooth' }); }} className="rounded-full bg-slate-100 px-3 py-1.5 transition hover:bg-orange-50 hover:text-[#e85d04]">Safeguarding</button>
          </div>
        </div>
      </section>

      {/* "HOW CAN WE HELP?" CLASSIC NAVIGATION CARDS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold font-serif text-[#1a202c] tracking-tight">
            Explore What SWAB Offers
          </h2>
          <div className="w-16 h-1 bg-[#e85d04] mx-auto my-3 rounded-full"></div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          
          {/* CARD 1 */}
          <div className="bg-[#2d3748] text-white p-8 rounded-2xl shadow-xl flex flex-col justify-between hover:-translate-y-1 transition duration-300 border border-slate-700">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400 block mb-2">Practice & Research</span>
              <h3 className="text-2xl font-bold font-serif mb-3">Research, Evidence & Policy</h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                Explore research, comparative policy perspectives and evidence that can inform effective social work practice.
              </p>
            </div>
            <button
              onClick={() => handleCrossPageNav('publications')}
              className="w-full bg-[#e85d04] hover:bg-[#dc2f02] text-white py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition cursor-pointer text-center"
            >
              Explore Publications &rarr;
            </button>
          </div>

          {/* CARD 2 */}
          <div className="bg-white text-slate-900 p-8 rounded-2xl shadow-xl flex flex-col justify-between hover:-translate-y-1 transition duration-300 border border-slate-200">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#e85d04] block mb-2">Keynote Talks</span>
              <h3 className="text-2xl font-bold font-serif mb-3">Learning, Dialogue & Events</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-6">
                Engage with conversations, learning events and knowledge exchange on social work, policy and safeguarding.
              </p>
            </div>
            <button
              onClick={() => handleCrossPageNav('speaking')}
              className="w-full border-2 border-[#e85d04] text-[#e85d04] hover:bg-[#e85d04] hover:text-white py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition cursor-pointer text-center"
            >
              Explore Talks & Learning →
            </button>
          </div>

          {/* CARD 3 */}
          <div className="bg-white text-slate-900 p-8 rounded-2xl shadow-xl flex flex-col justify-between hover:-translate-y-1 transition duration-300 border border-slate-200">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#e85d04] block mb-2">SWAB Network</span>
              <h3 className="text-2xl font-bold font-serif mb-3">Social Work Across Borders</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-6">
                A shared platform connecting practitioners, researchers and lived experience to strengthen social work across borders.
              </p>
            </div>
            <button
              onClick={() => handleCrossPageNav('swab')}
              className="w-full bg-[#1a202c] hover:bg-[#2d3748] text-white py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition cursor-pointer text-center"
            >
              Discover the Network →
            </button>
          </div>

        </div>
      </section>

      {/* FEATURED PHOTO SLIDESHOW GALLERY */}
      {galleryImages.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[#1a202c] tracking-tight">
              Impact & Fieldwork Gallery
            </h2>
            <div className="w-16 h-1 bg-[#e85d04] mx-auto my-2.5 rounded-full"></div>
            <p className="text-slate-600 text-xs sm:text-sm">
              Visual highlights from global practice exchanges, keynote talks, and research partnerships.
            </p>
          </div>

          <ImageSlideshow images={galleryImages} />
        </section>
      )}

      {/* CORE PILLARS SECTION */}
      <section id="focus-areas" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold font-serif text-[#1a202c] mb-3 tracking-tight">
            Focus Areas & Practice Pillars
          </h2>
          <div className="w-20 h-1 bg-[#e85d04] mx-auto mb-4 rounded-full"></div>
          <p className="text-slate-600 text-sm sm:text-base">
            Bridging international policy, academic research, and grassroots field experience.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
          {visiblePillars.map((pillar) => {
            const cardDescription = pillar.desc || pillar.description || '';

            return (
              <div
                key={pillar.id}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between overflow-hidden group hover:border-[#e85d04]"
              >
                <div>
                  {pillar.media_type === 'image' && pillar.media_url && (
                    <div className="w-full aspect-[4/3] bg-[#071326] relative overflow-hidden">
                      <img
                        src={pillar.media_url}
                        alt={pillar.title}
                        onContextMenu={preventDownloadContextMenu}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500 select-none pointer-events-none"
                      />
                    </div>
                  )}

                  {pillar.media_type === 'video' && pillar.media_url && (
                    <div className="w-full aspect-[4/3] bg-[#071326] relative overflow-hidden">
                      {pillar.media_url.includes('youtube.com') || pillar.media_url.includes('youtu.be') ? (
                        <iframe
                          src={pillar.media_url}
                          title={pillar.title}
                          className="w-full h-full border-0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        />
                      ) : (
                        <ScrollAutoplayVideo src={pillar.media_url} />
                      )}
                    </div>
                  )}

                  {(!pillar.media_type || pillar.media_type === 'none') && (
                    <div className="w-full aspect-[16/9] bg-gradient-to-br from-[#2d3748] to-[#1a202c] flex items-center justify-center p-6 text-amber-400">
                      <span className="text-6xl transform group-hover:scale-110 transition-transform duration-300">
                        {pillar.icon || '📖'}
                      </span>
                    </div>
                  )}

                  <div className="p-6 sm:p-8 space-y-3">
                    <h3 className="text-xl sm:text-2xl font-bold font-serif text-[#1a202c] tracking-tight leading-snug">
                      {pillar.title}
                    </h3>

                    <p className="text-slate-600 text-sm leading-relaxed line-clamp-3">
                      {cardDescription || 'Click below to read more about this focus area.'}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6 sm:px-8 sm:pb-8 pt-2">
                  <button
                    onClick={() => setSelectedPillar({ ...pillar, desc: cardDescription })}
                    className="bg-[#2d3748] hover:bg-[#1a202c] text-white font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer w-full text-center border border-slate-700 group-hover:border-amber-500"
                  >
                    Find Out More
                  </button>
                </div>
              </div>
            );
          })}
          {visiblePillars.length === 0 && (
            <div className="col-span-full rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
              <p className="text-lg font-bold text-[#10243a]">No matching focus areas found</p>
              <p className="mt-2 text-sm text-slate-500">Try another keyword or clear your search.</p>
              <button onClick={() => setSearchQuery('')} className="mt-4 rounded-lg bg-[#10243a] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#1d3b5b]">Clear search</button>
            </div>
          )}
        </div>
      </section>

      {/* MODAL POPUP */}
      {selectedPillar && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
          onClick={() => setSelectedPillar(null)}
        >
          <div
            className="bg-white border border-stone-200 rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl relative animate-in fade-in zoom-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedPillar(null)}
              className="absolute top-4 right-4 z-30 bg-[#1a202c]/80 text-white hover:bg-[#1a202c] w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition cursor-pointer shadow-lg border border-slate-700"
            >
              ✕
            </button>

            <div className="shrink-0 w-full bg-[#1a202c]">
              {selectedPillar.media_type === 'image' && selectedPillar.media_url && (
                <div className="w-full h-56 sm:h-72 relative overflow-hidden">
                  <img
                    src={selectedPillar.media_url}
                    alt={selectedPillar.title}
                    onContextMenu={preventDownloadContextMenu}
                    className="w-full h-full object-cover object-top select-none pointer-events-none"
                  />
                </div>
              )}

              {selectedPillar.media_type === 'video' && selectedPillar.media_url && (
                <div className="w-full h-56 sm:h-72 relative overflow-hidden">
                  {selectedPillar.media_url.includes('youtube.com') || selectedPillar.media_url.includes('youtu.be') ? (
                    <iframe
                      src={selectedPillar.media_url}
                      title={selectedPillar.title}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <video
                      src={selectedPillar.media_url}
                      controls
                      autoPlay
                      controlsList="nodownload"
                      onContextMenu={preventDownloadContextMenu}
                      className="w-full h-full object-cover"
                    >
                      Your browser does not support the video tag.
                    </video>
                  )}
                </div>
              )}

              {(!selectedPillar.media_type || selectedPillar.media_type === 'none') && (
                <div className="w-full h-36 sm:h-48 bg-gradient-to-br from-[#2d3748] to-[#1a202c] flex items-center justify-center p-6 text-amber-400">
                  <span className="text-6xl sm:text-7xl">{selectedPillar.icon || '📖'}</span>
                </div>
              )}
            </div>

            <div className="p-6 sm:p-8 space-y-4 overflow-y-auto flex-1 text-slate-800">
              <h3 className="text-2xl sm:text-3xl font-bold font-serif text-[#1a202c] tracking-tight leading-snug">
                {selectedPillar.title}
              </h3>

              <div className="w-16 h-1 bg-[#e85d04] rounded-full"></div>

              <div className="text-slate-700 text-sm sm:text-base leading-relaxed space-y-3 whitespace-pre-line">
                {selectedPillar.desc || selectedPillar.description}
              </div>

              {selectedPillar.story_text && (
                <blockquote className="bg-amber-500/10 border-l-4 border-amber-500 p-4 rounded-r-xl text-xs sm:text-sm text-slate-800 italic leading-relaxed my-4">
                  &quot;{selectedPillar.story_text}&quot;
                </blockquote>
              )}
            </div>

            <div className="p-4 sm:px-8 border-t border-stone-200 bg-stone-50 flex justify-end gap-3 shrink-0">
              <button
                onClick={() => setSelectedPillar(null)}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-stone-200 hover:bg-stone-300 text-slate-700 cursor-pointer transition"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const lowerTitle = selectedPillar.title.toLowerCase();
                  let targetPage = selectedPillar.link_page || selectedPillar.id;
                  let targetSectionId = selectedPillar.link_anchor;

                  if (lowerTitle.includes('compar')) {
                    targetPage = 'swab';
                    targetSectionId = 'swab';
                  } else if (lowerTitle.includes('abou')) {
                    targetPage = 'about';
                    targetSectionId = 'professional-journey-vision';
                  } else if (lowerTitle.includes('reflection') || lowerTitle.includes('blog')) {
                    targetPage = 'blog';
                    targetSectionId = 'practice-reflections-blog';
                  } else if (lowerTitle.includes('learning')) {
                    targetPage = 'speaking';
                    targetSectionId = 'core-speaking-training-topics';
                  } else if (lowerTitle.includes('conversation')) {
                    targetPage = 'speaking';
                    targetSectionId = 'speaking';
                  } else if (lowerTitle.includes('publication')) {
                    targetPage = 'publications';
                    targetSectionId = 'publications';
                  } else if (lowerTitle.includes('safeguard')) {
                    targetPage = 'resources';
                    targetSectionId = 'practitioner-tools-downloadable-assets';
                  }
                  
                  handleCrossPageNav(targetPage, targetSectionId);
                }}
                className="px-6 py-2.5 rounded-xl text-xs font-bold bg-[#e85d04] hover:bg-[#dc2f02] text-white uppercase tracking-wider cursor-pointer shadow transition"
              >
                Go to Section &rarr;
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BOTTOM CALL TO ACTION */}
      <section className="bg-[#1a202c] text-white py-14 border-t-4 border-[#e85d04] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="text-center md:text-left space-y-1">
            <h3 className="text-2xl font-serif font-bold text-amber-400">
              Interested in Collaborating with SWAB?
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl">
              Connect with SWAB to explore research partnerships, knowledge exchange, learning events and cross-border collaboration.
            </p>
          </div>
          <button
            onClick={() => handleCrossPageNav('contact')}
            className="bg-[#e85d04] hover:bg-[#dc2f02] text-white px-8 py-3.5 rounded-xl font-extrabold text-xs uppercase tracking-wider transition shadow-lg cursor-pointer whitespace-nowrap active:scale-95"
          >
            Get In Touch
          </button>
        </div>
      </section>

    </div>
  );
}