'use client';

interface BackgroundVideoProps {
  src: string;
  poster?: string; 
}

export default function BackgroundVideoMP4({ src, poster }: BackgroundVideoProps) {
  return (
    <video
      autoPlay
      muted
      loop
      playsInline
      poster={poster}
      className="absolute top-0 left-0 h-full w-full object-cover"
      style={{
        position: 'absolute',
        top: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100vw',
        height: '100%',
        objectFit: 'cover',
        zIndex: 0,
      }}
    >
      <source src={src} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
}