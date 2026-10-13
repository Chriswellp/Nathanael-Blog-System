'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/src/lib/supabaseClient';

interface SpeakingSectionProps {
  setActivePage?: (page: string) => void;
  user?: User | null;
  authLoading?: boolean;
}

interface Booking {
  id?: string;
  name: string;
  email: string; // Used for matching bookings to the logged-in user
  organization?: string;
  event_type: string;
  event_date?: string;
  location?: string;
  message?: string;
  status: 'pending' | 'accepted' | 'confirmed' | 'declined' | string;
  created_at?: string;
}

export default function SpeakingSection({ setActivePage, user, authLoading }: SpeakingSectionProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // --- MODAL & FORM STATE ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [organization, setOrganization] = useState('');
  const [eventType, setEventType] = useState('Keynote');
  const [eventDate, setEventDate] = useState('');
  const [location, setLocation] = useState('');
  const [message, setMessage] = useState('');

  // --- BOOKINGS LIST STATE ---
  const [bookingsList, setBookingsList] = useState<Booking[]>([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(true);
  const [filterConfirmedOnly, setFilterConfirmedOnly] = useState(false);

  // Pre-fill user data if authenticated
  useEffect(() => {
    if (user) {
      if (user.email) setEmail(user.email);
      if (user.user_metadata?.full_name) setName(user.user_metadata.full_name);
    }
  }, [user]);

  // Handle redirect callback (Auto-open modal after login redirect)
  useEffect(() => {
    if (authLoading) return;

    const action = searchParams?.get('action');
    if (action === 'book') {
      if (user) {
        setIsModalOpen(true);
        router.replace('/?page=speaking', { scroll: false });
      } else {
        router.push('/login?redirect=speaking&action=book');
      }
    }
  }, [searchParams, user, authLoading, router]);

  // Request Booking button handler
  const handleRequestBookingClick = () => {
    if (!user) {
      router.push('/login?redirect=speaking&action=book');
    } else {
      setIsModalOpen(true);
    }
  };

  /**
   * Fetch bookings and match them securely to the logged-in user's email address.
   */
  const fetchBookings = useCallback(async () => {
    if (!user || !user.email) {
      setBookingsList([]);
      setIsLoadingBookings(false);
      return;
    }

    setIsLoadingBookings(true);
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
          console.error('Failed to retrieve valid session for booking fetch.');
          setBookingsList([]);
          return;
      }

      const response = await fetch(`/api/bookings?t=${Date.now()}`, { 
        cache: 'no-store',
        headers: { 
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        const allItems: Booking[] = Array.isArray(data) ? data : data.data || [];
        
        // --- EMAIL-BASED MATCHING ---
        // Matches bookings whose email matches the logged-in user's email (case-insensitive)
        const currentUserEmail = user.email.trim().toLowerCase();
        const userBookings = allItems.filter(booking => {
          if (!booking.email) return false;
          return booking.email.trim().toLowerCase() === currentUserEmail;
        });
        
        setBookingsList(userBookings);
      } else {
        console.error('Failed to load bookings API:', response.statusText);
        setBookingsList([]);
      }
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setBookingsList([]);
    } finally {
      setIsLoadingBookings(false);
    }
  }, [user]);

  // Trigger fetch on user state change or mount
  useEffect(() => {
    if (!authLoading) {
        if (user) {
            fetchBookings();
        } else {
            setIsLoadingBookings(false);
        }
    }
  }, [fetchBookings, user, authLoading]);

  // --- SUBMIT HANDLER ---
  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const { data: { session } } = await supabase.auth.getSession();

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session?.access_token || ''}`
        },
        body: JSON.stringify({
          name,
          email,
          organization,
          event_type: eventType,
          event_date: eventDate,
          location,
          message,
          status: 'pending',
        }),
      });

      if (response.ok) {
        setSubmitSuccess(true);
        fetchBookings();

        // Reset form
        setName(user?.user_metadata?.full_name || '');
        setEmail(user?.email || '');
        setOrganization('');
        setEventType('Keynote');
        setEventDate('');
        setLocation('');
        setMessage('');

        const timer = setTimeout(() => {
          setIsModalOpen(false);
          setSubmitSuccess(false);
        }, 3000);

        return () => clearTimeout(timer);
      } else {
        const data = await response.json();
        setErrorMessage(data.error || 'Failed to submit booking request.');
      }
    } catch (err) {
      console.error('Error submitting booking:', err);
      setErrorMessage('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Keynote Topics
  const topics = [
    {
      title: 'Transnational Safeguarding & Child Protection',
      description:
        'Bridging jurisdictional gaps between sub-Saharan African and UK child protection legislation, handling cross-border referrals, and mitigating practice risks.',
      tag: 'Keynote & Panels',
    },
    {
      title: 'Cultural Competence in Diaspora Casework',
      description:
        'Navigating cultural nuances, community child protection mechanisms, and statutory intervention limits when assessing diaspora families.',
      tag: 'Workshops & Training',
    },
    {
      title: 'Decolonizing Social Work Practice',
      description:
        'Integrating indigenous child care frameworks alongside statutory international social work protocols for equitable outcomes.',
      tag: 'Academic Lectures',
    },
  ];

  // Past / Static Engagements Fallback
  const engagements = [
    {
      event: 'International Social Work & Safeguarding Conference',
      role: 'Keynote Speaker',
      location: 'London, UK / Hybrid',
      year: '2026',
    },
    {
      event: 'Sub-Saharan Child Protection Forum',
      role: 'Panel Lead & Presenter',
      location: 'Nairobi, Kenya',
      year: '2025',
    },
    {
      event: 'Cross-Border Family Law & Social Care Symposium',
      role: 'Guest Lecturer',
      location: 'Online Webinar',
      year: '2025',
    },
  ];

  // Filter bookings based on view selection
  const displayedBookings = filterConfirmedOnly
    ? bookingsList.filter((b) => b.status === 'accepted' || b.status === 'confirmed')
    : bookingsList;

  return (
    <section className="bg-slate-100 py-12 sm:py-16 text-slate-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-amber-600 text-xs font-bold tracking-wider uppercase font-sans">
            Keynotes, Panels & Guest Lectures
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold font-serif text-slate-900 mt-1 mb-3">
            Speaking & Training
          </h1>
          <div className="w-20 h-1 bg-amber-400 mx-auto mb-4"></div>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Nathanael Maradza delivers keynote addresses, specialized training, and panel insights on international child protection, cross-border social work, and safeguarding policy.
          </p>
        </div>

        {/* Hero Booking Banner */}
        <div className="bg-slate-950 text-white p-8 sm:p-10 rounded-2xl border border-amber-500/40 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl">
            <span className="bg-amber-400/20 text-amber-400 text-[10px] sm:text-xs font-mono px-3 py-1 rounded border border-amber-400/30 uppercase tracking-wider">
              Booking Enquiries Open
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-amber-400">
              Book Nathanael for Your Next Event or Workshop
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Available for keynotes, university lectures, agency training sessions, and international policy webinars across the UK and Sub-Saharan Africa.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <button
              onClick={handleRequestBookingClick}
              className="bg-amber-400 text-slate-950 px-6 py-3 rounded-lg font-bold text-xs uppercase tracking-wider hover:bg-amber-500 transition shadow text-center whitespace-nowrap active:scale-95 cursor-pointer"
            >
              Request Booking
            </button>

            <a
              href="https://wa.me/447352143182"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-bold text-xs uppercase tracking-wider hover:bg-emerald-700 transition shadow text-center whitespace-nowrap"
            >
              💬 WhatsApp Enquiry
            </a>
          </div>
        </div>

        {/* Schedule Board */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-3 gap-3">
            <div>
              <h2 className="text-2xl font-bold font-serif text-slate-900">
                Your Booking Requests
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm">
                Track the status of your submitted speaking engagement inquiries.
              </p>
            </div>

            {user && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setFilterConfirmedOnly(false)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                    !filterConfirmedOnly
                      ? 'bg-slate-900 text-amber-400'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  All Your Requests ({bookingsList.length})
                </button>
                <button
                  onClick={() => setFilterConfirmedOnly(true)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                    filterConfirmedOnly
                      ? 'bg-emerald-700 text-white'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Confirmed Only (
                  {bookingsList.filter((b) => b.status === 'accepted' || b.status === 'confirmed').length})
                </button>
              </div>
            )}
          </div>

          {!user ? (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-4 shadow-sm">
              <p className="text-sm text-slate-600">Please sign in to view your submitted booking requests and track their status.</p>
              <button
                onClick={() => router.push('/login?redirect=speaking')}
                className="bg-slate-900 text-white px-5 py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider hover:bg-slate-800 transition shadow cursor-pointer"
              >
                Sign In to View
              </button>
            </div>
          ) : isLoadingBookings ? (
            <div className="text-center py-8 text-slate-500 font-mono text-xs">
              Loading your schedule board...
            </div>
          ) : displayedBookings.length === 0 ? (
            <div className="bg-white p-6 rounded-xl border border-slate-200 text-center text-slate-500 text-xs">
              You have no booking records in this view. Click "Request Booking" above to submit an enquiry.
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedBookings.map((item, idx) => {
                const isAccepted = item.status === 'accepted' || item.status === 'confirmed';
                const isDeclined = item.status === 'declined';

                return (
                  <div
                    key={item.id || idx}
                    className={`rounded-xl p-5 transition-all duration-300 flex flex-col justify-between space-y-4 border ${
                      isAccepted
                        ? 'bg-amber-50/60 border-amber-500/80 shadow-md ring-2 ring-amber-400/30'
                        : isDeclined
                        ? 'bg-slate-50 border-slate-200 opacity-60'
                        : 'bg-white border-slate-200 shadow-sm'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold font-mono uppercase bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                          {item.event_type || 'Event'}
                        </span>

                        {isAccepted ? (
                          <span className="bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                            Confirmed Booking
                          </span>
                        ) : isDeclined ? (
                          <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                            Unavailable / Declined
                          </span>
                        ) : (
                          <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping"></span>
                            Pending Review
                          </span>
                        )}
                      </div>

                      <h3 className="font-bold text-slate-900 font-serif text-base leading-snug">
                        {item.organization ? item.organization : item.name}
                      </h3>

                      {item.organization && (
                        <p className="text-xs text-slate-500 font-medium">Requested by: {item.name}</p>
                      )}

                      {item.message && (
                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed bg-slate-100/50 p-2 rounded border border-slate-100 italic">
                          "{item.message}"
                        </p>
                      )}
                    </div>

                    <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-600 font-medium">
                      <span>📍 {item.location || 'TBA'}</span>
                      <span className="font-bold text-slate-900">
                        🗓️ {item.event_date ? new Date(item.event_date).toLocaleDateString() : 'Date TBD'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Topics */}
        <div className="space-y-6">
          <div className="border-b border-slate-200 pb-3">
            <h2 className="text-2xl font-bold font-serif text-slate-900">
              Core Speaking & Training Topics
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm">
              Customizable presentations designed for social care agencies, academic institutions, and international NGOs.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {topics.map((topic, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition"
              >
                <div className="space-y-3">
                  <span className="inline-block bg-amber-100 text-amber-800 text-[10px] font-bold px-2.5 py-0.5 rounded uppercase tracking-wider">
                    {topic.tag}
                  </span>
                  <h3 className="text-lg font-bold font-serif text-slate-900">
                    {topic.title}
                  </h3>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                    {topic.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Engagements */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="border-b border-slate-200 pb-3">
              <h2 className="text-2xl font-bold font-serif text-slate-900">
                Recent Engagements & Conferences
              </h2>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 shadow-sm overflow-hidden">
              {engagements.map((item, idx) => (
                <div key={idx} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50 transition">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base font-serif">
                      {item.event}
                    </h3>
                    <p className="text-xs text-amber-700 font-semibold mt-0.5">
                      {item.role} <span className="text-slate-500 font-normal">{item.location}</span>
                    </p>
                  </div>
                  <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-3 py-1 rounded w-fit sm:w-auto">
                    {item.year}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-3">
              <h2 className="text-2xl font-bold font-serif text-slate-900">
                Event Organizer Resources
              </h2>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold font-serif text-slate-900 text-sm">
                Speaker Kit & Media Assets
              </h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                Download Nathanael's official bio, high-resolution headshots, and event AV requirements.
              </p>

              <div className="space-y-2 pt-2">
                <a
                  href="#"
                  className="block w-full text-center bg-slate-950 text-amber-400 py-2.5 rounded-lg text-xs font-bold hover:bg-slate-900 transition border border-amber-500/30"
                >
                  📄 Download Speaker Bio (PDF)
                </a>
                <a
                  href="#"
                  className="block w-full text-center bg-slate-100 text-slate-700 py-2.5 rounded-lg text-xs font-bold hover:bg-slate-200 transition border border-slate-200"
                >
                  📷 Download Media Headshots
                </a>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Booking Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 sm:p-8 relative border border-slate-200 my-8">
            <button
              onClick={() => setIsModalOpen(false)}
              aria-label="Close booking modal"
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-xl font-bold p-1 rounded-full hover:bg-slate-100 cursor-pointer"
            >
              ✕
            </button>

            <h3 id="modal-title" className="text-2xl font-bold font-serif text-slate-900 mb-1">
              Request Event Booking
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Fill out the details below to submit your event engagement inquiry.
            </p>

            {submitSuccess ? (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl text-center space-y-2">
                <p className="font-bold text-sm">Booking Request Sent!</p>
                <p className="text-xs">
                  Thank you! Your request has been recorded. Nathanael will get back to you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="space-y-4">
                {errorMessage && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
                    {errorMessage}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="booking-name" className="block text-xs font-semibold text-slate-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      id="booking-name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Sarah Jenkins"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                  </div>

                  <div>
                    <label htmlFor="booking-email" className="block text-xs font-semibold text-slate-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      id="booking-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="sarah@agency.org"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="booking-org" className="block text-xs font-semibold text-slate-700 mb-1">
                      Organization / University
                    </label>
                    <input
                      id="booking-org"
                      type="text"
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      placeholder="e.g. Oxford Social Care Forum"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                  </div>

                  <div>
                    <label htmlFor="booking-type" className="block text-xs font-semibold text-slate-700 mb-1">
                      Event Type
                    </label>
                    <select
                      id="booking-type"
                      value={eventType}
                      onChange={(e) => setEventType(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
                    >
                      <option value="Keynote">Keynote Address</option>
                      <option value="Workshop">Workshop / Training</option>
                      <option value="Panel">Panel Discussion</option>
                      <option value="Lecture">Academic Lecture</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="booking-date" className="block text-xs font-semibold text-slate-700 mb-1">
                      Proposed Date
                    </label>
                    <input
                      id="booking-date"
                      type="date"
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                  </div>

                  <div>
                    <label htmlFor="booking-location" className="block text-xs font-semibold text-slate-700 mb-1">
                      Location / Platform
                    </label>
                    <input
                      id="booking-location"
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. London / Online Zoom"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="booking-message" className="block text-xs font-semibold text-slate-700 mb-1">
                    Event Details & Audience *
                  </label>
                  <textarea
                    id="booking-message"
                    required
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Brief description of the event, audience size, and specific topics required..."
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  ></textarea>
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="w-1/2 py-2.5 rounded-lg border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-1/2 py-2.5 rounded-lg bg-amber-400 text-slate-950 text-xs font-bold hover:bg-amber-500 transition disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Booking'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}