"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { User } from "@supabase/supabase-js";
import {
  ArrowRight,
  GraduationCap,
  Mic2,
  Users,
  Building2,
  Globe2,
  ShieldCheck,
  HeartHandshake,
  Lightbulb,
  CalendarDays,
  MapPin,
  CheckCircle2,
  Clock3,
  X,
  Send,
  Sparkles,
  Presentation,
  BookOpen,
  BriefcaseBusiness,
} from "lucide-react";
import { supabase } from "@/src/lib/supabaseClient";

interface SpeakingSectionProps {
  setActivePage?: (page: string) => void;
  activeSection?: string;
  user?: User | null;
  authLoading?: boolean;
}

interface Booking {
  id?: string;
  name: string;
  email: string;
  organization?: string;
  event_type: string;
  event_date?: string;
  location?: string;
  message?: string;
  status: "pending" | "accepted" | "confirmed" | "declined" | string;
  created_at?: string;
}

const engagementFormats = [
  {
    icon: Mic2,
    title: "Keynote Speaking",
    text: "SWAB offers keynote presentations for conferences, professional forums, workforce development events and social work gatherings. Presentations combine practice experience, research, international perspectives and real-world learning to inspire discussion and strengthen professional understanding.",
    id: "keynote-speaking",
  },
  {
    icon: GraduationCap,
    title: "University Lectures & Academic Engagement",
    text: "SWAB welcomes invitations from universities, colleges and training providers seeking guest lectures, seminar facilitation or contributions to academic programmes. Sessions are designed to bridge theory and practice, helping students and emerging practitioners explore contemporary social work issues through the lens of real-world practice, critical reflection and international perspectives.",
    id: "university-lectures",
  },
  {
    icon: Users,
    title: "Conferences, Panels & Professional Forums",
    text: "We contribute to panel discussions, conferences, webinars and professional forums that promote learning, collaboration and knowledge exchange across the social work profession. By bringing together different perspectives and experiences, these events create opportunities to explore complex issues, share best practice and strengthen professional networks across local, national and international settings.",
    id: "professional-forums",
  },
  {
    icon: Building2,
    title: "Workforce Development & Organisational Learning",
    text: "SWAB can support organisations seeking speakers or facilitators for workforce development events, learning days, team development activities and specialist training sessions. Presentations can be tailored to the needs of Local Authorities, charities, universities, independent organisations and recruitment partners, with a focus on practical learning and professional development.",
    id: "workforce-events",
  },
];

const topics = [
  {
    icon: Globe2,
    title: "International Social Worker Transition & Integration",
  },
  {
    icon: ShieldCheck,
    title: "Child Protection & Safeguarding",
  },
  {
    icon: HeartHandshake,
    title: "Professional Identity & Reflective Practice",
  },
  {
    icon: Lightbulb,
    title: "Leadership, Resilience & Professional Growth",
  },
  {
    icon: Users,
    title: "Early help",
  },
  {
    icon: BookOpen,
    title: "Family Help Assessments",
  },
  {
    icon: GraduationCap,
    title: "Looked After Children",
  },
  {
    icon: HeartHandshake,
    title:
      "Working with and supporting parents/carers for children with additional needs",
  },
];

const values = [
  {
    icon: BookOpen,
    title: "Learn",
    text: "We believe professional growth is a lifelong journey and that every social worker should have opportunities to develop knowledge, skills and confidence throughout their career.",
  },
  {
    icon: Users,
    title: "Share",
    text: "We encourage the sharing of knowledge, experiences and ideas to strengthen practice and support collective learning.",
  },
  {
    icon: HeartHandshake,
    title: "Collaborate",
    text: "We recognise that meaningful change happens when practitioners, organisations and communities work together.",
  },
  {
    icon: Lightbulb,
    title: "Transform",
    text: "We believe learning should lead to action, innovation and positive change for children, families and communities.",
  },
];

export default function SpeakingSection({
  setActivePage,
  activeSection,
  user,
  authLoading,
}: SpeakingSectionProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [organization, setOrganization] = useState("");
  const [eventType, setEventType] = useState("Keynote");
  const [eventDate, setEventDate] = useState("");
  const [location, setLocation] = useState("");
  const [message, setMessage] = useState("");

  const [bookingsList, setBookingsList] = useState<Booking[]>([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(true);
  const [filterConfirmedOnly, setFilterConfirmedOnly] = useState(false);

  useEffect(() => {
    if (user) {
      if (user.email) setEmail(user.email);
      if (user.user_metadata?.full_name) {
        setName(user.user_metadata.full_name);
      }
    }
  }, [user]);

  useEffect(() => {
    if (authLoading) return;

    const action = searchParams?.get("action");

    if (action === "book") {
      if (user) {
        setIsModalOpen(true);
        router.replace("/?page=speaking", { scroll: false });
      } else {
        router.push("/login?redirect=speaking&action=book");
      }
    }
  }, [searchParams, user, authLoading, router]);

  const handleRequestBookingClick = () => {
    if (!user) {
      router.push("/login?redirect=speaking&action=book");
    } else {
      setIsModalOpen(true);
    }
  };

  const fetchBookings = useCallback(async () => {
    if (!user?.email) {
      setBookingsList([]);
      setIsLoadingBookings(false);
      return;
    }

    setIsLoadingBookings(true);

    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session) {
        setBookingsList([]);
        return;
      }

      const response = await fetch(`/api/bookings?t=${Date.now()}`, {
        cache: "no-store",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        const allItems: Booking[] = Array.isArray(data)
          ? data
          : data.data || [];

        const currentEmail = user.email.trim().toLowerCase();

        setBookingsList(
          allItems.filter(
            (booking) =>
              booking.email &&
              booking.email.trim().toLowerCase() === currentEmail
          )
        );
      } else {
        setBookingsList([]);
      }
    } catch (error) {
      console.error("Error fetching speaking enquiries:", error);
      setBookingsList([]);
    } finally {
      setIsLoadingBookings(false);
    }
  }, [user]);

  useEffect(() => {
    if (authLoading) return;

    if (user) {
      fetchBookings();
    } else {
      setIsLoadingBookings(false);
    }
  }, [fetchBookings, user, authLoading]);

  // Navigate directly to the selected Speaking section from the Navbar
  useEffect(() => {
    const sectionMap: Record<string, string> = {
      keynote: "keynote-speaking",
      "keynote-speaking": "keynote-speaking",
      conferences: "professional-forums",
      conference: "professional-forums",
      "university-lectures": "university-lectures",
      lectures: "university-lectures",
      "professional-forums": "professional-forums",
      forums: "professional-forums",
      "workforce-events": "workforce-events",
      workforce: "workforce-events",
      topics: "speaking-topics",
      "speaking-topics": "speaking-topics",
      values: "speaking-values",
      "our-values": "speaking-values",
      bookings: "booking-requests",
      "booking-requests": "booking-requests",
    };

    const targetId = sectionMap[activeSection ?? ""];

    if (!targetId) return;

    requestAnimationFrame(() => {
      const target = document.getElementById(targetId);

      target?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  }, [activeSection]);

  const handleBookingSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token || ""}`,
        },
        body: JSON.stringify({
          name,
          email,
          organization,
          event_type: eventType,
          event_date: eventDate,
          location,
          message,
          status: "pending",
        }),
      });

      if (response.ok) {
        setSubmitSuccess(true);
        fetchBookings();

        setName(user?.user_metadata?.full_name || "");
        setEmail(user?.email || "");
        setOrganization("");
        setEventType("Keynote");
        setEventDate("");
        setLocation("");
        setMessage("");

        window.setTimeout(() => {
          setIsModalOpen(false);
          setSubmitSuccess(false);
        }, 2800);
      } else {
        const data = await response.json();
        setErrorMessage(
          data.error ||
            "Your enquiry could not be submitted. Please try again."
        );
      }
    } catch (error) {
      console.error("Error submitting speaking enquiry:", error);
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayedBookings = filterConfirmedOnly
    ? bookingsList.filter((booking) =>
        ["accepted", "confirmed"].includes(booking.status)
      )
    : bookingsList;

  const navigateContact = () => {
    if (setActivePage) {
      setActivePage("contact");
    } else {
      router.push("/?page=contact");
    }
  };

  return (
    <main className="min-h-screen bg-[#f5f7fa] text-slate-800">
      {/* HERO */}
      <section className="relative isolate overflow-hidden bg-[#10243a] text-white">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          <div className="absolute -right-36 -top-40 h-[32rem] w-[32rem] rounded-full bg-orange-500/20 blur-3xl" />
          <div className="absolute -bottom-48 -left-32 h-[28rem] w-[28rem] rounded-full bg-sky-500/15 blur-3xl" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.035)_1px,transparent_1px)] bg-[size:44px_44px]" />
        </div>

        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[1.15fr_.85fr] lg:px-10 lg:py-24">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-300/10 px-4 py-2 text-[10px] font-extrabold uppercase tracking-[.2em] text-amber-200">
              <Sparkles className="h-3.5 w-3.5" />
              Speaking • Teaching • Knowledge exchange
            </div>

            <p className="mb-3 text-sm font-extrabold uppercase tracking-[.2em] text-amber-300">
              Social Work Across Borders
            </p>

            <h1 className="max-w-3xl text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
              Professional Speaking, Teaching & Knowledge Exchange
              <span className="mt-3 block text-amber-300">
                Bringing learning beyond borders.
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-base leading-8 text-slate-200">
              Social Work Across Borders (SWAB) welcomes opportunities to
              contribute to professional conversations, learning events and
              knowledge-exchange initiatives that strengthen social work
              practice and improve outcomes for children, families and
              communities.
            </p>

            <p className="mt-4 max-w-2xl text-base leading-8 text-slate-300">
              Drawing upon experience in frontline social work, safeguarding,
              international workforce development and practice across
              different social work systems, SWAB provides engaging,
              thought-provoking and practice-focused presentations tailored
              to diverse audiences. Whether addressing students,
              practitioners, managers, academics or organisational leaders,
              our aim is to promote learning, critical reflection and
              meaningful dialogue.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={handleRequestBookingClick}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#e85d04] px-6 py-4 text-sm font-extrabold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[#cf4e00]"
              >
                Invite SWAB to speak
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                onClick={() =>
                  document
                    .getElementById("speaking-formats")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="rounded-xl border border-white/25 bg-white/5 px-6 py-4 text-sm font-bold text-white transition hover:bg-white/10"
              >
                Explore engagement formats
              </button>
            </div>
          </div>

          {/* LOGO AND VALUES PANEL */}
          <div className="relative mx-auto w-full max-w-md">
            <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-amber-300/25 to-sky-400/10 blur-2xl" />

            <div className="relative rounded-[1.75rem] border border-white/15 bg-white p-6 text-center shadow-2xl sm:p-8">
              <img
                src="/logo2.png"
                alt="Social Work Across Borders logo"
                className="mx-auto h-36 w-36 object-contain sm:h-44 sm:w-44"
              />

              <div className="mx-auto my-5 h-1 w-16 rounded-full bg-[#e85d04]" />

              <p className="text-[10px] font-extrabold uppercase tracking-[.22em] text-[#e85d04]">
                Our Values
              </p>

              <h2 className="mt-3 text-2xl font-extrabold leading-tight text-[#10243a] sm:text-3xl">
                Learn <span className="text-[#e85d04]">•</span> Share
                <span className="text-[#e85d04]"> • </span>
                Collaborate
                <span className="text-[#e85d04]"> • </span>
                Transform
              </h2>

              <p className="mx-auto mt-4 max-w-xs text-sm leading-6 text-slate-600">
                These values guide everything we do.
              </p>

              <div className="mt-6 grid grid-cols-2 gap-3 text-left">
                {values.map(({ icon: Icon, title }) => (
                  <div
                    key={title}
                    className="flex items-center gap-2 rounded-xl bg-[#f5f7fa] p-3"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-[#e85d04]">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="text-xs font-extrabold text-[#10243a]">
                      {title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ENGAGEMENT FORMATS */}
      <section
        id="speaking-formats"
        className="scroll-mt-24 bg-white py-16 sm:py-20"
      >
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <p className="text-xs font-extrabold uppercase tracking-[.2em] text-[#e85d04]">
              Professional speaking opportunities
            </p>

            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-[#10243a] sm:text-4xl">
              Speaking, Teaching & Professional Engagement
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {engagementFormats.map(
              ({ icon: Icon, title, text, id }, index) => (
                <article
                  key={id}
                  id={id}
                  className="scroll-mt-28 rounded-2xl border border-slate-200 bg-[#fbfcfe] p-6 shadow-sm transition hover:-translate-y-1 hover:border-orange-200 hover:shadow-lg sm:p-8"
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#10243a] text-amber-300">
                      <Icon className="h-6 w-6" />
                    </span>

                    <span className="text-xs font-extrabold tracking-[.18em] text-[#e85d04]">
                      0{index + 1}
                    </span>
                  </div>

                  <h3 className="mt-6 text-xl font-extrabold text-[#10243a]">
                    {title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    {text}
                  </p>
                </article>
              )
            )}
          </div>
        </div>
      </section>

      {/* AREAS OF INTEREST */}
      <section
        id="speaking-topics"
        className="scroll-mt-24 bg-[#f5f7fa] py-16 sm:py-20"
      >
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="mb-10 max-w-3xl">
            <p className="text-xs font-extrabold uppercase tracking-[.2em] text-[#e85d04]">
              Areas of Interest
            </p>

            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-[#10243a] sm:text-4xl">
              Areas of Interest
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {topics.map(({ icon: Icon, title }, index) => (
              <article
                key={title}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-[#e85d04]">
                    <Icon className="h-5 w-5" />
                  </span>

                  <span className="text-[10px] font-extrabold tracking-widest text-slate-300">
                    0{index + 1}
                  </span>
                </div>

                <h3 className="mt-5 text-base font-extrabold leading-snug text-[#10243a]">
                  {title}
                </h3>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* OUR VALUES */}
      <section
        id="speaking-values"
        className="scroll-mt-24 bg-white py-16 sm:py-20"
      >
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <p className="text-xs font-extrabold uppercase tracking-[.2em] text-[#e85d04]">
              What guides us
            </p>

            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-[#10243a] sm:text-4xl">
              OUR VALUES
            </h2>

            <p className="mt-4 text-lg font-extrabold text-[#e85d04]">
              Learn • Share • Collaborate • Transform
            </p>

            <p className="mt-3 text-sm leading-7 text-slate-600">
              These values guide everything we do.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {values.map(({ icon: Icon, title, text }, index) => (
              <article
                key={title}
                className="group rounded-2xl border border-slate-200 bg-[#fbfcfe] p-6 shadow-sm transition hover:-translate-y-1 hover:border-orange-200 hover:shadow-lg sm:p-7"
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#10243a] text-amber-300 transition group-hover:bg-[#e85d04]">
                    <Icon className="h-6 w-6" />
                  </span>

                  <span className="text-xs font-extrabold tracking-[.18em] text-[#e85d04]">
                    0{index + 1}
                  </span>
                </div>

                <h3 className="mt-6 text-xl font-extrabold text-[#10243a]">
                  {title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* BOOKING REQUESTS - EXISTING ACCOUNT FEATURE RETAINED */}
      <section
        id="booking-requests"
        className="scroll-mt-24 bg-[#f5f7fa] py-16 sm:py-20"
      >
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="mb-8 flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[.2em] text-[#e85d04]">
                For registered users
              </p>

              <h2 className="mt-3 text-2xl font-extrabold text-[#10243a] sm:text-3xl">
                Your speaking enquiries
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Sign in to view and track the status of speaking engagement
                requests submitted through SWAB.
              </p>
            </div>

            {user && (
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFilterConfirmedOnly(false)}
                  className={`rounded-lg px-4 py-2.5 text-xs font-bold transition ${
                    !filterConfirmedOnly
                      ? "bg-[#10243a] text-white"
                      : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  All requests ({bookingsList.length})
                </button>

                <button
                  onClick={() => setFilterConfirmedOnly(true)}
                  className={`rounded-lg px-4 py-2.5 text-xs font-bold transition ${
                    filterConfirmedOnly
                      ? "bg-emerald-700 text-white"
                      : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  Confirmed (
                  {
                    bookingsList.filter((booking) =>
                      ["accepted", "confirmed"].includes(booking.status)
                    ).length
                  }
                  )
                </button>
              </div>
            )}
          </div>

          {!user ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
              <CalendarDays className="mx-auto h-9 w-9 text-[#e85d04]" />

              <h3 className="mt-4 text-lg font-extrabold text-[#10243a]">
                Track your event enquiry
              </h3>

              <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-600">
                Sign in to view your submitted speaking requests and follow
                their progress.
              </p>

              <button
                onClick={() => router.push("/login?redirect=speaking")}
                className="mt-5 rounded-xl bg-[#10243a] px-5 py-3 text-xs font-extrabold text-white transition hover:bg-slate-800"
              >
                Sign in to view requests
              </button>
            </div>
          ) : isLoadingBookings ? (
            <div className="rounded-2xl border border-slate-200 bg-white py-10 text-center text-sm text-slate-500">
              Loading your enquiries…
            </div>
          ) : displayedBookings.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
              <Clock3 className="mx-auto h-8 w-8 text-slate-400" />

              <p className="mt-3 text-sm font-semibold text-[#10243a]">
                No enquiries in this view yet.
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Use “Invite SWAB to speak” to submit an event enquiry.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {displayedBookings.map((item, index) => {
                const accepted = ["accepted", "confirmed"].includes(
                  item.status
                );
                const declined = item.status === "declined";

                return (
                  <article
                    key={item.id || index}
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-600">
                        {item.event_type || "Event"}
                      </span>

                      <span
                        className={`rounded-full px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider ${
                          accepted
                            ? "bg-emerald-100 text-emerald-800"
                            : declined
                              ? "bg-red-100 text-red-700"
                              : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {accepted
                          ? "Confirmed"
                          : declined
                            ? "Declined"
                            : "Pending"}
                      </span>
                    </div>

                    <h3 className="mt-4 text-base font-extrabold text-[#10243a]">
                      {item.organization || "Speaking enquiry"}
                    </h3>

                    {item.message && (
                      <p className="mt-2 line-clamp-3 rounded-lg bg-slate-50 p-3 text-xs leading-6 text-slate-600">
                        {item.message}
                      </p>
                    )}

                    <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 border-t border-slate-100 pt-4 text-xs text-slate-500">
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {item.location || "Location to be confirmed"}
                      </span>

                      <span className="inline-flex items-center gap-1">
                        <CalendarDays className="h-3.5 w-3.5" />
                        {item.event_date
                          ? new Date(item.event_date).toLocaleDateString()
                          : "Date to be confirmed"}
                      </span>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* INVITATION CTA */}
      <section className="bg-[#10243a] px-5 py-16 text-white sm:px-8 sm:py-20">
        <div className="mx-auto max-w-5xl rounded-[1.75rem] border border-white/10 bg-white/[.05] px-6 py-12 text-center sm:px-12 sm:py-14">
          <p className="text-xs font-extrabold uppercase tracking-[.2em] text-amber-300">
            Invite SWAB to Speak
          </p>

          <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
            Invite SWAB to Speak
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-200">
            Whether you are organising a conference, university event,
            webinar, panel discussion, professional forum or workforce
            development programme, we welcome opportunities to contribute to
            conversations that develop knowledgeable, confident and effective
            social work practitioners across borders.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              onClick={handleRequestBookingClick}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#e85d04] px-7 py-4 text-sm font-extrabold text-white transition hover:-translate-y-0.5 hover:bg-[#cf4e00]"
            >
              Submit a speaking enquiry
              <ArrowRight className="h-4 w-4" />
            </button>

            <button
              onClick={navigateContact}
              className="rounded-xl border border-white/25 bg-white/5 px-7 py-4 text-sm font-bold text-white transition hover:bg-white/10"
            >
              Contact SWAB
            </button>
          </div>
        </div>

        <p className="mx-auto mt-8 max-w-3xl text-center text-xs leading-6 text-slate-400">
          Empowering social workers through knowledge, preparation and
          support to thrive across borders and improve outcomes for children,
          families and communities.
        </p>
      </section>

      {/* BOOKING MODAL */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-slate-950/75 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="speaking-modal-title"
        >
          <div className="relative my-8 w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl sm:p-8">
            <button
              onClick={() => setIsModalOpen(false)}
              aria-label="Close enquiry form"
              className="absolute right-4 top-4 rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            >
              <X className="h-5 w-5" />
            </button>

            <p className="text-xs font-extrabold uppercase tracking-[.18em] text-[#e85d04]">
              Speaking & Knowledge Exchange
            </p>

            <h3
              id="speaking-modal-title"
              className="mt-2 text-2xl font-extrabold text-[#10243a]"
            >
              Invite SWAB to contribute
            </h3>

            <p className="mt-2 pr-6 text-sm leading-6 text-slate-500">
              Share a few details about your event. The SWAB team can use this
              information to understand your requirements.
            </p>

            {submitSuccess ? (
              <div className="mt-7 rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-center">
                <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-600" />

                <h4 className="mt-3 font-extrabold text-emerald-900">
                  Enquiry submitted successfully
                </h4>

                <p className="mt-2 text-sm leading-6 text-emerald-800">
                  Thank you for contacting Social Work Across Borders. Your
                  speaking enquiry has been received.
                </p>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="mt-7 space-y-4">
                {errorMessage && (
                  <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                    {errorMessage}
                  </div>
                )}

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="speaking-name"
                      className="mb-1.5 block text-xs font-bold text-slate-700"
                    >
                      Your name *
                    </label>

                    <input
                      id="speaking-name"
                      required
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder="Full name"
                      className="w-full rounded-lg border border-slate-300 px-3 py-3 text-sm outline-none transition focus:border-[#e85d04] focus:ring-2 focus:ring-orange-100"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="speaking-email"
                      className="mb-1.5 block text-xs font-bold text-slate-700"
                    >
                      Email address *
                    </label>

                    <input
                      id="speaking-email"
                      type="email"
                      required
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="you@organisation.org"
                      className="w-full rounded-lg border border-slate-300 px-3 py-3 text-sm outline-none transition focus:border-[#e85d04] focus:ring-2 focus:ring-orange-100"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="speaking-organisation"
                      className="mb-1.5 block text-xs font-bold text-slate-700"
                    >
                      Organisation / institution
                    </label>

                    <input
                      id="speaking-organisation"
                      value={organization}
                      onChange={(event) =>
                        setOrganization(event.target.value)
                      }
                      placeholder="Organisation or university"
                      className="w-full rounded-lg border border-slate-300 px-3 py-3 text-sm outline-none transition focus:border-[#e85d04] focus:ring-2 focus:ring-orange-100"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="speaking-type"
                      className="mb-1.5 block text-xs font-bold text-slate-700"
                    >
                      Engagement type *
                    </label>

                    <select
                      id="speaking-type"
                      required
                      value={eventType}
                      onChange={(event) => setEventType(event.target.value)}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-3 text-sm outline-none transition focus:border-[#e85d04] focus:ring-2 focus:ring-orange-100"
                    >
                      <option value="Keynote">Keynote speaking</option>
                      <option value="University Lecture">
                        University lecture / seminar
                      </option>
                      <option value="Conference">Conference</option>
                      <option value="Panel">Panel / professional forum</option>
                      <option value="Webinar / Podcast">
                        Webinar / podcast
                      </option>
                      <option value="Workforce Development">
                        Workforce development event
                      </option>
                      <option value="Workshop / Training">
                        Workshop / training
                      </option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="speaking-date"
                      className="mb-1.5 block text-xs font-bold text-slate-700"
                    >
                      Proposed date
                    </label>

                    <input
                      id="speaking-date"
                      type="date"
                      value={eventDate}
                      onChange={(event) => setEventDate(event.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-3 py-3 text-sm outline-none transition focus:border-[#e85d04] focus:ring-2 focus:ring-orange-100"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="speaking-location"
                      className="mb-1.5 block text-xs font-bold text-slate-700"
                    >
                      Location / online platform
                    </label>

                    <input
                      id="speaking-location"
                      value={location}
                      onChange={(event) => setLocation(event.target.value)}
                      placeholder="City, venue or online"
                      className="w-full rounded-lg border border-slate-300 px-3 py-3 text-sm outline-none transition focus:border-[#e85d04] focus:ring-2 focus:ring-orange-100"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="speaking-details"
                    className="mb-1.5 block text-xs font-bold text-slate-700"
                  >
                    Event details, audience & topics *
                  </label>

                  <textarea
                    id="speaking-details"
                    required
                    rows={4}
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    placeholder="Tell us about the event, intended audience, expected participants and topics you would like SWAB to address..."
                    className="w-full resize-y rounded-lg border border-slate-300 px-3 py-3 text-sm outline-none transition focus:border-[#e85d04] focus:ring-2 focus:ring-orange-100"
                  />
                </div>

                <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#e85d04] px-6 py-3 text-sm font-extrabold text-white transition hover:bg-[#cf4e00] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Send className="h-4 w-4" />
                    {isSubmitting
                      ? "Submitting..."
                      : "Submit speaking enquiry"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </main>
  );
}