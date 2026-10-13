'use client';

import React from 'react';
import { sluggifyTitle } from '@/src/lib/stringUtils'; // IMPORTANT IMPORT

// Custom modern SVGs intended to look like Lucide icons
const LinkedInIcon = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`lucide lucide-linkedin ${className}`}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" />
  </svg>
);

const WhatsAppIcon = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`lucide lucide-message-circle ${className}`}>
    <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" />
  </svg>
);

const TwitterXIcon = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`lucide lucide-twitter ${className}`}>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const FacebookIcon = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`lucide lucide-facebook ${className}`}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const TikTokIcon = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`lucide lucide-music ${className}`}>
    <path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />
  </svg>
);

const InstagramIcon = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`lucide lucide-instagram ${className}`}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.51" />
  </svg>
);

const DefaultIcon = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`lucide lucide-globe ${className}`}>
    <circle cx="12" cy="12" r="10" /><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" /><path d="M2 12h20" />
  </svg>
);

/**
 * Helper function to render specific custom SVG based on platform name
 */
const renderSocialIcon = (platform: string, className: string) => {
  switch (platform) {
    case 'linkedin': return <LinkedInIcon className={className} />;
    case 'whatsapp': return <WhatsAppIcon className={className} />;
    case 'twitter': return <TwitterXIcon className={className} />;
    case 'facebook': return <FacebookIcon className={className} />;
    case 'tiktok': return <TikTokIcon className={className} />;
    case 'instagram': return <InstagramIcon className={className} />;
    default: return <DefaultIcon className={className} />;
  }
};

export default function AboutSection({
  setActivePage
}: {
  setActivePage: (page: string) => void;
}) {
  const qualifications = [
    {
      title: "Practice & Fieldwork",
      desc: "Extensive experience working across children and families safeguarding, early intervention, and community-based social work.",
    },
    {
      title: "Cross-Border Practice",
      desc: "Specialized focus on bridging social work frameworks, comparative policy, and system exchange between Africa and England.",
    },
    {
      title: "Research & Academic Inquiry",
      desc: "Authoring evidence-based articles, comparative policy analyses, and reflections that inform practice and policy outcomes.",
    },
  ];

  // Configure your social links here. Leave as empty string ('') if you don't use a platform.
  const socialLinks = {
    linkedin: 'https://www.linkedin.com/in/nathanael-maradza/',
    whatsapp: 'https://wa.me/+447352143182',
    twitter: 'https://twitter.com/nathmaradza',
    facebook: 'https://www.facebook.com/NathanaelMaradzaSW/',
    tiktok: 'https://www.tiktok.com/@swacrossborders',
    instagram: 'https://www.instagram.com/swacrossborders/',
  };

  return (
    // FIX: Apply the main page ID and scroll-margin-top for navbar clearance
    <section id="about" className="bg-slate-100 py-12 sm:py-16 text-slate-800 border-t border-slate-200 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-amber-600 text-xs font-bold tracking-wider uppercase font-sans">
            Biography & Core Practice
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold font-serif text-slate-900 mt-1 mb-3">
            About Nathanael Maradza
          </h2>
          <div className="w-20 h-1 bg-amber-400 mx-auto mb-4"></div>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Social Worker, Author, Speaker, and Researcher dedicated to improving outcomes for children, young people, and families through cross-border collaboration and evidence-based practice.
          </p>
        </div>

        {/* Content Layout Grid */}
        <div className="grid lg:grid-cols-3 gap-8 items-start">

          {/* Main Biography Narrative (2 Columns) */}
          <div className="lg:col-span-2 space-y-6">
            <div
              // IMPORTANT FIX: Generate ID for "Biography" deep-linking
              id="professional-journey-vision"
              className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-sm space-y-4 scroll-mt-24"
            >
              <h3 className="text-xl sm:text-2xl font-bold font-serif text-slate-900 border-b border-amber-400/30 pb-3">
                Professional Journey & Vision
              </h3>
              <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
                Nathanael Maradza is a qualified Social Worker, Researcher, and Speaker whose work centers on bridging international practice models, legislative frameworks, and lived experiences.
              </p>
              <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
                With a deep commitment to safeguarding children and strengthening family resilience, Nathanael founded <strong className="text-slate-900">Social Work Across Borders (SWAB)</strong>. The platform promotes global learning exchanges, critical reflections, and comparative policy analysis to inform better frontline practice across different jurisdictions—particularly between Africa and the United Kingdom.
              </p>
              <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
                Through keynote talks, published articles, and collaborative research, he advocates for child-centered practice, culturally competent interventions, and cross-border cooperation in safeguarding.
              </p>
            </div>

            {/* Quick Pillars Grid */}
            <div className="grid sm:grid-cols-3 gap-4">
              {qualifications.map((qual, idx) => {
                // IMPORTANT UPDATE: Generate Safe IDs for Subsections dynamically
                const safeSubsectionId = sluggifyTitle(qual.title);

                return (
                  <div
                    key={idx}
                    // IMPORTANT FIX: Apply Generated ID (and scroll-mt-24 for offset)
                    id={safeSubsectionId}
                    className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm hover:border-amber-400 transition scroll-mt-24"
                  >
                    <h4 className="font-bold text-slate-900 text-sm mb-2 font-serif text-amber-700">
                      {qual.title}
                    </h4>
                    <p className="text-slate-600 text-xs leading-relaxed">
                      {qual.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Info & Social CTA Card (1 Column) */}
          <div className="space-y-6 lg:sticky lg:top-28">
            <div className="bg-slate-950 text-white p-6 rounded-2xl border border-amber-500/40 shadow-xl space-y-6 flex flex-col items-center">

              {/* Profile/Logo Section with Center Alignment */}
              <div className="text-center w-full flex flex-col items-center">
                {/* Responsive Logo Container */}
                <div className="relative w-20 h-20 sm:w-24 h-24 lg:w-28 h-28 flex items-center justify-center shrink-0 mx-auto mb-4">
                  <img
                    src="/logo1.png"
                    alt="Nathanael Maradza Logo"
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow"
                  />
                </div>

                <h3 className="text-xl font-bold font-serif text-white">Nathanael Maradza</h3>
                <p className="text-amber-400 text-xs uppercase tracking-wider font-semibold mt-0.5">
                  Social Work Across Borders
                </p>
              </div>

              {/* Enhanced Social Links Section */}
              <div className="pt-4 border-t border-slate-800 space-y-3 w-full">
                <h4 className="text-slate-400 text-xs font-bold tracking-wider uppercase text-center">Connect & Follow</h4>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {Object.entries(socialLinks).map(([platform, url]) => (
                    url && (
                      <a
                        key={platform}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-slate-800 p-2 rounded border border-slate-700 hover:border-amber-400 transition flex flex-col items-center justify-center gap-1.5 active:scale-95 text-center group"
                        title={`Follow on ${platform}`}
                      >
                        {/* Render SVG with specific styling */}
                        {renderSocialIcon(platform, "w-5 h-5 text-amber-400 group-hover:text-amber-300 transition-colors")}
                        <span className="font-medium text-slate-200 capitalize text-[10px] tracking-wide">{platform}</span>
                      </a>
                    )
                  ))}
                </div>
              </div>

              {/* Role Details */}
              <div className="border-t border-slate-800 pt-5 space-y-3 text-xs w-full">
                <div className="flex flex-col items-center text-center">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider mb-1">Role</span>
                  <span className="text-slate-200 font-medium leading-relaxed">Social Worker | Researcher | Author</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider mb-1">Focus Areas</span>
                  <span className="text-slate-200 font-medium leading-relaxed">Child Protection, Safeguarding, System Comparison</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider mb-1">Regions</span>
                  <span className="text-slate-200 font-medium leading-relaxed">Africa & United Kingdom</span>
                </div>
              </div>

              {/* CTA Button */}
              <div className="pt-2 w-full">
                <button
                  onClick={() => setActivePage('contact')}
                  className="w-full bg-amber-400 text-slate-950 py-3 rounded-lg font-bold text-xs uppercase tracking-wider hover:bg-amber-500 active:scale-95 transition shadow-md"
                >
                  Contact for Speaking / Media
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}