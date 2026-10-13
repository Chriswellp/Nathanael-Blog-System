'use client';

import React, { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    JitsiMeetExternalAPI: any;
  }
}

interface LiveRoomModalProps {
  roomUrl: string;
  onClose: () => void;
  isAdmin?: boolean;
  displayName?: string;
}

export default function LiveRoomModal({
  roomUrl,
  onClose,
  isAdmin = false,
  displayName = 'User',
}: LiveRoomModalProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const jitsiApiRef = useRef<any>(null);
  const [loading, setLoading] = useState(true);

  const JAAS_APP_ID = 'vpaas-magic-cookie-d7a033bc3ccc4d20a24603cc4e8d318f';

  const cleanRoomName = (url: string) => {
    try {
      const parsed = new URL(url);
      return parsed.pathname.replace(/^\//, '');
    } catch {
      return url.replace('https://meet.jit.si/', '').split('#')[0];
    }
  };

  useEffect(() => {
    const rawName = cleanRoomName(roomUrl);
    const jaasRoomPath = `${JAAS_APP_ID}/${rawName}`;

    const initJitsi = async () => {
      try {
        const tokenRes = await fetch('/api/jaas-token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            roomName: rawName,
            userName: displayName,
            isAdmin: isAdmin,
          }),
        });

        const tokenData = await tokenRes.json();
        const jwtToken = tokenData.token;

        if (!containerRef.current || !window.JitsiMeetExternalAPI) return;

        if (jitsiApiRef.current) {
          jitsiApiRef.current.dispose();
        }

        const options = {
          roomName: jaasRoomPath,
          width: '100%',
          height: '100%',
          parentNode: containerRef.current,
          jwt: jwtToken,
          userInfo: {
            displayName: displayName,
          },
          configOverwrite: {
            startWithAudioMuted: !isAdmin,
            startWithVideoMuted: false,
            prejoinPageEnabled: false,
            disableDeepLinking: true,
            enableWelcomePage: false,

            // FORCE LOBBY & WAITING ROOM
            lobby: {
              autoKnock: true,
              enablePassword: false, // Prevents PIN prompt
            },
            hideLobbyButton: true,
            
            // TOOLBAR CONFIGURATION (Modern JaaS standard)
            toolbarButtons: [
              'microphone',
              'camera',
              'desktop',
              'chat', // Restores chat button
              'raisehand',
              'tileview',
              'fullscreen',
              'hangup',
            ],
          },
          interfaceConfigOverwrite: {
            SHOW_JITSI_WATERMARK: false,
            SHOW_WATERMARK_FOR_GUESTS: false,
            MOBILE_APP_PROMO: false,
            HIDE_LOBBY_BUTTON: true,
          },
        };

        const api = new window.JitsiMeetExternalAPI('8x8.vc', options);
        jitsiApiRef.current = api;
        setLoading(false);

        api.addEventListener('videoConferenceJoined', () => {
          if (isAdmin) {
            // Enable lobby mode when the moderator joins so subsequent clients must wait
            api.executeCommand('toggleLobby', true);
          }
        });

        api.addEventListener('videoConferenceLeft', () => {
          onClose();
        });
      } catch (err) {
        console.error('Failed to initialize meeting:', err);
      }
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
  }, [roomUrl, isAdmin, displayName, onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-2 sm:p-6">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden shadow-2xl">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
            </span>
            <h3 className="text-sm font-bold text-slate-100">
              {isAdmin ? 'Host Room (Moderator Controls)' : 'Live Session'}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-bold transition cursor-pointer"
            >
              Leave Call ✕
            </button>
          </div>
        </div>

        {/* Video Stage */}
        <div className="flex-1 w-full bg-black relative">
          {loading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-300 z-10 bg-slate-950">
              <div className="w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mb-3"></div>
              <p className="text-xs font-medium">Connecting to session...</p>
            </div>
          )}
          <div ref={containerRef} className="w-full h-full" />
        </div>

      </div>
    </div>
  );
}