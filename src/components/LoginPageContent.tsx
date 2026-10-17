'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabaseClient';

interface StatusItem {
  id: string;
  media_url: string;
  media_type: 'image' | 'video';
  caption: string;
  created_at: string;
}

export default function LoginPageContent() {
  const router = useRouter();
  const [showLoginForm, setShowLoginForm] = useState(true);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // --- IN-APP FORGOT PASSWORD STATES ---
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [resetEmailInput, setResetEmailInput] = useState('');
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [forgotErrorMsg, setForgotErrorMsg] = useState('');

  // --- IN-APP NEW PASSWORD DIALOG STATES ---
  const [showNewPasswordModal, setShowNewPasswordModal] = useState(false);
  const [verifiedEmailForReset, setVerifiedEmailForReset] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateErrorMsg, setUpdateErrorMsg] = useState('');
  const [updateSuccessMsg, setUpdateSuccessMsg] = useState('');

  // Status Modal & Dynamic Posts
  const [statuses, setStatuses] = useState<StatusItem[]>([]);
  const [activeStatusIndex, setActiveStatusIndex] = useState<number | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Background Image Carousel State
  const [currentBgIndex, setCurrentBgIndex] = useState(0);

  const bgImages = [
    'https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?q=80&w=1920&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1920&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1920&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1920&auto=format&fit=crop',
  ];

  // Rotate background photos
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBgIndex((prev) => (prev + 1) % bgImages.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [bgImages.length]);

  // Fetch Admin Status Updates from Supabase
  useEffect(() => {
    const fetchStatuses = async () => {
      const { data, error } = await supabase
        .from('admin_posts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (!error && data) {
        setStatuses(data);
      }
    };
    fetchStatuses();
  }, []);

 const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    // Ensure email is completely normalized
    const cleanEmail = email ? email.trim().toLowerCase() : '';

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (error) {
        setErrorMsg(error.message);
        setLoading(false);
        return;
      }

      const user = data.user;
      
      // Robust check: evaluate email, user metadata role, or user app_metadata role
      const userRole = user?.user_metadata?.role || user?.app_metadata?.role;
      const isAdmin = cleanEmail === 'admin@nathanael.com' || userRole === 'admin';

      if (isAdmin) {
        // Small delay to ensure cookies are fully set on production domain before redirecting
        await new Promise((resolve) => setTimeout(resolve, 300️));
        router.push('/admin');
        router.refresh();
      } else {
        router.push('/');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setErrorMsg(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // --- STEP 1: VERIFY EMAIL EXISTS IN DATABASE DIRECTLY ---
  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setVerifyLoading(true);
    setForgotErrorMsg('');

    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('email')
        .ilike('email', resetEmailInput.trim())
        .limit(1);

      if (error) {
        setForgotErrorMsg('Could not verify email in database.');
        setVerifyLoading(false);
        return;
      }

      setVerifiedEmailForReset(resetEmailInput.trim());
      setShowForgotPasswordModal(false);
      setResetEmailInput('');
      setShowNewPasswordModal(true);
    } catch (err) {
      console.error('Verification error:', err);
      setForgotErrorMsg('Something went wrong. Please try again.');
    } finally {
      setVerifyLoading(false);
    }
  };

  // --- STEP 2: UPDATE PASSWORD DIRECTLY IN SUPABASE ---
  const handleDirectPasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      setUpdateErrorMsg('Passwords do not match.');
      return;
    }

    if (newPassword.length < 6) {
      setUpdateErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    setUpdateLoading(true);
    setUpdateErrorMsg('');
    setUpdateSuccessMsg('');

    try {
      const response = await fetch('/api/update-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: verifiedEmailForReset, newPassword }),
      });

      const result = await response.json();

      if (!response.ok) {
        setUpdateErrorMsg(result.error || 'Failed to update password.');
      } else {
        setUpdateSuccessMsg('Password successfully updated! Redirecting to login...');
        setTimeout(() => {
          setShowNewPasswordModal(false);
          setNewPassword('');
          setConfirmNewPassword('');
          setUpdateSuccessMsg('');
          setVerifiedEmailForReset('');
        }, 2500);
      }
    } catch (err) {
      console.error('Password update error:', err);
      setUpdateErrorMsg('An unexpected error occurred.');
    } finally {
      setUpdateLoading(false);
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

      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/60" />
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* MAIN CONTAINER */}
      <div className="relative z-10 w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-slate-900/70 backdrop-blur-xl border border-amber-500/30 rounded-3xl p-6 sm:p-10 shadow-2xl overflow-hidden">
        
        {/* LEFT COLUMN: BRAND SHOWCASE & ADMIN STATUS REEL */}
        <div className="lg:col-span-7 space-y-6 lg:pr-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                type="button"
                onClick={() => statuses.length > 0 && setActiveStatusIndex(0)}
                aria-label="View status updates"
                className="relative group cursor-pointer text-left focus:outline-none"
              >
                <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-amber-400 via-pink-500 to-indigo-500 animate-spin blur-sm opacity-80 group-hover:opacity-100 transition"></div>
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-slate-950 bg-slate-800">
                  <img 
                    src="/logo1.png" 
                    alt="Nathanael Maradza" 
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-300" 
                  />
                </div>
                {statuses.length > 0 && (
                  <span className="absolute bottom-0 right-0 bg-amber-400 text-slate-950 text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-tighter shadow">
                    Status
                  </span>
                )}
              </button>

              <div>
                <h1 className="text-2xl sm:text-3xl font-bold font-serif text-white tracking-wide leading-tight">
                  Nathanael Maradza
                </h1>
                <p className="text-xs text-amber-400 font-sans tracking-widest uppercase font-semibold">
                  Social Work Across Borders
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-100 leading-snug">
              Bridging Communities & Driving Social Transformation Worldwide
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Welcome to the official portal for Social Work Across Borders. Click the admin profile ring above or select a video below to watch updates.
            </p>
          </div>

          {/* AUTO-PLAYING SHORT VIDEO FEED PREVIEW */}
          {statuses.length > 0 && (
            <div className="space-y-2 pt-2">
              <span className="text-xs text-slate-400 font-semibold tracking-wider uppercase block">
                Latest Video Status Updates
              </span>
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
                {statuses.map((item, index) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveStatusIndex(index)}
                    className="relative w-28 h-40 shrink-0 rounded-xl overflow-hidden border border-slate-700/80 cursor-pointer group shadow-lg text-left focus:outline-none"
                  >
                    {item.media_type === 'video' ? (
                      <video
                        src={item.media_url}
                        muted
                        loop
                        autoPlay
                        playsInline
                        className="w-full h-full object-cover group-hover:scale-110 transition duration-500 pointer-events-none"
                      />
                    ) : (
                      <img
                        src={item.media_url}
                        alt="Status update"
                        className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent" />
                    <p className="absolute bottom-2 left-2 right-2 text-[10px] text-white font-medium line-clamp-2">
                      {item.caption || 'Watch Update'}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 text-center">
              <span className="block text-lg sm:text-2xl font-bold text-amber-400 font-mono">15+</span>
              <span className="text-[10px] sm:text-xs text-slate-400">Global Hubs</span>
            </div>
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 text-center">
              <span className="block text-lg sm:text-2xl font-bold text-amber-400 font-mono">50+</span>
              <span className="text-[10px] sm:text-xs text-slate-400">Live Sessions</span>
            </div>
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 text-center">
              <span className="block text-lg sm:text-2xl font-bold text-amber-400 font-mono">100%</span>
              <span className="text-[10px] sm:text-xs text-slate-400">Community Support</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: LOGIN FORM */}
        <div className="lg:col-span-5 w-full bg-slate-950/80 border border-slate-800 p-6 sm:p-8 rounded-2xl shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-lg font-bold font-serif text-white">
                {showLoginForm ? 'Portal Access' : 'About Nathanael'}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {showLoginForm ? 'Sign in to access your dashboard' : 'Learn more about our core mission'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowLoginForm(!showLoginForm)}
              className="text-xs text-amber-400 hover:underline font-semibold cursor-pointer"
            >
              {showLoginForm ? 'About Nathan →' : '← Sign In Form'}
            </button>
          </div>

          {showLoginForm ? (
            <div className="space-y-4 animate-in fade-in duration-200">
              {errorMsg && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-lg">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label htmlFor="login-email" className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Email Address
                  </label>
                  <input
                    id="login-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-slate-900 text-white placeholder-slate-500 border border-slate-800 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-amber-400 transition"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label htmlFor="login-password" className="block text-xs font-semibold text-slate-300">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowForgotPasswordModal(true)}
                      className="text-[11px] text-amber-400 hover:underline cursor-pointer font-medium"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <input
                    id="login-password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-900 text-white placeholder-slate-500 border border-slate-800 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-amber-400 transition"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold py-3 rounded-xl text-xs uppercase tracking-wider transition-all disabled:opacity-50 cursor-pointer shadow-lg hover:shadow-amber-400/20 active:scale-[0.98]"
                >
                  {loading ? 'Authenticating...' : 'Sign In to Portal'}
                </button>
              </form>

              <div className="pt-2 text-center text-xs text-slate-400">
                Don&apos;t have an account?{' '}
                <Link href="/signup" className="text-amber-400 font-semibold hover:underline">
                  Sign up here
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-4 animate-in fade-in duration-200 text-xs text-slate-300 leading-relaxed">
              <p>
                <strong className="text-amber-400 font-semibold">Nathanael Maradza</strong> is a dedicated social worker and educator leading global social initiatives under the banner of <em>Social Work Across Borders</em>.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setShowLoginForm(true)}
                  className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-xl text-xs uppercase tracking-wider transition cursor-pointer border border-slate-700"
                >
                  Return to Sign In →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* STEP 1: ENTER EMAIL MODAL */}
      {showForgotPasswordModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-md bg-slate-900 border border-amber-500/40 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
            <button
              type="button"
              onClick={() => {
                setShowForgotPasswordModal(false);
                setForgotErrorMsg('');
                setResetEmailInput('');
              }}
              aria-label="Close modal"
              className="absolute top-4 right-4 text-slate-400 hover:text-white text-lg font-bold bg-slate-800 hover:bg-slate-700 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition"
            >
              ✕
            </button>

            <div className="space-y-1">
              <h3 className="text-xl font-bold font-serif text-white">Reset Password</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Enter your registered email address to proceed with resetting your account password directly on this device.
              </p>
            </div>

            {forgotErrorMsg && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-xl">
                {forgotErrorMsg}
              </div>
            )}

            <form onSubmit={handleVerifyEmail} className="space-y-4">
              <div>
                <label htmlFor="verify-email" className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Registered Email Address *
                </label>
                <input
                  id="verify-email"
                  type="email"
                  required
                  value={resetEmailInput}
                  onChange={(e) => setResetEmailInput(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-slate-950 text-white placeholder-slate-500 border border-slate-800 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-amber-400 transition"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotPasswordModal(false);
                    setForgotErrorMsg('');
                    setResetEmailInput('');
                  }}
                  className="w-1/2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-3 rounded-xl text-xs uppercase tracking-wider transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={verifyLoading}
                  className="w-1/2 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold py-3 rounded-xl text-xs uppercase tracking-wider transition disabled:opacity-50 cursor-pointer shadow"
                >
                  {verifyLoading ? 'Verifying...' : 'Next'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* STEP 2: SET NEW PASSWORD DIALOG */}
      {showNewPasswordModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4 animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-md bg-slate-900 border border-amber-500/40 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="space-y-1">
              <h3 className="text-xl font-bold font-serif text-white">Create New Password</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Enter and confirm a new secure password for <strong className="text-amber-400">{verifiedEmailForReset}</strong>.
              </p>
            </div>

            {updateSuccessMsg && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs rounded-xl leading-relaxed">
                {updateSuccessMsg}
              </div>
            )}

            {updateErrorMsg && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-xl">
                {updateErrorMsg}
              </div>
            )}

            <form onSubmit={handleDirectPasswordUpdate} className="space-y-4">
              <div>
                <label htmlFor="new-pass" className="block text-xs font-semibold text-slate-300 mb-1.5">
                  New Password *
                </label>
                <input
                  id="new-pass"
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full bg-slate-950 text-white placeholder-slate-500 border border-slate-800 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-amber-400 transition"
                />
              </div>

              <div>
                <label htmlFor="confirm-pass" className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Confirm Password *
                </label>
                <input
                  id="confirm-pass"
                  type="password"
                  required
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full bg-slate-950 text-white placeholder-slate-500 border border-slate-800 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-amber-400 transition"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowNewPasswordModal(false);
                    setNewPassword('');
                    setConfirmNewPassword('');
                    setUpdateErrorMsg('');
                    setUpdateSuccessMsg('');
                  }}
                  className="w-1/2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-3 rounded-xl text-xs uppercase tracking-wider transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateLoading}
                  className="w-1/2 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold py-3 rounded-xl text-xs uppercase tracking-wider transition disabled:opacity-50 cursor-pointer shadow-lg"
                >
                  {updateLoading ? 'Saving...' : 'Reset Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FULL-SCREEN VIDEO / STATUS REEL MODAL */}
      {activeStatusIndex !== null && statuses[activeStatusIndex] && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4"
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            onClick={() => setActiveStatusIndex(null)}
            aria-label="Close status viewer"
            className="absolute top-6 right-6 text-white text-2xl font-bold bg-slate-800/80 hover:bg-slate-700 w-10 h-10 rounded-full flex items-center justify-center z-10 cursor-pointer"
          >
            ✕
          </button>

          <div className="relative w-full max-w-md bg-black rounded-2xl overflow-hidden border border-amber-500/30 shadow-2xl flex flex-col h-[80vh]">
            {statuses[activeStatusIndex].media_type === 'video' ? (
              <video
                ref={videoRef}
                src={statuses[activeStatusIndex].media_url}
                controls
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src={statuses[activeStatusIndex].media_url}
                alt="Status Content"
                className="w-full h-full object-cover"
              />
            )}

            <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black via-black/60 to-transparent space-y-2">
              <p className="text-xs text-white leading-relaxed">
                {statuses[activeStatusIndex].caption}
              </p>
              <div className="flex justify-between items-center text-[10px] text-slate-400">
                <span>Admin Update</span>
                <span>{new Date(statuses[activeStatusIndex].created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}