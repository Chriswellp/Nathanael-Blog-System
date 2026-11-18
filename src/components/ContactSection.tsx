
'use client';

import React, { useState } from 'react';
import { supabase } from '@/src/lib/supabaseClient';

type SubmissionStatus = 'success' | 'partial' | null;

export default function ContactSection() {
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<SubmissionStatus>(null);
  const [errorMessage, setErrorMessage] = useState('');

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (submitting) return;

    setSubmitting(true);
    setErrorMessage('');
    setStatus(null);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const payload = {
      fullName: String(formData.get('fullName') || '').trim(),
      email: String(formData.get('email') || '').trim(),
      inquiryType: String(formData.get('inquiryType') || ''),
      message: String(formData.get('message') || '').trim(),
      website: String(formData.get('website') || ''),
    };

    try {
      const { data, error } = await supabase.functions.invoke(
        'send-contact-email',
        {
          body: payload,
        }
      );

      if (error) {
        console.error('Contact submission error:', error);
        throw new Error(
          'We could not submit your enquiry. Please try again or contact us through WhatsApp.'
        );
      }

      if (data?.saved && data?.emailSent) {
        setStatus('success');
        form.reset();
      } else if (data?.saved && !data?.emailSent) {
        setStatus('partial');
        form.reset();
      } else {
        throw new Error(
          data?.error || 'Your enquiry could not be submitted. Please try again.'
        );
      }
    } catch (error) {
      console.error('Contact form error:', error);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Something went wrong. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="bg-slate-100 py-12 sm:py-20 text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-14">

        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-amber-600 text-xs font-bold tracking-widest uppercase font-mono">
            Get In Touch
          </span>

          <h1 className="text-3xl sm:text-5xl font-bold font-serif text-slate-950 tracking-tight">
            Contact & Speaking Bookings
          </h1>

          <div className="w-20 h-1.5 bg-amber-400 mx-auto rounded-full" />

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Reach out for keynote speaking requests, research inquiries,
            panel discussions, or professional practice consultations.
          </p>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          {/* Left Column */}
          <div className="space-y-6 order-2 lg:order-1">

            {/* Direct Info Card */}
            <div className="bg-slate-950 text-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-amber-500/30 shadow-xl space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-36 h-36 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

              <h2 className="text-lg sm:text-xl font-bold font-serif text-amber-400 border-b border-slate-800 pb-3">
                Direct Contact
              </h2>

              <div className="space-y-4 text-xs sm:text-sm">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-mono tracking-widest font-bold">
                    Email Enquiries
                  </span>
                  <a
                    href="mailto:infor@socialworkeracrossborders.co.uk"
                    className="text-amber-400 hover:underline font-semibold block mt-1 break-all"
                  >
                    infor@socialworkeracrossborders.co.uk
                  </a>
                </div>

                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-mono tracking-widest font-bold">
                    WhatsApp Direct
                  </span>
                  <a
                    href="https://wa.me/447352143182"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-400 hover:underline font-semibold block mt-1 font-mono text-sm sm:text-base"
                  >
                    +44 7352 143182
                  </a>
                </div>

                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-mono tracking-widest font-bold">
                    Organisation
                  </span>
                  <p className="text-slate-200 mt-1 font-medium">
                    Social Work Across Borders (SWAB)
                  </p>
                </div>

                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-mono tracking-widest font-bold">
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
                  className="block w-full text-center bg-emerald-500 hover:bg-emerald-600 text-slate-950 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition shadow-md active:scale-95"
                >
                  💬 Chat On WhatsApp
                </a>
              </div>
            </div>

            {/* Social Links Card */}
            <div className="bg-white p-6 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm space-y-4">
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
                    className={`flex flex-col items-center justify-center p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 transition-all duration-200 ${s.color} hover:text-white hover:scale-105 group shadow-xs`}
                  >
                    <span className="text-lg mb-1 group-hover:scale-110 transition">
                      {s.icon}
                    </span>
                    <span className="text-[10px] font-semibold tracking-tight">
                      {s.name}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            <div className="bg-white p-6 sm:p-10 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-lg">

              <h2 className="text-2xl font-bold font-serif text-slate-950 mb-6">
                Send a Message
              </h2>

              {status === 'success' ? (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-8 rounded-2xl text-center space-y-3">
                  <span className="text-3xl">✨</span>

                  <h3 className="font-bold text-lg font-serif">
                    Message Successfully Sent!
                  </h3>

                  <p className="text-xs sm:text-sm text-emerald-700 max-w-md mx-auto">
                    Thank you for contacting Social Work Across Borders.
                    Your enquiry has been securely recorded and an email
                    notification has been sent to our team. We will review
                    your message and respond as soon as possible.
                  </p>

                  <button
                    type="button"
                    onClick={() => setStatus(null)}
                    className="mt-2 inline-block text-xs font-bold text-emerald-800 underline cursor-pointer"
                  >
                    Send another message
                  </button>
                </div>
              ) : status === 'partial' ? (
                <div className="bg-amber-50 border border-amber-200 text-amber-950 p-8 rounded-2xl text-center space-y-3">
                  <span className="text-3xl">⚠️</span>

                  <h3 className="font-bold text-lg font-serif">
                    Your Enquiry Has Been Saved
                  </h3>

                  <p className="text-xs sm:text-sm text-amber-800 max-w-md mx-auto">
                    Your message has been securely recorded, but our email
                    notification service could not send the notification.
                    Your enquiry has not been lost. You can also contact us
                    directly by email or WhatsApp.
                  </p>

                  <button
                    type="button"
                    onClick={() => setStatus(null)}
                    className="mt-2 inline-block text-xs font-bold text-amber-900 underline cursor-pointer"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="space-y-4 sm:space-y-5 text-xs sm:text-sm"
                >
                  {/* Honeypot field: keep hidden from real visitors */}
                  <div
                    aria-hidden="true"
                    className="absolute -left-[9999px] w-px h-px overflow-hidden"
                  >
                    <label htmlFor="contact-website">
                      Leave this field empty
                    </label>
                    <input
                      id="contact-website"
                      type="text"
                      name="website"
                      tabIndex={-1}
                      autoComplete="off"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label
                        htmlFor="contact-full-name"
                        className="block text-slate-700 font-bold uppercase text-[10px] tracking-widest font-mono"
                      >
                        Full Name *
                      </label>

                      <input
                        id="contact-full-name"
                        name="fullName"
                        type="text"
                        required
                        maxLength={120}
                        autoComplete="name"
                        placeholder="John Doe"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition text-slate-900"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label
                        htmlFor="contact-email"
                        className="block text-slate-700 font-bold uppercase text-[10px] tracking-widest font-mono"
                      >
                        Email Address *
                      </label>

                      <input
                        id="contact-email"
                        name="email"
                        type="email"
                        required
                        maxLength={254}
                        autoComplete="email"
                        placeholder="john@example.com"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition text-slate-900"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label
                      htmlFor="contact-inquiry-type"
                      className="block text-slate-700 font-bold uppercase text-[10px] tracking-widest font-mono"
                    >
                      Inquiry Type
                    </label>

                    <select
                      id="contact-inquiry-type"
                      name="inquiryType"
                      required
                      defaultValue="Keynote Speaking / Panel Engagement"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition text-slate-900 cursor-pointer"
                    >
                      <option>Keynote Speaking / Panel Engagement</option>
                      <option>Academic Research Collaboration</option>
                      <option>Practice Consultation</option>
                      <option>General Inquiry</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label
                      htmlFor="contact-message"
                      className="block text-slate-700 font-bold uppercase text-[10px] tracking-widest font-mono"
                    >
                      Message *
                    </label>

                    <textarea
                      id="contact-message"
                      name="message"
                      rows={5}
                      required
                      maxLength={5000}
                      placeholder="Please provide details regarding your request..."
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition text-slate-900 resize-y"
                    />
                  </div>

                  {errorMessage && (
                    <div
                      role="alert"
                      className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-xs sm:text-sm"
                    >
                      {errorMessage}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full sm:w-auto bg-amber-400 hover:bg-amber-500 disabled:bg-amber-200 disabled:cursor-not-allowed text-slate-950 px-8 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition shadow-md active:scale-95 cursor-pointer"
                  >
                    {submitting ? 'Sending Message...' : 'Send Message'}
                  </button>

                  <p className="text-[11px] text-slate-500">
                    Your details will only be used to respond to your enquiry.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
