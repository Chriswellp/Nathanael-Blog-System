'use client';

import React, { useState } from 'react';

export default function ContactSection() {
  const [submitted, setSubmitted] = useState(false);

  // Fix 1: Explicitly type the event as React.FormEvent
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section className="bg-slate-100 py-12 sm:py-16 text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-amber-600 text-xs font-bold tracking-wider uppercase font-sans">
            Get In Touch
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold font-serif text-slate-900 mt-1 mb-3">
            Contact & Speaking Bookings
          </h1>
          <div className="w-20 h-1 bg-amber-400 mx-auto mb-4"></div>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Reach out for keynote speaking requests, research inquiries, panel discussions, or practice consultations.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Direct Contact Options */}
          <div className="space-y-6">
            <div className="bg-slate-950 text-white p-6 sm:p-8 rounded-2xl border border-amber-500/40 shadow-xl space-y-6">
              <h2 className="text-xl font-bold font-serif text-amber-400 border-b border-slate-800 pb-3">
                Direct Contact
              </h2>

              <div className="space-y-4 text-xs sm:text-sm">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
                    WhatsApp Direct
                  </span>
                  <a
                    href="https://wa.me/447352143182"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-400 hover:underline font-semibold block mt-1"
                  >
                    +44 7352 143182
                  </a>
                </div>

                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
                    Primary Practice
                  </span>
                  <p className="text-slate-200 mt-1 font-medium">
                    Social Work Across Borders (SWAB)
                  </p>
                </div>

                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
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
                  className="block w-full text-center bg-emerald-600 text-white py-3 rounded-lg font-bold text-xs uppercase tracking-wider hover:bg-emerald-700 transition shadow"
                >
                  💬 Chat On WhatsApp
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-sm">
              <h2 className="text-xl sm:text-2xl font-bold font-serif text-slate-900 mb-6">
                Send a Message
              </h2>

              {submitted ? (
                <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-6 rounded-lg text-center space-y-2">
                  <h3 className="font-bold text-lg font-serif">Message Received!</h3>
                  <p className="text-xs sm:text-sm">
                    Thank you for reaching out. Nathanael will respond to your inquiry shortly.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-4 text-xs font-bold text-emerald-700 underline"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="John Doe"
                        className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        placeholder="john@example.com"
                        className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Inquiry Type</label>
                    <select className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white">
                      <option>Keynote Speaking / Panel Engagement</option>
                      <option>Academic Research Collaboration</option>
                      <option>Practice Consultation</option>
                      <option>General Inquiry</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Message *</label>
                    {/* Fix 2: Changed rows="5" to rows={5} */}
                    <textarea
                      rows={5}
                      required
                      placeholder="Please details regarding your request..."
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full sm:w-auto bg-amber-400 text-slate-950 px-8 py-3 rounded-lg font-bold text-xs uppercase tracking-wider hover:bg-amber-500 transition shadow active:scale-95"
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