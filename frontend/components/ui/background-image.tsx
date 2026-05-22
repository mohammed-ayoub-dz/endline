// components/ui/background-image.tsx
'use client';

import MuxPlayer from '@mux/mux-player-react';

interface BackgroundVideoProps {
  playbackId: string;
}

export default function BackgroundVideo({ playbackId }: BackgroundVideoProps) {
  return (
    <>
      <style jsx global>{`
        mux-player::part(controls),
        mux-player::part(loading-indicator),
        mux-player::part(poster),
        mux-player::part(overlay),
        mux-player::part(play-button) {
          display: none !important;
        }
      `}</style>

      <MuxPlayer
        playbackId={playbackId}
        streamType="on-demand"
        muted
        autoPlay
        loop
        playsInline
        preload="auto"
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
         
          zIndex: 0,
        }}
      />
    </>
  );
}