'use client';

import React, { useState } from 'react';

export default function ContactSection() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const socialLinks = [
    {
      name: 'LinkedIn',
      url: 'https://linkedin.com',
      icon: '💼',
      color: 'hover:bg-blue-600 hover:border-blue-600',
    },
    {
      name: 'WhatsApp',
      url: 'https://wa.me/447352143182',
      icon: '💬',
      color: 'hover:bg-emerald-600 hover:border-emerald-600',
    },
    {
      name: 'Facebook',
      url: 'https://facebook.com',
      icon: '👥',
      color: 'hover:bg-indigo-600 hover:border-indigo-600',
    },
    {
      name: 'TikTok',
      url: 'https://tiktok.com',
      icon: '🎬',
      color: 'hover:bg-slate-900 hover:border-slate-900 hover:text-white',
    },
    {
      name: 'X (Twitter)',
      url: 'https://twitter.com',
      icon: '🗲',
      color: 'hover:bg-sky-500 hover:border-sky-500',
    },
    {
      name: 'Instagram',
      url: 'https://instagram.com',
      icon: '📸',
      color: 'hover:bg-pink-600 hover:border-pink-600',
    },
  ];

  return (
    <section className="bg-slate-50 py-16 sm:py-24 text-slate-900 selection:bg-amber-400 selection:text-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-amber-600 text-xs font-bold tracking-widest uppercase font-mono">
            Get In Touch
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold font-serif text-slate-950 tracking-tight">
            Contact & Speaking Bookings
          </h1>
          <div className="w-24 h-1.5 bg-amber-400 mx-auto rounded-full" />
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed pt-2">
            Reach out for keynote speaking requests, research inquiries, panel discussions, or professional practice consultations.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          
          {/* Left Column: Direct Info & Social Channels */}
          <div className="space-y-6">
            <div className="bg-slate-950 text-white p-6 sm:p-8 rounded-3xl border border-amber-500/30 shadow-2xl space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

              <h2 className="text-xl font-bold font-serif text-amber-400 border-b border-slate-800 pb-4">
                Direct Contact
              </h2>

              <div className="space-y-5 text-xs sm:text-sm">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-mono tracking-widest font-semibold">
                    WhatsApp Direct
                  </span>
                  <a
                    href="https://wa.me/447352143182"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-400 hover:underline font-semibold block mt-1 text-sm sm:text-base font-mono"
                  >
                    +44 7352 143182
                  </a>
                </div>

                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-mono tracking-widest font-semibold">
                    Primary Practice
                  </span>
                  <p className="text-slate-200 mt-1 font-medium">
                    Social Work Across Borders (SWAB)
                  </p>
                </div>

                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-mono tracking-widest font-semibold">
                    Regions Served
                  </span>
                  <p className="text-slate-200 mt-1 font-medium">
                    United Kingdom & Sub-Saharan Africa
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href="https://wa.me/447352143182"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center bg-emerald-500 hover:bg-emerald-600 text-slate-950 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
                >
                  💬 Chat On WhatsApp
                </a>
              </div>
            </div>

            {/* Social Media Connect Box */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xl space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-900 font-mono">
                Connect on Socials
              </h3>
              <div className="grid grid-cols-3 gap-2.5">
                {socialLinks.map((s) => (
                  <a
                    key={s.name}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-700 transition-all duration-300 ${s.color} hover:text-white hover:scale-105 group shadow-sm`}
                  >
                    <span className="text-xl mb-1 group-hover:scale-110 transition">{s.icon}</span>
                    <span className="text-[10px] font-semibold tracking-tight">{s.name}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-2xl relative">
              <h2 className="text-2xl font-bold font-serif text-slate-950 mb-6">
                Send a Message
              </h2>

              {submitted ? (
                <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 p-8 rounded-2xl text-center space-y-3 animate-in fade-in duration-300">
                  <span className="text-4xl">✨</span>
                  <h3 className="font-bold text-xl font-serif">Message Received!</h3>
                  <p className="text-xs sm:text-sm text-emerald-700 max-w-md mx-auto">
                    Thank you for reaching out. Nathanael will review your inquiry and respond shortly.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="mt-2 inline-block text-xs font-bold text-emerald-800 underline cursor-pointer hover:text-emerald-950"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5 text-xs sm:text-sm">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="block text-slate-700 font-bold uppercase text-[10px] tracking-widest font-mono">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="John Doe"
                        className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-slate-700 font-bold uppercase text-[10px] tracking-widest font-mono">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="john@example.com"
                        className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-slate-700 font-bold uppercase text-[10px] tracking-widest font-mono">
                      Inquiry Type
                    </label>
                    <select className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition cursor-pointer">
                      <option>Keynote Speaking / Panel Engagement</option>
                      <option>Academic Research Collaboration</option>
                      <option>Practice Consultation</option>
                      <option>General Inquiry</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-slate-700 font-bold uppercase text-[10px] tracking-widest font-mono">
                      Message *
                    </label>
                    <textarea
                      rows={5}
                      required
                      placeholder="Please provide details regarding your request..."
                      className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition resize-y"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full sm:w-auto bg-amber-400 hover:bg-amber-500 text-slate-950 px-8 py-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-amber-400/20 active:scale-95 cursor-pointer"
                  >
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
