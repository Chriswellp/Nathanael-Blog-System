// components/VideoComponent.jsx
import React from 'react';
import { JitsiMeeting } from '@jitsi/react-sdk';

export default function VideoComponent({ roomName = "YourCustomRoomNameHere", userName = "" }) {
  return (
    <div style={{ height: '700px', width: '100%' }}>
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
          displayName: userName,
        }}
        getIFrameRef={(iframeRef) => {
          iframeRef.style.height = '100%';
          iframeRef.style.width = '100%';
        }}
      />
    </div>
  );
}