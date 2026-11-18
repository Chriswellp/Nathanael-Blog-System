"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { User } from "@supabase/supabase-js";
import {
  ArrowRight, BookOpen, GraduationCap, Mic2, Users, Building2, Globe2,
  ShieldCheck, HeartHandshake, Lightbulb, CalendarDays, MapPin,
  CheckCircle2, Clock3, X, Send, Sparkles, Presentation, BriefcaseBusiness
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
    text: "Thought-provoking keynote presentations for conferences, professional forums, workforce development events and social work gatherings. Sessions bring together practice experience, research, international perspectives and real-world learning.",
    examples: "International social work • Safeguarding • Workforce challenges • Professional identity • Leadership • Learning across borders",
    id: "keynote-speaking",
  },
  {
    icon: GraduationCap,
    title: "University Lectures & Academic Engagement",
    text: "Guest lectures, seminars and contributions to university, college and training-provider programmes. Sessions bridge theory and practice through critical reflection, contemporary issues and international perspectives.",
    examples: "Guest lectures • Seminar facilitation • Academic programmes • Student and practitioner learning",
    id: "university-lectures",
  },
  {
    icon: Users,
    title: "Conferences, Panels & Professional Forums",
    text: "Contributions to conferences, panel discussions, webinars and professional forums that create space for dialogue, shared learning and knowledge exchange across the social work profession.",
    examples: "Panel discussions • Conferences • Webinars • Professional forums • Cross-border dialogue",
    id: "professional-forums",
  },
  {
    icon: Building2,
    title: "Workforce Development & Organisational Learning",
    text: "Speaking and facilitation for organisations seeking contributors to workforce development events, learning days, team development activities and specialist training sessions.",
    examples: "Local Authorities • Charities • Universities • Independent organisations • Recruitment partners",
    id: "workforce-events",
  },
];

const topics = [
  {
    icon: Globe2,
    title: "International Social Worker Transition & Integration",
    text: "Understanding the professional, practical and cultural adjustments involved in moving between social work systems and supporting successful transitions into practice.",
  },
  {
    icon: ShieldCheck,
    title: "Child Protection & Safeguarding",
    text: "Exploring safeguarding responsibilities, child protection practice and approaches that promote the safety and wellbeing of children and families.",
  },
  {
    icon: HeartHandshake,
    title: "Professional Identity & Reflective Practice",
    text: "Strengthening professional identity, critical reflection and the ability to learn from complex practice experiences.",
  },
  {
    icon: Lightbulb,
    title: "Leadership, Resilience & Professional Growth",
    text: "Considering leadership, professional resilience, workforce challenges and sustainable development throughout a social work career.",
  },
  {
    icon: Users,
    title: "Early Help",
    text: "Exploring early intervention, partnership working and approaches that support children and families before difficulties escalate.",
  },
  {
    icon: BookOpen,
    title: "Family Help Assessments",
    text: "Considering assessment, analysis and collaborative approaches to understanding family strengths, needs and support.",
  },
  {
    icon: GraduationCap,
    title: "Looked After Children",
    text: "Discussing practice and support for children in care, including the importance of relationships, stability, voice and outcomes.",
  },
  {
    icon: HeartHandshake,
    title: "Supporting Parents & Carers of Children with Additional Needs",
    text: "Exploring respectful, strengths-based work with parents and carers, partnership approaches and support for children with additional needs.",
  },
];

const audiences = [
  "Universities and educational institutions",
  "Local Authorities and Children's Services",
  "Charities and non-governmental organisations",
  "Recruitment organisations",
  "Research groups",
  "Professional associations",
  "Social workers and practitioners worldwide",
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
      if (user.user_metadata?.full_name) setName(user.user_metadata.full_name);
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
        const allItems: Booking[] = Array.isArray(data) ? data : data.data || [];
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
    if (user) fetchBookings();
    else setIsLoadingBookings(false);
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
        setErrorMessage(data.error || "Your enquiry could not be submitted. Please try again.");
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
    if (setActivePage) setActivePage("contact");
    else router.push("/?page=contact");
  };

  return (
    <main className="min-h-screen bg-[#f5f7fa] text-slate-800">
      {/* HERO */}
      <section className="relative isolate overflow-hidden bg-[#10243a] text-white">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -right-36 -top-40 h-[32rem] w-[32rem] rounded-full bg-orange-500/20 blur-3xl" />
          <div className="absolute -bottom-48 -left-32 h-[28rem] w-[28rem] rounded-full bg-sky-500/15 blur-3xl" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.035)_1px,transparent_1px)] bg-[size:44px_44px]" />
        </div>

        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[1.15fr_.85fr] lg:px-10 lg:py-24">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-300/10 px-4 py-2 text-[10px] font-extrabold uppercase tracking-[.2em] text-amber-200">
              <Sparkles className="h-3.5 w-3.5" /> Speaking • Teaching • Knowledge exchange
            </div>
            <p className="mb-3 text-sm font-extrabold uppercase tracking-[.2em] text-amber-300">
              Social Work Across Borders
            </p>
            <h1 className="max-w-3xl text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
              Professional Speaking & Teaching
              <span className="mt-2 block text-amber-300">Bringing learning beyond borders.</span>
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-200">
              Sharing knowledge. Connecting perspectives. Strengthening social work practice.
            </p>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
              Social Work Across Borders (SWAB) welcomes opportunities to contribute to professional conversations, learning events and knowledge-exchange initiatives that strengthen social work practice and improve outcomes for children, families and communities.
            </p>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
              Drawing on frontline social work, safeguarding, international workforce development and practice across different social work systems, SWAB offers engaging, thought-provoking and practice-focused presentations tailored to students, practitioners, managers, academics and organisational leaders.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={handleRequestBookingClick}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#e85d04] px-6 py-4 text-sm font-extrabold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[#cf4e00]"
              >
                Invite SWAB to speak <ArrowRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => document.getElementById("speaking-formats")?.scrollIntoView({ behavior: "smooth" })}
                className="rounded-xl border border-white/25 bg-white/5 px-6 py-4 text-sm font-bold text-white transition hover:bg-white/10"
              >
                Explore engagement formats
              </button>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-md">
            <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-amber-300/25 to-sky-400/10 blur-2xl" />
            <div className="relative rounded-[1.75rem] border border-white/15 bg-white p-6 text-center shadow-2xl sm:p-8">
              <img src="/logo2.png" alt="Social Work Across Borders logo" className="mx-auto h-36 w-36 object-contain sm:h-44 sm:w-44" />
              <div className="mx-auto my-5 h-1 w-16 rounded-full bg-[#e85d04]" />
              <p className="text-[10px] font-extrabold uppercase tracking-[.22em] text-[#e85d04]">Our shared purpose</p>
              <h2 className="mt-3 text-2xl font-extrabold leading-tight text-[#10243a] sm:text-3xl">
                Different perspectives.
                <span className="block text-[#e85d04]">Stronger practice.</span>
              </h2>
              <p className="mx-auto mt-4 max-w-xs text-sm leading-6 text-slate-600">
                Creating space for professional dialogue, critical reflection and international knowledge exchange.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ENGAGEMENT FORMATS */}
      <section id="speaking-formats" className="scroll-mt-24 bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <p className="text-xs font-extrabold uppercase tracking-[.2em] text-[#e85d04]">How SWAB can contribute</p>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-[#10243a] sm:text-4xl">
              Speaking, teaching & professional engagement
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              Flexible contributions designed around the purpose of your event, your audience and the learning outcomes you want to achieve.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {engagementFormats.map(({ icon: Icon, title, text, examples, id }, index) => (
              <article key={id} id={id} className="scroll-mt-28 rounded-2xl border border-slate-200 bg-[#fbfcfe] p-6 shadow-sm transition hover:-translate-y-1 hover:border-orange-200 hover:shadow-lg sm:p-8">
                <div className="flex items-start justify-between gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#10243a] text-amber-300">
                    <Icon className="h-6 w-6" />
                  </span>
                  <span className="text-xs font-extrabold tracking-[.18em] text-[#e85d04]">0{index + 1}</span>
                </div>
                <h3 className="mt-6 text-xl font-extrabold text-[#10243a]">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{text}</p>
                <div className="mt-5 rounded-xl bg-white p-4">
                  <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#e85d04]">Engagement may include</p>
                  <p className="mt-2 text-xs leading-6 text-slate-600">{examples}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* TOPICS */}
      <section id="speaking-topics" className="scroll-mt-24 bg-[#f5f7fa] py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="mb-10 max-w-3xl">
            <p className="text-xs font-extrabold uppercase tracking-[.2em] text-[#e85d04]">Areas of interest</p>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-[#10243a] sm:text-4xl">
              Topics that matter to social work practice.
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              Presentations and learning sessions can be shaped around the needs of your audience and may explore the following areas.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {topics.map(({ icon: Icon, title, text }, index) => (
              <article key={title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-[#e85d04]">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="text-[10px] font-extrabold tracking-widest text-slate-300">0{index + 1}</span>
                </div>
                <h3 className="mt-5 text-base font-extrabold leading-snug text-[#10243a]">{title}</h3>
                <p className="mt-2 text-xs leading-6 text-slate-600">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* APPROACH + AUDIENCE */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 sm:px-8 lg:grid-cols-[1fr_1fr] lg:px-10">
          <article className="rounded-2xl bg-[#10243a] p-7 text-white shadow-lg sm:p-9">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-amber-300">
              <Presentation className="h-6 w-6" />
            </span>
            <p className="mt-6 text-xs font-extrabold uppercase tracking-[.2em] text-amber-300">Our approach</p>
            <h2 className="mt-3 text-2xl font-extrabold leading-tight sm:text-3xl">Engaging, thought-provoking and practice-focused.</h2>
            <p className="mt-5 text-sm leading-7 text-slate-200">
              SWAB sessions are designed to promote learning, critical reflection and meaningful dialogue. Contributions connect professional knowledge and practice experience with research, international perspectives and real-world learning.
            </p>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              Whether addressing students, practitioners, managers, academics or organisational leaders, the focus is on relevant learning that participants can take back into their professional environments.
            </p>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-[#fbfcfe] p-7 shadow-sm sm:p-9">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-[#e85d04]">
              <BriefcaseBusiness className="h-6 w-6" />
            </span>
            <p className="mt-6 text-xs font-extrabold uppercase tracking-[.2em] text-[#e85d04]">Who we work with</p>
            <h2 className="mt-3 text-2xl font-extrabold leading-tight text-[#10243a] sm:text-3xl">Connecting with the wider social work community.</h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              SWAB welcomes invitations and opportunities to collaborate with organisations and professionals committed to strengthening social work knowledge and practice.
            </p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {audiences.map((audience) => (
                <li key={audience} className="flex items-start gap-2 text-sm leading-6 text-slate-700">
                  <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[#e85d04]" />{audience}
                </li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      {/* BOOKING REQUESTS - EXISTING ACCOUNT FEATURE RETAINED */}
      <section id="booking-requests" className="scroll-mt-24 bg-[#f5f7fa] py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="mb-8 flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[.2em] text-[#e85d04]">For registered users</p>
              <h2 className="mt-3 text-2xl font-extrabold text-[#10243a] sm:text-3xl">Your speaking enquiries</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">Sign in to view and track the status of speaking engagement requests submitted through SWAB.</p>
            </div>
            {user && (
              <div className="flex flex-wrap gap-2">
                <button onClick={() => setFilterConfirmedOnly(false)} className={`rounded-lg px-4 py-2.5 text-xs font-bold transition ${!filterConfirmedOnly ? "bg-[#10243a] text-white" : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"}`}>
                  All requests ({bookingsList.length})
                </button>
                <button onClick={() => setFilterConfirmedOnly(true)} className={`rounded-lg px-4 py-2.5 text-xs font-bold transition ${filterConfirmedOnly ? "bg-emerald-700 text-white" : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"}`}>
                  Confirmed ({bookingsList.filter((booking) => ["accepted", "confirmed"].includes(booking.status)).length})
                </button>
              </div>
            )}
          </div>

          {!user ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
              <CalendarDays className="mx-auto h-9 w-9 text-[#e85d04]" />
              <h3 className="mt-4 text-lg font-extrabold text-[#10243a]">Track your event enquiry</h3>
              <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-600">Sign in to view your submitted speaking requests and follow their progress.</p>
              <button onClick={() => router.push("/login?redirect=speaking")} className="mt-5 rounded-xl bg-[#10243a] px-5 py-3 text-xs font-extrabold text-white transition hover:bg-slate-800">
                Sign in to view requests
              </button>
            </div>
          ) : isLoadingBookings ? (
            <div className="rounded-2xl border border-slate-200 bg-white py-10 text-center text-sm text-slate-500">Loading your enquiries…</div>
          ) : displayedBookings.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
              <Clock3 className="mx-auto h-8 w-8 text-slate-400" />
              <p className="mt-3 text-sm font-semibold text-[#10243a]">No enquiries in this view yet.</p>
              <p className="mt-1 text-xs text-slate-500">Use “Invite SWAB to speak” to submit an event enquiry.</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {displayedBookings.map((item, index) => {
                const accepted = ["accepted", "confirmed"].includes(item.status);
                const declined = item.status === "declined";
                return (
                  <article key={item.id || index} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between gap-3">
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-600">{item.event_type || "Event"}</span>
                      <span className={`rounded-full px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider ${accepted ? "bg-emerald-100 text-emerald-800" : declined ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-800"}`}>
                        {accepted ? "Confirmed" : declined ? "Declined" : "Pending"}
                      </span>
                    </div>
                    <h3 className="mt-4 text-base font-extrabold text-[#10243a]">{item.organization || "Speaking enquiry"}</h3>
                    {item.message && <p className="mt-2 line-clamp-3 rounded-lg bg-slate-50 p-3 text-xs leading-6 text-slate-600">{item.message}</p>}
                    <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 border-t border-slate-100 pt-4 text-xs text-slate-500">
                      <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{item.location || "Location to be confirmed"}</span>
                      <span className="inline-flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" />{item.event_date ? new Date(item.event_date).toLocaleDateString() : "Date to be confirmed"}</span>
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
          <p className="text-xs font-extrabold uppercase tracking-[.2em] text-amber-300">Invite SWAB to speak</p>
          <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
            Let’s create conversations that strengthen social work practice.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-200">
            Whether you are organising a conference, university event, webinar, panel discussion, professional forum or workforce development programme, SWAB welcomes opportunities to contribute to learning and knowledge exchange.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <button onClick={handleRequestBookingClick} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#e85d04] px-7 py-4 text-sm font-extrabold text-white transition hover:-translate-y-0.5 hover:bg-[#cf4e00]">
              Submit a speaking enquiry <ArrowRight className="h-4 w-4" />
            </button>
            <button onClick={navigateContact} className="rounded-xl border border-white/25 bg-white/5 px-7 py-4 text-sm font-bold text-white transition hover:bg-white/10">
              Contact SWAB
            </button>
          </div>
        </div>
        <p className="mx-auto mt-8 max-w-3xl text-center text-xs leading-6 text-slate-400">
          Empowering social workers through knowledge, preparation and support to thrive across borders and improve outcomes for children, families and communities.
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
            <button onClick={() => setIsModalOpen(false)} aria-label="Close enquiry form" className="absolute right-4 top-4 rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700">
              <X className="h-5 w-5" />
            </button>

            <p className="text-xs font-extrabold uppercase tracking-[.18em] text-[#e85d04]">Speaking & knowledge exchange</p>
            <h3 id="speaking-modal-title" className="mt-2 text-2xl font-extrabold text-[#10243a]">Invite SWAB to contribute</h3>
            <p className="mt-2 pr-6 text-sm leading-6 text-slate-500">Share a few details about your event. The SWAB team can use this information to understand your requirements.</p>

            {submitSuccess ? (
              <div className="mt-7 rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-center">
                <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-600" />
                <h4 className="mt-3 font-extrabold text-emerald-900">Enquiry submitted successfully</h4>
                <p className="mt-2 text-sm leading-6 text-emerald-800">Thank you for contacting Social Work Across Borders. Your speaking enquiry has been received.</p>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="mt-7 space-y-4">
                {errorMessage && <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700">{errorMessage}</div>}

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="speaking-name" className="mb-1.5 block text-xs font-bold text-slate-700">Your name *</label>
                    <input id="speaking-name" required value={name} onChange={(event) => setName(event.target.value)} placeholder="Full name" className="w-full rounded-lg border border-slate-300 px-3 py-3 text-sm outline-none transition focus:border-[#e85d04] focus:ring-2 focus:ring-orange-100" />
                  </div>
                  <div>
                    <label htmlFor="speaking-email" className="mb-1.5 block text-xs font-bold text-slate-700">Email address *</label>
                    <input id="speaking-email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@organisation.org" className="w-full rounded-lg border border-slate-300 px-3 py-3 text-sm outline-none transition focus:border-[#e85d04] focus:ring-2 focus:ring-orange-100" />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="speaking-organisation" className="mb-1.5 block text-xs font-bold text-slate-700">Organisation / institution</label>
                    <input id="speaking-organisation" value={organization} onChange={(event) => setOrganization(event.target.value)} placeholder="Organisation or university" className="w-full rounded-lg border border-slate-300 px-3 py-3 text-sm outline-none transition focus:border-[#e85d04] focus:ring-2 focus:ring-orange-100" />
                  </div>
                  <div>
                    <label htmlFor="speaking-type" className="mb-1.5 block text-xs font-bold text-slate-700">Engagement type *</label>
                    <select id="speaking-type" required value={eventType} onChange={(event) => setEventType(event.target.value)} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-3 text-sm outline-none transition focus:border-[#e85d04] focus:ring-2 focus:ring-orange-100">
                      <option value="Keynote">Keynote speaking</option>
                      <option value="University Lecture">University lecture / seminar</option>
                      <option value="Conference">Conference</option>
                      <option value="Panel">Panel / professional forum</option>
                      <option value="Webinar / Podcast">Webinar / podcast</option>
                      <option value="Workforce Development">Workforce development event</option>
                      <option value="Workshop / Training">Workshop / training</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="speaking-date" className="mb-1.5 block text-xs font-bold text-slate-700">Proposed date</label>
                    <input id="speaking-date" type="date" value={eventDate} onChange={(event) => setEventDate(event.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-3 text-sm outline-none transition focus:border-[#e85d04] focus:ring-2 focus:ring-orange-100" />
                  </div>
                  <div>
                    <label htmlFor="speaking-location" className="mb-1.5 block text-xs font-bold text-slate-700">Location / online platform</label>
                    <input id="speaking-location" value={location} onChange={(event) => setLocation(event.target.value)} placeholder="City, venue or online" className="w-full rounded-lg border border-slate-300 px-3 py-3 text-sm outline-none transition focus:border-[#e85d04] focus:ring-2 focus:ring-orange-100" />
                  </div>
                </div>

                <div>
                  <label htmlFor="speaking-details" className="mb-1.5 block text-xs font-bold text-slate-700">Event details, audience & topics *</label>
                  <textarea id="speaking-details" required rows={4} value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Tell us about the event, intended audience, expected participants and topics you would like SWAB to address..." className="w-full resize-y rounded-lg border border-slate-300 px-3 py-3 text-sm outline-none transition focus:border-[#e85d04] focus:ring-2 focus:ring-orange-100" />
                </div>

                <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50">Cancel</button>
                  <button type="submit" disabled={isSubmitting} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#e85d04] px-6 py-3 text-sm font-extrabold text-white transition hover:bg-[#cf4e00] disabled:cursor-not-allowed disabled:opacity-60">
                    <Send className="h-4 w-4" />{isSubmitting ? "Submitting..." : "Submit speaking enquiry"}
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
