'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/src/lib/supabaseClient';
import { User } from '@supabase/supabase-js';

interface Message {
  id: string;
  sender_id: string;
  receiver_id?: string;
  content: string;
  is_admin_reply: boolean;
  created_at: string;
}

interface NavbarProps {
  activePage: string;
  setActivePage: (page: string) => void;
  user?: User | null;
}

export default function Navbar({
  activePage,
  setActivePage,
  user,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileOpenGroup, setMobileOpenGroup] = useState<string | null>(null);

  // Chat Platform State
  const [showChatModal, setShowChatModal] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [currentUser, setCurrentUser] = useState<User | null>(user ?? null);
  const [loadingChat, setLoadingChat] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const router = useRouter();

  // Keep internal state in sync with passed user prop, fallback to client fetch
  useEffect(() => {
    if (user !== undefined) {
      setCurrentUser(user);
    } else {
      const getUser = async () => {
        const { data: { user: fetchedUser } } = await supabase.auth.getUser();
        setCurrentUser(fetchedUser ?? null);
      };
      getUser();
    }
  }, [user]);

  // Fetch history and subscribe to live messages when chat opens
  useEffect(() => {
    if (!showChatModal || !currentUser) return;

    fetchChatHistory();

    const channel = supabase
      .channel('chat_channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        (payload) => {
          const msg = payload.new as Message;
          if (msg.sender_id === currentUser.id || msg.receiver_id === currentUser.id) {
            setMessages((prev) => [...prev, msg]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [showChatModal, currentUser]);

  // Presence Tracking
  useEffect(() => {
    if (!currentUser) return;

    const presenceChannel = supabase.channel('online-users');

    presenceChannel.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        await presenceChannel.track({
          user_id: currentUser.id,
          online_at: new Date().toISOString(),
        });
      }
    });

    return () => {
      supabase.removeChannel(presenceChannel);
    };
  }, [currentUser]);

  // Auto-scroll chat window to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchChatHistory = async () => {
    if (!currentUser) return;
    
    setLoadingChat(true);
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(`sender_id.eq.${currentUser.id},receiver_id.eq.${currentUser.id}`)
      .order('created_at', { ascending: true });

    if (!error && data) {
      setMessages(data);
    }
    setLoadingChat(false);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUser) return;

    const msgContent = newMessage.trim();
    setNewMessage('');

    const { error } = await supabase.from('messages').insert([
      {
        sender_id: currentUser.id,
        content: msgContent,
        is_admin_reply: false,
      },
    ]);

    if (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleChatAction = () => {
    if (currentUser) {
      setMobileMenuOpen(false);
      setShowChatModal(true);
    } else {
      setMobileMenuOpen(false);
      router.push('/login');
    }
  };

  const navLinks = [
    { id: 'home', label: 'Home' },
    {
      id: 'about', label: 'About', items: [
        { id: 'about', label: 'Our Story' },
        { id: 'who-we-are', label: 'Who We Are' },
        { id: 'vision', label: 'Vision, Mission & Values' },
      ],
    },
    {
      id: 'swab', label: 'SWAB Hub', items: [
        { id: 'relocation-support', label: 'International Relocation Support' },
        { id: 'transition-programme', label: 'SWAB Transition Programme' },
        { id: 'probation-support', label: 'Probation & Practice Support' },
        { id: 'employer-induction', label: 'Employer Induction Programmes' },
        { id: 'training', label: 'Professional Development & Training' },
        { id: 'mentoring', label: 'Practice Education & Mentoring' },
      ],
    },
    {
      id: 'knowledge-hub', label: 'Knowledge Hub', items: [
        { id: 'practice-articles', label: 'Practice Articles & Perspectives' },
        { id: 'research', label: 'Research Reviews & Practice Insights' },
        { id: 'international-perspectives', label: 'International Perspectives' },
        { id: 'resources', label: 'Toolkits & Practice Resources' },
        { id: 'podcasts', label: 'Podcasts & Webinars' },
        { id: 'publications', label: 'Publications' },
      ],
    },
    {
      id: 'speaking', label: 'Speaking', items: [
        { id: 'keynote-speaking', label: 'Keynote Speaking' },
        { id: 'conferences', label: 'Conferences' },
        { id: 'university-lectures', label: 'University Lectures' },
        { id: 'professional-forums', label: 'Professional Forums' },
        { id: 'workforce-events', label: 'Workforce Development Events' },
      ],
    },
    {
      id: 'contact', label: 'Contact Us', items: [
        { id: 'contact', label: 'Contact SWAB' },
        { id: 'registration', label: 'Registration' },
        { id: 'partnerships', label: 'Partnership & Collaboration' },
      ],
    },
  ];

  const isGroupActive = (link: (typeof navLinks)[number]) =>
    activePage === link.id || ('items' in link && link.items?.some((item) => item.id === activePage));

  const navigateTo = (page: string) => {
    setActivePage(page);
    setMobileMenuOpen(false);
    setMobileOpenGroup(null);
  };

  return (
    <>
      {/* Sleek, Classic Top Navbar */}
      <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md text-white border-b border-amber-500/30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-14 sm:h-16">
          
          {/* Brand Logo & Title */}
          <div 
            onClick={() => {
              setActivePage('home');
              setMobileMenuOpen(false);
            }} 
            className="flex items-center gap-2.5 cursor-pointer select-none group"
          >
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 lg:w-11 lg:h-11 flex items-center justify-center shrink-0">
              <img 
                src="/logo1.png" 
                alt="Social Work Across Borders logo" 
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow" 
              />
            </div>
            <div className="flex flex-col justify-center">
              <span className="text-sm sm:text-base font-extrabold tracking-wide text-white leading-tight group-hover:text-amber-400 transition-colors">
                SOCIAL WORK
              </span>
              <span className="text-[9px] text-amber-400 font-sans tracking-[0.16em] uppercase font-semibold leading-tight">
                Across Borders · SWAB
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav aria-label="Main navigation" className="hidden lg:flex items-center gap-1 xl:gap-2 text-xs font-semibold">
            {navLinks.map((link) => (
              <div key={link.id} className="relative group">
                <button
                  type="button"
                  onClick={() => navigateTo(link.id)}
                  aria-haspopup={'items' in link ? 'true' : undefined}
                  className={`inline-flex items-center gap-1 rounded-lg px-3 py-2.5 transition-all duration-200 whitespace-nowrap ${
                    isGroupActive(link)
                      ? 'bg-amber-400/10 text-amber-300'
                      : 'text-slate-200 hover:bg-white/5 hover:text-amber-300'
                  }`}
                >
                  {link.label}
                  {'items' in link && <svg className="h-3 w-3 opacity-70" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.09 1.032l-4.255 4.516a.75.75 0 01-1.09 0L5.21 8.26a.75.75 0 01.02-1.05z" clipRule="evenodd" /></svg>}
                </button>
                {'items' in link && (
                  <div className="invisible absolute left-0 top-full z-50 mt-2 w-72 translate-y-1 rounded-xl border border-slate-700/80 bg-slate-950 p-2 opacity-0 shadow-2xl shadow-black/30 transition-all duration-150 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                    {link.items?.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => navigateTo(item.id)}
                        className={`block w-full rounded-lg px-3 py-2.5 text-left text-xs leading-relaxed transition ${activePage === item.id ? 'bg-amber-400/15 font-bold text-amber-300' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center">
            <button
              onClick={handleChatAction}
              className="bg-amber-400 hover:bg-amber-500 text-slate-950 px-3.5 py-1.5 rounded-lg font-bold text-xs tracking-wider uppercase transition-all shadow-sm hover:shadow-amber-400/20 flex items-center gap-1.5 active:scale-95 cursor-pointer"
            >
              💬 Contact SWAB
            </button>
          </div>

          {/* Mobile Toggle Button */}
          <div className="flex lg:hidden items-center">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
              className="p-1.5 rounded-lg text-slate-200 hover:text-white bg-slate-800/80 active:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-400"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} 
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-700/80 bg-slate-950/98 px-4 pb-5 pt-3 shadow-2xl backdrop-blur-xl max-h-[calc(100vh-4rem)] overflow-y-auto">
            <nav aria-label="Mobile navigation" className="space-y-1">
              {navLinks.map((link) => (
                <div key={link.id} className="overflow-hidden rounded-xl">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => navigateTo(link.id)}
                      className={`min-w-0 flex-1 rounded-lg px-3.5 py-3 text-left text-sm font-semibold transition ${isGroupActive(link) ? 'bg-amber-400/10 text-amber-300' : 'text-slate-100 hover:bg-slate-800'}`}
                    >
                      {link.label}
                    </button>
                    {'items' in link && (
                      <button
                        type="button"
                        aria-label={`Toggle ${link.label} submenu`}
                        aria-expanded={mobileOpenGroup === link.id}
                        onClick={() => setMobileOpenGroup(mobileOpenGroup === link.id ? null : link.id)}
                        className="rounded-lg px-4 py-3 text-amber-300 hover:bg-slate-800"
                      >
                        <svg className={`h-4 w-4 transition-transform ${mobileOpenGroup === link.id ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.09 1.032l-4.255 4.516a.75.75 0 01-1.09 0L5.21 8.26a.75.75 0 01.02-1.05z" clipRule="evenodd" /></svg>
                      </button>
                    )}
                  </div>
                  {'items' in link && mobileOpenGroup === link.id && (
                    <div className="ml-3 border-l border-amber-400/30 py-1 pl-3">
                      {link.items?.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => navigateTo(item.id)}
                          className={`block w-full rounded-lg px-3 py-2.5 text-left text-xs leading-relaxed transition ${activePage === item.id ? 'font-bold text-amber-300' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>

            <div className="mt-4 border-t border-slate-800 pt-4">
              <button
                onClick={handleChatAction}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-400 px-4 py-3 text-xs font-extrabold uppercase tracking-wider text-slate-950 shadow-lg shadow-amber-950/20 transition hover:bg-amber-300 active:scale-[0.99]"
              >
                💬 Contact SWAB Support
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Floating Chat Modal */}
      {showChatModal && currentUser && (
        <div className="fixed inset-x-2 bottom-2 sm:inset-auto sm:bottom-4 sm:right-4 z-50 w-auto sm:w-[400px] h-[480px] max-h-[85vh] bg-slate-900 border border-amber-500/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          
          {/* Header */}
          <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <div>
                <h3 className="text-sm font-bold text-white leading-tight">Admin Support Chat</h3>
                <p className="text-[10px] text-amber-400 font-medium">Real-time Direct Message</p>
              </div>
            </div>
            <button
              onClick={() => setShowChatModal(false)}
              className="text-slate-400 hover:text-white text-base font-bold px-2 py-1 rounded transition hover:bg-slate-800"
            >
              ✕
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-950/50">
            {loadingChat ? (
              <div className="flex items-center justify-center h-full text-xs text-slate-400">
                Loading conversation history...
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center text-slate-400 p-4">
                <p className="text-xs font-medium">No prior messages.</p>
                <p className="text-[11px] text-slate-500 mt-1">Send a message to start a conversation with the administrator.</p>
              </div>
            ) : (
              messages.map((msg) => {
                const isAdmin = msg.is_admin_reply;
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isAdmin ? 'items-start' : 'items-end'}`}
                  >
                    <span className="text-[9px] text-slate-400 mb-0.5 px-1 font-semibold">
                      {isAdmin ? 'Admin' : 'You'}
                    </span>
                    <div
                      className={`max-w-[85%] rounded-xl px-3.5 py-2 text-xs leading-relaxed shadow-sm ${
                        isAdmin
                          ? 'bg-indigo-600 text-white rounded-bl-none border border-indigo-500/50'
                          : 'bg-amber-400 text-slate-950 font-medium rounded-br-none'
                      }`}
                    >
                      {msg.content}
                    </div>
                    <span className="text-[9px] text-slate-500 mt-1 px-1">
                      {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                );
              })
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input Form */}
          <form onSubmit={handleSendMessage} className="p-3 bg-slate-950 border-t border-slate-800 flex gap-2 shrink-0">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-slate-900 text-white placeholder-slate-500 text-xs px-3.5 py-2 rounded-lg border border-slate-800 focus:outline-none focus:border-amber-400 transition"
            />
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className="bg-amber-400 hover:bg-amber-500 disabled:opacity-50 text-slate-950 px-3.5 py-2 rounded-lg text-xs font-bold transition cursor-pointer"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </>
  );
}
