'use client';

import React, { useState, useEffect, useRef } from 'react';
import { HomePillarCard, HomeHeroData } from '@/src/types/home';
import { sluggifyTitle } from '@/src/lib/stringUtils'; // IMPORTANT IMPORT

interface HomeProps {
  setActivePage: (page: string) => void;
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
    link_page: 'swab', // FIXED: Now correctly points to 'swab' page, not 'blog'
    link_anchor: 'swab', // A clean, standard ID
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
  authorName: 'Nathanael Maradza',
  tagline: 'Social Worker | Author | Speaker | Researcher',
  quote:
    '"My passion lies in connecting practice, research and lived experience across countries to improve outcomes for children, young people and families."',
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
      className="relative w-full max-w-5xl mx-auto h-80 sm:h-[440px] rounded-3xl overflow-hidden shadow-2xl border border-amber-500/30 bg-[#071326] group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Active Slide Image */}
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
          {/* Subtle Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#071326] via-[#071326]/30 to-transparent" />

          {/* Slide Caption Banner */}
          <div className="absolute bottom-0 inset-x-0 p-6 sm:p-8 text-white space-y-1">
            <span className="text-amber-400 font-serif font-bold text-lg sm:text-2xl tracking-wide block drop-shadow">
              {img.title}
            </span>
            <p className="text-slate-200 text-xs sm:text-sm font-light max-w-2xl leading-relaxed">
              {img.caption}
            </p>
          </div>
        </div>
      ))}

      {/* Slide Navigation Arrows */}
      <button
        onClick={() => setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-slate-950/70 hover:bg-slate-900 text-amber-400 w-11 h-11 rounded-full flex items-center justify-center font-bold text-lg transition border border-amber-500/40 shadow-xl cursor-pointer opacity-0 group-hover:opacity-100 active:scale-90"
        aria-label="Previous slide"
      >
        &#10094;
      </button>

      <button
        onClick={() => setCurrentIndex((prev) => (prev + 1) % images.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-slate-950/70 hover:bg-slate-900 text-amber-400 w-11 h-11 rounded-full flex items-center justify-center font-bold text-lg transition border border-amber-500/40 shadow-xl cursor-pointer opacity-0 group-hover:opacity-100 active:scale-90"
        aria-label="Next slide"
      >
        &#10095;
      </button>

      {/* Pagination Indicator Dots */}
      <div className="absolute bottom-5 right-6 z-20 flex gap-2">
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
  // Use state populated with default data
  const [pillars, setPillars] = useState<HomePillarCard[]>(defaultPillars);
  const [hero, setHero] = useState<HomeHeroData>(fallbackHero);
  const [selectedPillar, setSelectedPillar] = useState<HomePillarCard | null>(null);

  // Load dynamic content on mount
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
              // NEW: Ensure link_anchor is sluggified, preventing empty string IDs in fallback or API data
              link_anchor: card.link_anchor || sluggifyTitle(card.title) 
            }));

            // Only show visible pillars
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

  /**
   * Cross-page navigation handler. Sets page state and predicted hash.
   */
  const handleCrossPageNav = (targetPage: string, targetSectionId?: string) => {
    console.log(`Executing navigation - Target Page: ${targetPage}, Scrolling to ID: ${targetSectionId}`);
    setActivePage(targetPage);
    
    // Predice the destination HTML ID. If none provided, default to page slug.
    const strictHash = targetSectionId || targetPage;
    window.location.hash = strictHash;

    // Force Close the modal if open
    setSelectedPillar(null);
  };

  // Extract valid card images for the auto slideshow gallery
  const galleryImages = pillars
    .filter((p) => p.media_type === 'image' && p.media_url)
    .map((p) => ({
      url: p.media_url || '',
      title: p.title,
      caption: p.desc || 'Social Work Across Borders field practice and research exchange.',
    }));

  return (
    <div className="bg-[#f7f4ed] min-h-screen text-slate-800 selection:bg-amber-400 selection:text-slate-950">
      
      {/* HERO SECTION */}
      <section className="bg-[#0b1b36] text-white py-16 sm:py-20 border-b-4 border-amber-500 relative overflow-hidden">
        {/* Subtle Background Glow Accent */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-10 items-center relative z-10">
          
          {/* Left Hero Content */}
          <div className="space-y-6">
            <div className="inline-block px-4 py-1.5 bg-amber-500/20 border border-amber-400/40 text-amber-400 text-xs font-bold tracking-widest uppercase rounded-full shadow-sm">
              {hero.badgeText || fallbackHero.badgeText}
            </div>

            <h1 className="text-4xl lg:text-5xl font-bold font-serif leading-tight text-white tracking-tight">
              {hero.authorName || fallbackHero.authorName}
            </h1>

            <p className="text-amber-400 text-lg font-medium tracking-wide">
              {hero.tagline || fallbackHero.tagline}
            </p>

            <blockquote className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-lg italic border-l-2 border-amber-400/80 pl-4 py-1">
              {hero.quote || fallbackHero.quote}
            </blockquote>

            <div className="flex flex-wrap gap-3 sm:gap-4 pt-2">
              <button
                // Standard biography link
                onClick={() => handleCrossPageNav('about', 'professional-journey-vision')} 
                className="bg-amber-400 text-slate-950 px-6 py-3.5 rounded-xl font-extrabold text-xs sm:text-sm hover:bg-amber-500 active:scale-95 transition-all shadow-lg hover:shadow-amber-500/20 cursor-pointer"
              >
                Read Biography
              </button>
              <button
                // NEW: Robust SWAB link targets the 'swab' page, not 'blog'
                onClick={() => handleCrossPageNav('swab', 'swab')}
                className="border-2 border-amber-400 text-amber-400 px-6 py-3.5 rounded-xl font-extrabold text-xs sm:text-sm hover:bg-amber-400 hover:text-slate-950 active:scale-95 transition-all cursor-pointer"
              >
                Explore SWAB
              </button>
              <button
                onClick={() => handleCrossPageNav('contact')}
                className="bg-slate-900/90 text-white border border-slate-700 px-6 py-3.5 rounded-xl font-extrabold text-xs sm:text-sm hover:bg-slate-800 active:scale-95 transition-all cursor-pointer"
              >
                Contact
              </button>
            </div>
          </div>

          {/* Right Hero Branding Card */}
          <div className="bg-[#071326] p-8 sm:p-10 rounded-3xl border border-amber-500/30 shadow-2xl flex flex-col justify-center items-center text-center hover:border-amber-400/60 transition duration-300 relative group">
            <div className="w-40 h-40 sm:w-52 sm:h-52 flex items-center justify-center shrink-0 mb-4 group-hover:scale-105 transition duration-500">
              <img
                src={hero.logoUrl || fallbackHero.logoUrl}
                alt="Nathanael Maradza Logo"
                onContextMenu={preventDownloadContextMenu}
                className="w-full h-full object-contain select-none pointer-events-none drop-shadow-lg"
              />
            </div>

            <h2 className="text-xl font-bold font-serif text-white tracking-wide">
              {hero.cardTitle || fallbackHero.cardTitle}
            </h2>
            <div className="w-16 h-1 bg-amber-400 my-3 rounded-full"></div>
            <p className="text-amber-400 text-xs uppercase tracking-widest font-semibold mb-3">
              {hero.cardSubtitle || fallbackHero.cardSubtitle}
            </p>
            <p className="text-xs text-slate-300 italic max-w-xs leading-relaxed">
              {hero.cardDescription || fallbackHero.cardDescription}
            </p>
          </div>

        </div>
      </section>

      {/* FEATURED PHOTO SLIDESHOW GALLERY */}
      {galleryImages.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-4">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[#0b1b36] tracking-tight">
              Impact & Fieldwork Gallery
            </h2>
            <div className="w-16 h-1 bg-amber-400 mx-auto my-2.5 rounded-full"></div>
            <p className="text-slate-600 text-xs sm:text-sm">
              Visual highlights from global practice exchanges, keynote talks, and research partnerships.
            </p>
          </div>

          <ImageSlideshow images={galleryImages} />
        </section>
      )}

      {/* CORE PILLARS SECTION - SMOOTH CLASSIC CARDS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold font-serif text-[#0b1b36] mb-3 tracking-tight">
            Focus Areas & Practice Pillars
          </h2>
          <div className="w-20 h-1 bg-amber-400 mx-auto mb-4 rounded-full"></div>
          <p className="text-slate-600 text-sm sm:text-base">
            Bridging international policy, academic research, and grassroots field experience.
          </p>
        </div>

        {/* Responsive Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
          {pillars.map((pillar) => {
            const cardDescription = pillar.desc || (pillar as any).description || '';

            return (
              <div
                key={pillar.id}
                className="bg-white rounded-3xl border border-slate-200/80 shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between overflow-hidden group hover:border-amber-400/50"
              >
                <div>
                  {/* Media Banner Container */}
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
                    <div className="w-full aspect-[16/9] bg-gradient-to-br from-[#0b1b36] to-purple-950 flex items-center justify-center p-6 text-amber-400">
                      <span className="text-6xl transform group-hover:scale-110 transition-transform duration-300">
                        {pillar.icon || '📖'}
                      </span>
                    </div>
                  )}

                  {/* Card Content Body */}
                  <div className="p-6 sm:p-8 space-y-3">
                    <h3 className="text-xl sm:text-2xl font-bold font-serif text-[#0b1b36] tracking-tight leading-snug">
                      {pillar.title}
                    </h3>

                    <p className="text-slate-600 text-sm leading-relaxed line-clamp-3">
                      {cardDescription || 'Click below to read more about this focus area.'}
                    </p>
                  </div>
                </div>

                {/* Action Button Footer */}
                <div className="px-6 pb-6 sm:px-8 sm:pb-8 pt-2">
                  <button
                    onClick={() => setSelectedPillar({ ...pillar, desc: cardDescription })}
                    className="bg-[#0b1b36] hover:bg-[#071326] text-amber-400 font-extrabold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer w-full text-center border border-amber-500/30 group-hover:border-amber-400"
                  >
                    Find Out More
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* POPUP DIALOG / MODAL FOR FULL DETAILS */}
      {selectedPillar && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
          onClick={() => setSelectedPillar(null)}
        >
          <div
            className="bg-white border border-stone-200 rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl relative animate-in fade-in zoom-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedPillar(null)}
              className="absolute top-4 right-4 z-30 bg-[#071326]/80 text-white hover:bg-[#071326] w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition cursor-pointer shadow-lg border border-slate-700"
            >
              ✕
            </button>

            {/* Modal Media Top Aligned */}
            <div className="shrink-0 w-full bg-[#071326]">
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
                <div className="w-full h-36 sm:h-48 bg-gradient-to-br from-[#0b1b36] to-purple-950 flex items-center justify-center p-6 text-amber-400">
                  <span className="text-6xl sm:text-7xl">{selectedPillar.icon || '📖'}</span>
                </div>
              )}
            </div>

            {/* Scrollable Description Section */}
            <div className="p-6 sm:p-8 space-y-4 overflow-y-auto flex-1 text-slate-800">
              <h3 className="text-2xl sm:text-3xl font-bold font-serif text-[#0b1b36] tracking-tight leading-snug">
                {selectedPillar.title}
              </h3>

              <div className="w-16 h-1 bg-amber-400 rounded-full"></div>

              <div className="text-slate-700 text-sm sm:text-base leading-relaxed space-y-3 whitespace-pre-line">
                {selectedPillar.desc || (selectedPillar as any).description}
              </div>

              {selectedPillar.story_text && (
                <blockquote className="bg-amber-500/10 border-l-4 border-amber-400 p-4 rounded-r-xl text-xs sm:text-sm text-slate-800 italic leading-relaxed my-4">
                  "{selectedPillar.story_text}"
                </blockquote>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:px-8 border-t border-stone-200 bg-stone-50 flex justify-end gap-3 shrink-0">
              <button
                onClick={() => setSelectedPillar(null)}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-stone-200 hover:bg-stone-300 text-slate-700 cursor-pointer transition"
              >
                Close
              </button>
              <button
                onClick={() => {
                  // NEW: Strict fuzzy matching logic within the modal footer
                  const lowerTitle = selectedPillar.title.toLowerCase();
                  let targetPage = selectedPillar.link_page || selectedPillar.id;
                  let targetSectionId = selectedPillar.link_anchor;

                  if (lowerTitle.includes('compar')) {
                    // Force navigation to the 'swab' page and ID
                    console.log("Fuzzy match: 'Comparing' identified. Routing to 'swab' page.");
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
                  
                  // Execute navigation using corrected values
                  handleCrossPageNav(targetPage, targetSectionId);
                }}
                className="px-6 py-2.5 rounded-xl text-xs font-bold bg-[#0b1b36] hover:bg-[#071326] text-amber-400 uppercase tracking-wider cursor-pointer shadow transition border border-amber-500/30"
              >
                Go to Section &rarr;
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BOTTOM BANNER CTA SECTION */}
      <section className="bg-[#0b1b36] text-white py-14 border-t-4 border-amber-500 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="text-center md:text-left space-y-1">
            <h3 className="text-2xl font-serif font-bold text-amber-400">
              Interested in Collaboration or Keynote Speaking?
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl">
              Reach out to discuss international panel talks, academic research, or practice exchanges.
            </p>
          </div>
          <button
            onClick={() => handleCrossPageNav('contact')}
            className="bg-amber-400 text-slate-950 px-8 py-3.5 rounded-xl font-extrabold text-xs uppercase tracking-wider hover:bg-amber-500 transition shadow-lg cursor-pointer whitespace-nowrap active:scale-95"
          >
            Get In Touch
          </button>
        </div>
      </section>

    </div>
  );
}