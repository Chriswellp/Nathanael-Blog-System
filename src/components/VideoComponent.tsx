'use client';

import React from 'react';
import { JitsiMeeting } from '@jitsi/react-sdk';

interface VideoComponentProps {
  roomName?: string;
  userName?: string;
}

export default function VideoComponent({
  roomName = "YourCustomRoomNameHere",
  userName = "Guest User",
}: VideoComponentProps) {
  return (
    <div className="h-[700px] w-full rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
      <JitsiMeeting
        domain="meet.jit.si"
        roomName={roomName}
        configOverwrite={{
          disableDeepLinking: true,   // Stops mobile/web app redirection
          prejoinPageEnabled: false,  // Bypasses the Jitsi prejoin/PIN screen
          startWithAudioMuted: false,
          startWithVideoMuted: false,
        }}
        interfaceConfigOverwrite={{
          MOBILE_APP_PROMO: false,    // Suppresses app installation banners
        }}
        userInfo={{
          displayName: userName || 'Guest User',
          email: '',
        }}
        getIFrameRef={(parentNode) => {
          if (parentNode) {
            parentNode.style.height = '100%';
            parentNode.style.width = '100%';
          }
        }}
      />
    </div>
  );
}
