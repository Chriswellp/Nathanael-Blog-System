'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';

declare global {
  interface Window {
    JitsiMeetExternalAPI: any;
  }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface Message {
  id: string;
  user_name: string;
  message: string;
  created_at: string;
}

interface LiveSessionProps {
  streamId: string;
  streamTitle: string;
  meetingUrl: string;
}

export default function LiveSessionViewer({ streamId, streamTitle, meetingUrl }: LiveSessionProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [userName, setUserName] = useState('');
  const [hasJoinedChat, setHasJoinedChat] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const jitsiApiRef = useRef<any>(null);
  const [loadingVideo, setLoadingVideo] = useState(true);

  // 8x8 JaaS App ID
  const JAAS_APP_ID = 'vpaas-magic-cookie-d7a033bc3ccc4d20a24603cc4e8d318f';

  const cleanRoomName = (url: string) => {
    try {
      const parsed = new URL(url);
      return parsed.pathname.replace(/^\//, '');
    } catch {
      return url.replace('https://meet.jit.si/', '').split('#')[0];
    }
  };

  // 1. Initialize JaaS Video Stream Container
  useEffect(() => {
    const rawName = cleanRoomName(meetingUrl);
    const jaasRoomPath = `${JAAS_APP_ID}/${rawName}`;

    const initJitsi = () => {
      if (!containerRef.current || !window.JitsiMeetExternalAPI) return;

      if (jitsiApiRef.current) {
        jitsiApiRef.current.dispose();
      }

      const options = {
        roomName: jaasRoomPath,
        width: '100%',
        height: '100%',
        parentNode: containerRef.current,
        userInfo: {
          displayName: userName || 'Viewer',
        },
        configOverwrite: {
          startWithAudioMuted: true,
          startWithVideoMuted: true,
          prejoinPageEnabled: false,
          disableDeepLinking: true,
          enableWelcomePage: false,
          enableLobbyChat: false,
        },
        interfaceConfigOverwrite: {
          TOOLBAR_BUTTONS: [
            'microphone',
            'camera',
            'chat',
            'raisehand',
            'tileview',
            'fullscreen',
            'hangup',
          ],
          SHOW_JITSI_WATERMARK: false,
          SHOW_WATERMARK_FOR_GUESTS: false,
          MOBILE_APP_PROMO: false,
        },
      };

      const api = new window.JitsiMeetExternalAPI('8x8.vc', options);
      jitsiApiRef.current = api;
      setLoadingVideo(false);
    };

    const jaasScriptUrl = `https://8x8.vc/${JAAS_APP_ID}/external_api.js`;

    if (!window.JitsiMeetExternalAPI) {
      const script = document.createElement('script');
      script.src = jaasScriptUrl;
      script.async = true;
      script.onload = () => initJitsi();
      document.body.appendChild(script);
    } else {
      initJitsi();
    }

    return () => {
      if (jitsiApiRef.current) {
        jitsiApiRef.current.dispose();
      }
    };
  }, [meetingUrl, userName]);

  // 2. Fetch initial chat history and subscribe to Supabase Realtime changes
  useEffect(() => {
    const fetchChatHistory = async () => {
      const { data } = await supabase
        .from('live_chat_messages')
        .select('*')
        .eq('stream_id', streamId)
        .order('created_at', { ascending: true });

      if (data) setMessages(data);
    };

    fetchChatHistory();

    const channel = supabase
      .channel(`live_chat_${streamId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'live_chat_messages',
          filter: `stream_id=eq.${streamId}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [streamId]);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Send Chat Message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !userName.trim()) return;

    const { error } = await supabase.from('live_chat_messages').insert([
      {
        stream_id: streamId,
        user_name: userName,
        message: newMessage.trim(),
      },
    ]);

    if (!error) {
      setNewMessage('');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 bg-slate-950 p-4 sm:p-6 rounded-2xl border border-slate-800 shadow-2xl">
      {/* LEFT: Video Stage */}
      <div className="lg:col-span-3 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-serif font-bold text-slate-100">{streamTitle}</h2>
          <span className="flex items-center gap-2 bg-rose-500/10 text-rose-500 border border-rose-500/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider animate-pulse">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span> Live Broadcast
          </span>
        </div>

        {/* Embedded JaaS Room Container */}
        <div className="relative w-full aspect-video bg-slate-900 rounded-xl overflow-hidden border border-slate-800 shadow-inner">
          {loadingVideo && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 bg-slate-950 z-10">
              <div className="w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mb-3"></div>
              <p className="text-xs font-medium">Connecting to live stream...</p>
            </div>
          )}
          <div ref={containerRef} className="w-full h-full" />
        </div>
      </div>

      {/* RIGHT: Live Stream Chat */}
      <div className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-xl flex flex-col h-[500px] lg:h-auto overflow-hidden">
        <div className="p-3 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider font-mono">
            💬 Live Event Chat
          </h3>
          <span className="text-[10px] text-slate-500">{messages.length} messages</span>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 p-3 space-y-3 overflow-y-auto text-xs font-sans">
          {messages.length === 0 ? (
            <p className="text-slate-500 text-center py-8 italic text-[11px]">
              No messages yet. Say hello!
            </p>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800/80 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-400 text-[11px]">{msg.user_name}</span>
                  <span className="text-[9px] text-slate-500">
                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-slate-200 leading-relaxed break-words">{msg.message}</p>
              </div>
            ))
          )}
          <div ref={chatEndRef} />
        </div>

        {/* User Identity / Input */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/80">
          {!hasJoinedChat ? (
            <div className="space-y-2">
              <label className="block text-[10px] font-semibold text-slate-400">
                Enter your name to join chat:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="e.g. Dr. Alex"
                  className="w-full px-2.5 py-1.5 text-xs bg-slate-900 text-slate-100 rounded border border-slate-700 focus:outline-none focus:border-amber-400"
                />
                <button
                  type="button"
                  onClick={() => userName.trim() && setHasJoinedChat(true)}
                  className="bg-amber-400 text-slate-950 px-3 py-1.5 rounded font-bold text-xs hover:bg-amber-500 transition"
                >
                  Join
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={`Chat as ${userName}...`}
                className="w-full px-2.5 py-1.5 text-xs bg-slate-900 text-slate-100 rounded border border-slate-700 focus:outline-none focus:border-amber-400"
              />
              <button
                type="submit"
                className="bg-amber-400 text-slate-950 px-3 py-1.5 rounded font-bold text-xs hover:bg-amber-500 transition"
              >
                Send
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}