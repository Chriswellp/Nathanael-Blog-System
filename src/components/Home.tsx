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
  authorName?: string;
  tagline?: string;
  quote?: string;
  logoUrl?: string;
  cardTitle?: string;
  cardSubtitle?: string;
  cardDescription?: string;
}

interface HomeProps {
  setActivePage: (page: string) => void;
}

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

const fallbackHero: HomeHeroData = {
  badgeText: 'Social Work Across Borders (SWAB)',
  authorName: 'Nathanael Maradza',
  tagline: 'Social Worker | Author | Speaker | Researcher',
  quote:
    '"My passion lies in connecting practice, research and lived experience across countries to improve outcomes for children, young people and families."',
  logoUrl: '/logo2.png',
  cardTitle: 'SOCIAL WORK ACROSS BORDERS',
  cardSubtitle: 'Different Countries. Shared Purpose. Better Outcomes for Children and Families.',
  cardDescription: 'Connecting Practice, Research and Lived Experience Across Africa and England.',
};

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

function ImageSlideshow({ images }: { images: { url: string; title: string; caption: string }[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused || images.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused, images.length]);

  if (images.length === 0) return null;

  return (
    <div 
      className="relative w-full max-w-6xl mx-auto h-[380px] sm:h-[480px] rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-[#050b14] group"
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
          <div className="absolute inset-0 bg-gradient-to-t from-[#050b14] via-[#050b14]/40 to-transparent" />

          <div className="absolute bottom-0 inset-x-0 p-6 sm:p-12 text-white space-y-2">
            <span className="text-amber-400 font-serif font-bold text-2xl sm:text-3xl tracking-wide block drop-shadow-md">
              {img.title}
            </span>
            <p className="text-slate-300 text-xs sm:text-sm font-light max-w-2xl leading-relaxed">
              {img.caption}
            </p>
          </div>
        </div>
      ))}

      <button
        onClick={() => setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
        className="absolute left-6 top-1/2 -translate-y-1/2 z-20 bg-slate-900/80 hover:bg-amber-500 text-white hover:text-slate-950 w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition border border-white/20 shadow-xl cursor-pointer opacity-0 group-hover:opacity-100 active:scale-95"
        aria-label="Previous slide"
      >
        &#10094;
      </button>

      <button
        onClick={() => setCurrentIndex((prev) => (prev + 1) % images.length)}
        className="absolute right-6 top-1/2 -translate-y-1/2 z-20 bg-slate-900/80 hover:bg-amber-500 text-white hover:text-slate-950 w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition border border-white/20 shadow-xl cursor-pointer opacity-0 group-hover:opacity-100 active:scale-95"
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

export default function Home({ setActivePage }: HomeProps) {
  const [pillars, setPillars] = useState<HomePillarCard[]>(defaultPillars);
  const [hero, setHero] = useState<HomeHeroData>(fallbackHero);
  const [selectedPillar, setSelectedPillar] = useState<HomePillarCard | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
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
  }, []);

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

  return (
    <div className="bg-[#f8fafc] min-h-screen text-slate-900 selection:bg-amber-400 selection:text-slate-950 font-sans">
      
      {/* ================= HERO SECTION (PREMIUM DARK GRADIENT) ================= */}
      <section className="bg-gradient-to-b from-[#070e18] via-[#0b172a] to-[#0f172a] text-white pt-16 pb-28 relative overflow-hidden">
        {/* Subtle glow effects */}
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14 relative z-10">
          
          {/* FLOATING PREMIUM SEARCH BAR BANNER */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-900 border border-slate-200/80 max-w-4xl mx-auto backdrop-blur-md">
            <div className="flex flex-col md:flex-row gap-3 items-center">
              <div className="relative w-full">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  🔍
                </span>
                <input
                  type="text"
                  placeholder="Search topics, publications, systems, or safeguard tools..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-4 rounded-2xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium transition"
                />
              </div>
              <button
                onClick={() => handleCrossPageNav('blog')}
                className="w-full md:w-auto bg-[#f97316] hover:bg-[#ea580c] text-white px-8 py-4 rounded-2xl font-bold text-sm tracking-wide transition-all shadow-lg shadow-orange-500/20 shrink-0 cursor-pointer active:scale-95"
              >
                Search Portal
              </button>
              <button
                onClick={() => handleCrossPageNav('swab')}
                className="w-full md:w-auto bg-slate-100 hover:bg-slate-200 text-slate-800 px-7 py-4 rounded-2xl font-bold text-sm transition-all shrink-0 cursor-pointer text-center"
              >
                Explore SWAB
              </button>
            </div>
            <div className="mt-4 flex flex-wrap gap-2 text-xs font-medium text-slate-500 items-center pt-2 border-t border-slate-100">
              <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">Trending:</span>
              <button onClick={() => handleCrossPageNav('swab')} className="hover:text-amber-600 transition underline">Cross-Border Policy</button>
              <span>•</span>
              <button onClick={() => handleCrossPageNav('publications')} className="hover:text-amber-600 transition underline">Research Papers</button>
              <span>•</span>
              <button onClick={() => handleCrossPageNav('speaking')} className="hover:text-amber-600 transition underline">Keynote Talks</button>
              <span>•</span>
              <button onClick={() => handleCrossPageNav('resources')} className="hover:text-amber-600 transition underline">Safeguarding</button>
            </div>
          </div>

          {/* HERO CONTENT GRID */}
          <div className="grid md:grid-cols-12 gap-12 items-center max-w-6xl mx-auto pt-6">
            
            <div className="md:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-500/10 border border-amber-400/30 text-amber-400 text-xs font-bold tracking-widest uppercase rounded-full shadow-sm">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                {hero.badgeText || fallbackHero.badgeText}
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-serif leading-[1.1] text-white tracking-tight">
                {hero.authorName || fallbackHero.authorName}
              </h1>

              <p className="text-amber-400 text-lg sm:text-xl font-medium tracking-wide">
                {hero.tagline || fallbackHero.tagline}
              </p>

              <blockquote className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-xl italic border-l-4 border-amber-400 pl-5 py-1 font-light">
                {hero.quote || fallbackHero.quote}
              </blockquote>

              <div className="flex flex-wrap gap-4 pt-4">
                <button
                  onClick={() => handleCrossPageNav('about', 'professional-journey-vision')} 
                  className="bg-[#f97316] hover:bg-[#ea580c] text-white px-8 py-4 rounded-2xl font-bold text-sm tracking-wide shadow-xl shadow-orange-500/20 transition-all active:scale-95 cursor-pointer"
                >
                  Read Full Biography
                </button>
                <button
                  onClick={() => handleCrossPageNav('contact')}
                  className="bg-slate-800/80 hover:bg-slate-800 text-white border border-slate-700 px-8 py-4 rounded-2xl font-bold text-sm tracking-wide transition-all active:scale-95 cursor-pointer backdrop-blur-sm"
                >
                  Get In Touch
                </button>
              </div>
            </div>

            {/* BRAND LOGO CARD */}
            <div className="md:col-span-5 bg-gradient-to-b from-[#111c30] to-[#09101d] p-8 sm:p-10 rounded-3xl border border-slate-800 shadow-2xl flex flex-col justify-center items-center text-center relative group">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent"></div>
              
              <div className="w-40 h-40 sm:w-48 sm:h-48 flex items-center justify-center shrink-0 mb-6 group-hover:scale-105 transition duration-500">
                <img
                  src={hero.logoUrl || fallbackHero.logoUrl}
                  alt="Nathanael Maradza Logo"
                  onContextMenu={preventDownloadContextMenu}
                  className="w-full h-full object-contain select-none pointer-events-none drop-shadow-2xl"
                />
              </div>

              <h2 className="text-xl font-bold font-serif text-white tracking-wide">
                {hero.cardTitle || fallbackHero.cardTitle}
              </h2>
              <div className="w-12 h-1 bg-amber-400 my-3 rounded-full"></div>
              <p className="text-amber-400 text-[11px] uppercase tracking-widest font-bold mb-3">
                {hero.cardSubtitle || fallbackHero.cardSubtitle}
              </p>
              <p className="text-xs text-slate-300 italic max-w-xs leading-relaxed">
                {hero.cardDescription || fallbackHero.cardDescription}
              </p>
            </div>

          </div>

          {/* STATS BAR */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-10 max-w-5xl mx-auto border-t border-slate-800 text-center">
            <div className="space-y-1">
              <span className="text-3xl font-extrabold text-amber-400">10+</span>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Years Experience</p>
            </div>
            <div className="space-y-1">
              <span className="text-3xl font-extrabold text-amber-400">2 Regions</span>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Africa & England</p>
            </div>
            <div className="space-y-1">
              <span className="text-3xl font-extrabold text-amber-400">100%</span>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Child-Centered</p>
            </div>
            <div className="space-y-1">
              <span className="text-3xl font-extrabold text-amber-400">Global</span>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Impact & Exchange</p>
            </div>
          </div>

        </div>
      </section>

      {/* ================= 3-COLUMN STRUCTURED NAVIGATION CARDS ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20 mb-20">
        <div className="grid md:grid-cols-3 gap-8">
          
          <div className="bg-[#111c30] text-white p-8 rounded-3xl shadow-xl flex flex-col justify-between border border-slate-800 hover:border-amber-500/50 transition duration-300">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-amber-400 block mb-3">Practice & Research</span>
              <h3 className="text-2xl font-bold font-serif mb-4 leading-snug">Academic Research & Policy Analysis</h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-8">
                Evidence-based studies, comparative cross-border policy analysis, and statutory frameworks evaluation.
              </p>
            </div>
            <button
              onClick={() => handleCrossPageNav('publications')}
              className="w-full bg-[#f97316] hover:bg-[#ea580c] text-white py-4 rounded-2xl font-bold text-xs uppercase tracking-wider transition cursor-pointer text-center shadow-md"
            >
              Explore Publications &rarr;
            </button>
          </div>

          <div className="bg-white text-slate-900 p-8 rounded-3xl shadow-xl flex flex-col justify-between border border-slate-200 hover:border-amber-500/50 transition duration-300">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#f97316] block mb-3">Keynote Talks</span>
              <h3 className="text-2xl font-bold font-serif mb-4 leading-snug">Public Speaking & Guest Lectures</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-8">
                Interactive international panels, training workshops, and guest lectures on systemic safeguarding.
              </p>
            </div>
            <button
              onClick={() => handleCrossPageNav('speaking')}
              className="w-full bg-slate-100 hover:bg-slate-900 hover:text-white text-slate-800 py-4 rounded-2xl font-bold text-xs uppercase tracking-wider transition cursor-pointer text-center"
            >
              Book Keynote Talk &rarr;
            </button>
          </div>

          <div className="bg-white text-slate-900 p-8 rounded-3xl shadow-xl flex flex-col justify-between border border-slate-200 hover:border-amber-500/50 transition duration-300">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#f97316] block mb-3">SWAB Network</span>
              <h3 className="text-2xl font-bold font-serif mb-4 leading-snug">Social Work Across Borders</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-8">
                Connecting global practitioners, researchers, and lived experience to improve outcomes for children.
              </p>
            </div>
            <button
              onClick={() => handleCrossPageNav('swab')}
              className="w-full bg-[#0b172a] hover:bg-slate-800 text-white py-4 rounded-2xl font-bold text-xs uppercase tracking-wider transition cursor-pointer text-center"
            >
              Learn About SWAB &rarr;
            </button>
          </div>

        </div>
      </section>

      {/* ================= FEATURED PHOTO SLIDESHOW GALLERY ================= */}
      {galleryImages.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 mb-16">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-3xl font-bold font-serif text-slate-900 tracking-tight">
              Impact & Fieldwork Gallery
            </h2>
            <div className="w-16 h-1 bg-[#f97316] mx-auto my-3 rounded-full"></div>
            <p className="text-slate-600 text-sm">
              Visual highlights from global practice exchanges, keynote talks, and research partnerships.
            </p>
          </div>

          <ImageSlideshow images={galleryImages} />
        </section>
      )}

      {/* ================= CORE PILLARS SECTION ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 mb-20">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold font-serif text-slate-900 mb-4 tracking-tight">
            Focus Areas & Practice Pillars
          </h2>
          <div className="w-20 h-1 bg-[#f97316] mx-auto mb-4 rounded-full"></div>
          <p className="text-slate-600 text-base">
            Bridging international policy, academic research, and grassroots field experience.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pillars.map((pillar) => {
            const cardDescription = pillar.desc || pillar.description || '';

            return (
              <div
                key={pillar.id}
                className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between overflow-hidden group"
              >
                <div>
                  {pillar.media_type === 'image' && pillar.media_url && (
                    <div className="w-full aspect-[16/10] bg-[#071326] relative overflow-hidden">
                      <img
                        src={pillar.media_url}
                        alt={pillar.title}
                        onContextMenu={preventDownloadContextMenu}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500 select-none pointer-events-none"
                      />
                    </div>
                  )}

                  {pillar.media_type === 'video' && pillar.media_url && (
                    <div className="w-full aspect-[16/10] bg-[#071326] relative overflow-hidden">
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
                    <div className="w-full aspect-[16/9] bg-gradient-to-br from-[#0b172a] to-[#1e293b] flex items-center justify-center p-6 text-amber-400">
                      <span className="text-6xl transform group-hover:scale-110 transition-transform duration-300">
                        {pillar.icon || '📖'}
                      </span>
                    </div>
                  )}

                  <div className="p-8 space-y-3">
                    <h3 className="text-xl sm:text-2xl font-bold font-serif text-slate-900 tracking-tight leading-snug">
                      {pillar.title}
                    </h3>

                    <p className="text-slate-600 text-sm leading-relaxed line-clamp-3">
                      {cardDescription || 'Click below to read more about this focus area.'}
                    </p>
                  </div>
                </div>

                <div className="px-8 pb-8 pt-2">
                  <button
                    onClick={() => setSelectedPillar({ ...pillar, desc: cardDescription })}
                    className="bg-slate-100 hover:bg-[#0b172a] hover:text-white text-slate-800 font-bold text-xs uppercase tracking-wider px-6 py-4 rounded-2xl transition-all shadow-sm active:scale-95 cursor-pointer w-full text-center border border-slate-200"
                  >
                    Find Out More &rarr;
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ================= MODAL POPUP ================= */}
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
              className="absolute top-4 right-4 z-30 bg-slate-900/80 text-white hover:bg-slate-900 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition cursor-pointer shadow-lg border border-slate-700"
            >
              ✕
            </button>

            <div className="shrink-0 w-full bg-[#0b172a]">
              {selectedPillar.media_type === 'image' && selectedPillar.media_url && (
                <div className="w-full h-64 sm:h-72 relative overflow-hidden">
                  <img
                    src={selectedPillar.media_url}
                    alt={selectedPillar.title}
                    onContextMenu={preventDownloadContextMenu}
                    className="w-full h-full object-cover object-top select-none pointer-events-none"
                  />
                </div>
              )}

              {selectedPillar.media_type === 'video' && selectedPillar.media_url && (
                <div className="w-full h-64 sm:h-72 relative overflow-hidden">
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
                <div className="w-full h-40 sm:h-48 bg-gradient-to-br from-[#0b172a] to-[#1e293b] flex items-center justify-center p-6 text-amber-400">
                  <span className="text-6xl sm:text-7xl">{selectedPillar.icon || '📖'}</span>
                </div>
              )}
            </div>

            <div className="p-6 sm:p-8 space-y-4 overflow-y-auto flex-1 text-slate-800">
              <h3 className="text-2xl sm:text-3xl font-bold font-serif text-slate-900 tracking-tight leading-snug">
                {selectedPillar.title}
              </h3>

              <div className="w-16 h-1 bg-[#f97316] rounded-full"></div>

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
                className="px-6 py-3 rounded-2xl text-xs font-bold bg-stone-200 hover:bg-stone-300 text-slate-700 cursor-pointer transition"
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
                className="px-8 py-3 rounded-2xl text-xs font-bold bg-[#f97316] hover:bg-[#ea580c] text-white uppercase tracking-wider cursor-pointer shadow-lg transition"
              >
                Go to Section &rarr;
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= BOTTOM CALL TO ACTION ================= */}
      <section className="bg-[#070e18] text-white py-16 border-t border-slate-800 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
          <div className="text-center md:text-left space-y-2">
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-amber-400">
              Interested in Collaboration or Keynote Speaking?
            </h3>
            <p className="text-slate-300 text-sm max-w-2xl">
              Reach out to discuss international panel talks, academic research, or cross-border practice exchanges.
            </p>
          </div>
          <button
            onClick={() => handleCrossPageNav('contact')}
            className="bg-[#f97316] hover:bg-[#ea580c] text-white px-9 py-4 rounded-2xl font-bold text-xs uppercase tracking-wider transition shadow-xl shadow-orange-500/20 cursor-pointer whitespace-nowrap active:scale-95"
          >
            Get In Touch Today
          </button>
        </div>
      </section>

    </div>
  );
}