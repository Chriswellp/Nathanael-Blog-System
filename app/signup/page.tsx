'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/src/lib/supabaseClient';

function SignupInnerContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState('Male');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Background Image Carousel State
  const [currentBgIndex, setCurrentBgIndex] = useState(0);

  const bgImages = [
    'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1920&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1920&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?q=80&w=1920&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1920&auto=format&fit=crop',
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBgIndex((prev) => (prev + 1) % bgImages.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [bgImages.length]);

  // Capture potential redirect parameters to pass along
  const redirectPage = searchParams.get('redirect');
  const actionParam = searchParams.get('action');
  const speakingSection = searchParams.get('speakingsection');

  const loginQuery = new URLSearchParams();
  if (redirectPage) loginQuery.set('redirect', redirectPage);
  if (actionParam) loginQuery.set('action', actionParam);
  if (speakingSection) loginQuery.set('speakingsection', speakingSection);
  const loginHref = loginQuery.toString() ? `/login?${loginQuery.toString()}` : '/login';

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    const cleanEmail = email.trim().toLowerCase();
    const cleanFirstName = firstName.trim();
    const cleanLastName = lastName.trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      setErrorMsg('Please enter a valid email address format.');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      setLoading(false);
      return;
    }

    try {
      // Dynamically resolve site URL for correct redirects in production and local environments
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || (typeof window !== 'undefined' ? window.location.origin : '');

      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          emailRedirectTo: `${siteUrl}/login`,
          data: {
            first_name: cleanFirstName,
            last_name: cleanLastName,
            full_name: `${cleanFirstName} ${cleanLastName}`,
            gender,
          },
        },
      });

      if (error) {
        setErrorMsg(error.message);
      } else {
        // Check if email confirmation is required by Supabase
        if (data?.user && !data.session) {
          setSuccessMsg('Registration successful! Please check your email inbox to verify your account before logging in.');
        } else {
          setSuccessMsg('Account created successfully! Redirecting...');
          setTimeout(() => {
            router.push('/login');
          }, 2000);
        }
      }
    } catch (err) {
      console.error('Signup error:', err);
      setErrorMsg('An unexpected error occurred during signup. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-slate-950 text-white flex items-center justify-center p-4 sm:p-6 lg:p-10 overflow-hidden selection:bg-amber-400 selection:text-slate-950">
      
      {/* BACKGROUND SLIDESHOW */}
      {bgImages.map((img, idx) => (
        <div
          key={img}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out bg-cover bg-center scale-105 transform transition-transform duration-[10000ms] ${
            idx === currentBgIndex ? 'opacity-30 scale-100' : 'opacity-0 scale-105'
          }`}
          style={{ backgroundImage: `url(${img})` }}
        />
      ))}

      {/* Dark Overlay & Ambient Light */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/60" />
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* MAIN CARD CONTAINER */}
      <div className="relative z-10 w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-slate-900/70 backdrop-blur-xl border border-amber-500/30 rounded-3xl p-6 sm:p-10 shadow-2xl overflow-hidden">
        
        {/* LEFT COLUMN: BRANDING & MEMBERSHIP BENEFITS */}
        <div className="lg:col-span-5 space-y-6 lg:pr-4">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 flex items-center justify-center shrink-0">
              <img 
                src="/logo1.png" 
                alt="Nathanael Maradza Logo" 
                className="w-full h-full object-contain hover:scale-105 transition-transform duration-300" 
              />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold font-serif text-white tracking-wide leading-tight">
                Nathanael Maradza
              </h1>
              <p className="text-[10px] sm:text-xs text-amber-400 font-sans tracking-widest uppercase font-semibold">
                Social Work Across Borders
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-bold text-slate-100 leading-snug">
              Join the Global Community
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Create an official account to unlock access to direct discussions, live interactive workshops, specialized publications, and consultation sessions.
            </p>
          </div>

          {/* Perks List */}
          <div className="space-y-3 pt-2 border-t border-slate-800/80">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 text-xs shrink-0 font-bold">✓</div>
              <p className="text-xs text-slate-300"><strong className="text-white">Direct Engagement:</strong> Participate in live video seminars & discussions.</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 text-xs shrink-0 font-bold">✓</div>
              <p className="text-xs text-slate-300"><strong className="text-white">Resource Network:</strong> Share and download articles, field guides, and papers.</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 text-xs shrink-0 font-bold">✓</div>
              <p className="text-xs text-slate-300"><strong className="text-white">Real-Time Portal:</strong> Direct real-time messaging support and advisories.</p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: REGISTRATION FORM */}
        <div className="lg:col-span-7 w-full bg-slate-950/80 border border-slate-800 p-6 sm:p-8 rounded-2xl shadow-xl space-y-5">
          
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-lg font-bold font-serif text-white">Create Account</h2>
            <p className="text-xs text-slate-400">Fill in your official details to complete registration.</p>
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl">
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-xl flex items-center gap-2 leading-relaxed">
              <svg className="w-4 h-4 text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-3.5">
            {/* First & Last Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">First Name</label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="John"
                  className="w-full bg-slate-900 border border-slate-800 text-white placeholder-slate-500 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-amber-400 transition"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Last Name</label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Doe"
                  className="w-full bg-slate-900 border border-slate-800 text-white placeholder-slate-500 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-amber-400 transition"
                />
              </div>
            </div>

            {/* Gender */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-amber-400 transition"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="client@example.com"
                className="w-full bg-slate-900 border border-slate-800 text-white placeholder-slate-500 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-amber-400 transition"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-900 border border-slate-800 text-white placeholder-slate-500 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-amber-400 transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !!successMsg}
              className="w-full bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold py-3 rounded-xl text-xs uppercase tracking-wider transition-all disabled:opacity-50 mt-2 flex items-center justify-center shadow-lg hover:shadow-amber-400/20 active:scale-[0.98] cursor-pointer"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-slate-950" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                  </svg>
                  Registering Account...
                </span>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <p className="text-center text-xs text-slate-400 pt-2">
            Already have an account?{' '}
            <Link href={loginHref} className="text-amber-400 font-semibold hover:underline">
              Log in here
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 text-white flex items-center justify-center text-xs">Loading signup portal...</div>}>
      <SignupInnerContent />
    </Suspense>
  );
}